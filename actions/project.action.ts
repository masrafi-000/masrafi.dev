"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFileFromR2 } from "@/utils/image";
import { processImageInput } from "./upload.action";
import {
  ZCCreateProjectSchema,
  ZCUpdateProjectSchema,
  slugify,
  type ZCCreateProjectInput,
  type ZCUpdateProjectInput,
  type LinkIcon,
} from "@/validators/project.zod";

// Re-export category and upload actions for easy import access
export * from "./category.action";
export * from "./upload.action";

export type ActionResponse<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]> };

/**
 * Default include object for relational Project queries
 */
const defaultProjectInclude = {
  categories: true,
  links: true,
  gallery: {
    orderBy: {
      order: "asc" as const,
    },
  },
  contributors: true,
};

// ==========================================
// PROJECT QUERY ACTIONS
// ==========================================

export async function getAllProjects(options?: {
  featuredOnly?: boolean;
  categorySlug?: string;
  search?: string;
}) {
  try {
    const where: any = {};

    if (options?.featuredOnly) {
      where.featured = true;
    }

    if (options?.categorySlug) {
      where.categories = {
        some: {
          slug: options.categorySlug,
        },
      };
    }

    if (options?.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
        { technologies: { hasSome: [options.search] } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: defaultProjectInclude,
      orderBy: [
        { featured: "desc" },
        { year: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("[getAllProjects Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch projects.",
    };
  }
}

export async function getProjectById(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required." };
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: defaultProjectInclude,
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error(`[getProjectById Error for ID: ${id}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project.",
    };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    if (!slug) {
      return { success: false, error: "Project slug is required." };
    }

    const project = await prisma.project.findUnique({
      where: { slug },
      include: defaultProjectInclude,
    });

    if (!project) {
      return { success: false, error: "Project not found." };
    }

    return { success: true, data: project };
  } catch (error) {
    console.error(`[getProjectBySlug Error for slug: ${slug}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project.",
    };
  }
}

// ==========================================
// PROJECT MUTATION ACTIONS
// ==========================================

export async function createProject(
  rawInput: ZCCreateProjectInput | unknown
): Promise<ActionResponse> {
  try {
    // 1. Validation
    const parsed = ZCCreateProjectSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation error. Please check form inputs.",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data = parsed.data;

    // 2. Resolve fields and aliases
    const name = data.name;
    let slug = data.slug || slugify(name);
    const description = data.description || data.des || "";
    const longDescription = data.longDescription || data.ldes || "";
    const technologies =
      data.technologies.length > 0 ? data.technologies : data.tech || [];

    if (!description) {
      return { success: false, error: "Short description is required." };
    }
    if (!longDescription) {
      return { success: false, error: "Long description is required." };
    }

    // 3. Unique slug check
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // 4. R2 Image Uploads (featureImage, gallery, avatars) & Get R2 Public Access URLs
    const rawFeatureImage = data.featureImage || data.featureImg;
    const featureImageUrl = await processImageInput(rawFeatureImage, "projects");

    const galleryCreateProcessed = await Promise.all(
      (data.gallery || []).map(async (item, idx) => {
        let rawUrl: unknown = item;
        let alt: string | null = `${name} gallery image ${idx + 1}`;
        let order = idx;

        if (typeof item === "object" && item !== null && "url" in item) {
          rawUrl = (item as any).url;
          alt = (item as any).alt || alt;
          order = (item as any).order ?? order;
        }

        const uploadedUrl = await processImageInput(rawUrl, "gallery");
        return {
          url: uploadedUrl || "",
          alt,
          order,
        };
      })
    );
    const galleryCreate = galleryCreateProcessed.filter((g) => g.url !== "");

    const contributorsCreate = await Promise.all(
      (data.contributors || []).map(async (c) => {
        const avatarUrl = await processImageInput(c.avatar, "avatars");
        return {
          name: c.name,
          role: c.role || "Contributor",
          avatar: avatarUrl,
          githubUrl: c.githubUrl || c.gitUrl || null,
          website: c.website || null,
        };
      })
    );

    // 5. Resolve Categories Connection
    let categoryIdsToConnect: string[] = [];

    if (data.categoryIds && data.categoryIds.length > 0) {
      categoryIdsToConnect = data.categoryIds;
    } else {
      const cats = data.categories || data.category || [];
      for (const cat of cats) {
        if (typeof cat === "string") {
          categoryIdsToConnect.push(cat);
        } else if (typeof cat === "object" && cat !== null) {
          if (cat.id) {
            categoryIdsToConnect.push(cat.id);
          } else if (cat.name) {
            const catSlug = cat.slug || slugify(cat.name);
            const dbCategory = await prisma.category.upsert({
              where: { slug: catSlug },
              update: { name: cat.name },
              create: {
                name: cat.name,
                slug: catSlug,
                description: cat.description || cat.des || null,
              },
            });
            categoryIdsToConnect.push(dbCategory.id);
          }
        }
      }
    }

    categoryIdsToConnect = Array.from(new Set(categoryIdsToConnect));

    // 6. Relational Create Items
    const linksCreate = (data.links || []).map((link) => ({
      name: link.name,
      url: link.url,
      icon: (link.icon as LinkIcon) || null,
    }));

    // 7. Store Project & R2 Access URLs in DB
    const newProject = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        longDescription,
        year: data.year,
        featured: data.featured ?? false,
        featureImage: featureImageUrl,
        technologies,
        categories: {
          connect: categoryIdsToConnect.map((id) => ({ id })),
        },
        links: {
          create: linksCreate,
        },
        gallery: {
          create: galleryCreate,
        },
        contributors: {
          create: contributorsCreate,
        },
      },
      include: defaultProjectInclude,
    });

    // 8. Cache Revalidation
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);

    return {
      success: true,
      data: newProject,
      message: "Project created successfully with R2 image access URLs saved to database!",
    };
  } catch (error) {
    console.error("[createProject Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project.",
    };
  }
}

export async function updateProject(
  rawInput: ZCUpdateProjectInput | unknown
): Promise<ActionResponse> {
  try {
    // 1. Validation
    const parsed = ZCUpdateProjectSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        success: false,
        error: "Validation error. Please check form inputs.",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const data = parsed.data;
    const { id } = data;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: `Project with ID "${id}" does not exist.` };
    }

    // 2. Resolve fields and aliases
    const name = data.name || existing.name;
    let slug = data.slug || (data.name ? slugify(data.name) : existing.slug);
    const description = data.description || data.des || existing.description;
    const longDescription =
      data.longDescription || data.ldes || existing.longDescription;

    // Process featureImage R2 access URL update
    let featureImageUrl = existing.featureImage;
    if (data.featureImage !== undefined || data.featureImg !== undefined) {
      const rawFeature =
        data.featureImage !== undefined ? data.featureImage : data.featureImg;
      featureImageUrl = await processImageInput(rawFeature, "projects");
    }

    const technologies =
      data.technologies && data.technologies.length > 0
        ? data.technologies
        : data.tech || existing.technologies;

    if (slug !== existing.slug) {
      const slugConflict = await prisma.project.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    // 3. Process gallery images update & store R2 access URLs
    let galleryCreate:
      | Array<{ url: string; alt: string | null; order: number }>
      | undefined = undefined;

    if (data.gallery !== undefined) {
      const processedGallery = await Promise.all(
        data.gallery.map(async (item, idx) => {
          let rawUrl: unknown = item;
          let alt: string | null = `${name} gallery image ${idx + 1}`;
          let order = idx;

          if (typeof item === "object" && item !== null && "url" in item) {
            rawUrl = (item as any).url;
            alt = (item as any).alt || alt;
            order = (item as any).order ?? order;
          }

          const uploadedUrl = await processImageInput(rawUrl, "gallery");
          return {
            url: uploadedUrl || "",
            alt,
            order,
          };
        })
      );
      galleryCreate = processedGallery.filter((g) => g.url !== "");
    }

    // 4. Process contributors update & store avatar R2 access URLs
    let contributorsCreate:
      | Array<{
          name: string;
          role: string;
          avatar: string | null;
          githubUrl: string | null;
          website: string | null;
        }>
      | undefined = undefined;

    if (data.contributors !== undefined) {
      contributorsCreate = await Promise.all(
        data.contributors.map(async (c) => {
          const avatarUrl = await processImageInput(c.avatar, "avatars");
          return {
            name: c.name,
            role: c.role || "Contributor",
            avatar: avatarUrl,
            githubUrl: c.githubUrl || c.gitUrl || null,
            website: c.website || null,
          };
        })
      );
    }

    // 5. Resolve Categories
    let categoryIdsToConnect: string[] = [];
    if (data.categoryIds && data.categoryIds.length > 0) {
      categoryIdsToConnect = data.categoryIds;
    } else if (data.categories || data.category) {
      const cats = data.categories || data.category || [];
      for (const cat of cats) {
        if (typeof cat === "string") {
          categoryIdsToConnect.push(cat);
        } else if (typeof cat === "object" && cat !== null) {
          if (cat.id) {
            categoryIdsToConnect.push(cat.id);
          } else if (cat.name) {
            const catSlug = cat.slug || slugify(cat.name);
            const dbCategory = await prisma.category.upsert({
              where: { slug: catSlug },
              update: { name: cat.name },
              create: {
                name: cat.name,
                slug: catSlug,
                description: cat.description || cat.des || null,
              },
            });
            categoryIdsToConnect.push(dbCategory.id);
          }
        }
      }
    }

    // 6. Atomic Transaction
    const updatedProject = await prisma.$transaction(async (tx) => {
      if (data.links !== undefined) {
        await tx.projectLink.deleteMany({ where: { projectId: id } });
      }

      if (data.gallery !== undefined) {
        await tx.galleryImage.deleteMany({ where: { projectId: id } });
      }

      if (data.contributors !== undefined) {
        await tx.contributor.deleteMany({ where: { projectId: id } });
      }

      const linksCreate = (data.links || []).map((link) => ({
        name: link.name,
        url: link.url,
        icon: (link.icon as LinkIcon) || null,
      }));

      return await tx.project.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          longDescription,
          year: data.year ?? existing.year,
          featured: data.featured ?? existing.featured,
          featureImage: featureImageUrl,
          technologies,
          categories:
            categoryIdsToConnect.length > 0
              ? { set: categoryIdsToConnect.map((catId) => ({ id: catId })) }
              : undefined,
          links: data.links !== undefined ? { create: linksCreate } : undefined,
          gallery:
            galleryCreate !== undefined
              ? { create: galleryCreate }
              : undefined,
          contributors:
            contributorsCreate !== undefined
              ? { create: contributorsCreate }
              : undefined,
        },
        include: defaultProjectInclude,
      });
    });

    // 7. Cache Revalidation
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
    if (existing.slug !== slug) {
      revalidatePath(`/projects/${existing.slug}`);
    }

    return {
      success: true,
      data: updatedProject,
      message: "Project updated successfully!",
    };
  } catch (error) {
    console.error("[updateProject Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project.",
    };
  }
}

export async function deleteProject(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required for deletion." };
    }

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!existing) {
      return { success: false, error: "Project not found." };
    }

    const deleted = await prisma.project.delete({
      where: { id },
    });

    // Cleanup images from Cloudflare R2
    if (existing.featureImage) {
      deleteFileFromR2(existing.featureImage).catch(() => {});
    }
    for (const g of existing.gallery) {
      if (g.url) {
        deleteFileFromR2(g.url).catch(() => {});
      }
    }

    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${existing.slug}`);

    return {
      success: true,
      data: deleted,
      message: "Project deleted successfully!",
    };
  } catch (error) {
    console.error(`[deleteProject Error for ID: ${id}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project.",
    };
  }
}
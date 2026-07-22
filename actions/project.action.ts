"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ZCCreateProjectSchema,
  ZCUpdateProjectSchema,
  ZCCreateCategorySchema,
  ZCUpdateCategorySchema,
  slugify,
  type ZCCreateProjectInput,
  type ZCUpdateProjectInput,
  type ZCCreateCategoryInput,
  type LinkIcon,
} from "@/validators/project.zod";

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
    const featureImage = data.featureImage || data.featureImg || null;
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

    // 4. Resolve Categories Connection
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

    // 5. Relational Create Items
    const linksCreate = (data.links || []).map((link) => ({
      name: link.name,
      url: link.url,
      icon: (link.icon as LinkIcon) || null,
    }));

    const galleryCreate = (data.gallery || []).map((item, idx) => {
      if (typeof item === "string") {
        return {
          url: item,
          alt: `${name} gallery image ${idx + 1}`,
          order: idx,
        };
      }
      return {
        url: item.url,
        alt: item.alt || `${name} gallery image ${idx + 1}`,
        order: item.order ?? idx,
      };
    });

    const contributorsCreate = (data.contributors || []).map((c) => ({
      name: c.name,
      role: c.role || "Contributor",
      avatar: c.avatar || null,
      githubUrl: c.githubUrl || c.gitUrl || null,
      website: c.website || null,
    }));

    // 6. DB Creation
    const newProject = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        longDescription,
        year: data.year,
        featured: data.featured ?? false,
        featureImage,
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

    // 7. Cache Revalidation
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);

    return {
      success: true,
      data: newProject,
      message: "Project created successfully!",
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
    const featureImage =
      data.featureImage !== undefined
        ? data.featureImage
        : data.featureImg !== undefined
        ? data.featureImg
        : existing.featureImage;
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

    // 3. Resolve Categories
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

    // 4. Atomic Transaction
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

      const galleryCreate = (data.gallery || []).map((item, idx) => {
        if (typeof item === "string") {
          return {
            url: item,
            alt: `${name} gallery image ${idx + 1}`,
            order: idx,
          };
        }
        return {
          url: item.url,
          alt: item.alt || `${name} gallery image ${idx + 1}`,
          order: item.order ?? idx,
        };
      });

      const contributorsCreate = (data.contributors || []).map((c) => ({
        name: c.name,
        role: c.role || "Contributor",
        avatar: c.avatar || null,
        githubUrl: c.githubUrl || c.gitUrl || null,
        website: c.website || null,
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
          featureImage,
          technologies,
          categories:
            categoryIdsToConnect.length > 0
              ? { set: categoryIdsToConnect.map((catId) => ({ id: catId })) }
              : undefined,
          links: data.links !== undefined ? { create: linksCreate } : undefined,
          gallery: data.gallery !== undefined ? { create: galleryCreate } : undefined,
          contributors:
            data.contributors !== undefined
              ? { create: contributorsCreate }
              : undefined,
        },
        include: defaultProjectInclude,
      });
    });

    // 5. Cache Revalidation
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

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Project not found." };
    }

    const deleted = await prisma.project.delete({
      where: { id },
    });

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

// ==========================================
// CATEGORY ACTIONS
// ==========================================

export async function getProjectCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error("[getProjectCategories Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project categories.",
    };
  }
}

export async function createProjectCategory(
  input: string | ZCCreateCategoryInput
): Promise<ActionResponse> {
  try {
    const rawData = typeof input === "string" ? { name: input } : input;
    const parsed = ZCCreateCategorySchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation error for category.",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name, description } = parsed.data;
    const slug = parsed.data.slug || slugify(name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return {
        success: false,
        error: `Category with slug "${slug}" already exists.`,
      };
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
      },
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return {
      success: true,
      data: newCategory,
      message: "Category created successfully!",
    };
  } catch (error) {
    console.error("[createProjectCategory Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create category.",
    };
  }
}

export async function updateProjectCategory(
  id: string,
  input: string | Partial<ZCCreateCategoryInput>
): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    const rawData =
      typeof input === "string" ? { id, name: input } : { id, ...input };
    const parsed = ZCUpdateCategorySchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation error.",
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name, description } = parsed.data;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Category not found." };
    }

    let slug = parsed.data.slug;
    if (name && !slug) {
      slug = slugify(name);
    }

    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        return { success: false, error: `Category slug "${slug}" is already taken.` };
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug: slug ?? existing.slug,
        description: description !== undefined ? description : existing.description,
      },
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return {
      success: true,
      data: updatedCategory,
      message: "Category updated successfully!",
    };
  } catch (error) {
    console.error("[updateProjectCategory Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update category.",
    };
  }
}

export async function deleteProjectCategory(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Category not found." };
    }

    const deleted = await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");

    return {
      success: true,
      data: deleted,
      message: "Category deleted successfully!",
    };
  } catch (error) {
    console.error(`[deleteProjectCategory Error for ID: ${id}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category.",
    };
  }
}
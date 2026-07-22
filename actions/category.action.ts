"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ZCCreateCategorySchema,
  ZCUpdateCategorySchema,
  slugify,
  type ZCCreateCategoryInput,
} from "@/validators/project.zod";
import type { ActionResponse } from "./project.action";

// ==========================================
// CATEGORY QUERY ACTIONS
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

export async function getCategoryById(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: { select: { projects: true } },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found." };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error(`[getCategoryById Error for ID: ${id}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch category.",
    };
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    if (!slug) {
      return { success: false, error: "Category slug is required." };
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { projects: true } },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found." };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error(`[getCategoryBySlug Error for slug: ${slug}]:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch category.",
    };
  }
}

// ==========================================
// CATEGORY MUTATION ACTIONS
// ==========================================

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

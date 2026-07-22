import { z } from "zod";

export const LinkIconEnum = z.enum([
  "WEBSITE",
  "GITHUB",
  "GITLAB",
  "BITBUCKET",
  "FIGMA",
  "YOUTUBE",
  "DOCUMENTATION",
  "PLAYSTORE",
  "APPSTORE",
  "NPM",
  "OTHER",
]);

export type LinkIcon = z.infer<typeof LinkIconEnum>;

const NameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(100, "Name cannot exceed 100 characters.");

const UrlSchema = z.string().trim().url("Please provide a valid URL.");

const OptionalUrlSchema = z
  .string()
  .trim()
  .url("Please provide a valid URL.")
  .or(z.literal(""))
  .nullable()
  .optional();

const ImageOrFileSchema = z
  .any()
  .nullable()
  .optional();

export const SlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Slug must be at least 2 characters.")
  .max(120, "Slug cannot exceed 120 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain lowercase letters, numbers, and hyphens.",
  );

// --- Category Schemas ---
export const ZCCategorySchema = z.object({
  id: z.string().optional(),
  name: NameSchema,
  slug: SlugSchema.optional(),
  description: z
    .string()
    .trim()
    .max(300, "Category description cannot exceed 300 characters.")
    .nullable()
    .optional(),
  des: z.string().trim().max(300).nullable().optional(),
});

export type ZCTCategory = z.infer<typeof ZCCategorySchema>;

export const ZCCreateCategorySchema = z.object({
  name: NameSchema,
  slug: SlugSchema.optional(),
  description: z
    .string()
    .trim()
    .max(300, "Category description cannot exceed 300 characters.")
    .nullable()
    .optional(),
});

export type ZCCreateCategoryInput = z.infer<typeof ZCCreateCategorySchema>;

export const ZCUpdateCategorySchema = ZCCreateCategorySchema.partial().extend({
  id: z.string().min(1, "Category ID is required."),
});

export type ZCUpdateCategoryInput = z.infer<typeof ZCUpdateCategorySchema>;

// --- Project Link Schema ---
export const ZCLinkSchema = z.object({
  id: z.string().optional(),
  name: NameSchema,
  url: UrlSchema,
  icon: LinkIconEnum.nullable().optional(),
});

export type ZCLink = z.infer<typeof ZCLinkSchema>;

// --- Gallery Image Schema ---
export const ZCGalleryImageSchema = z.object({
  id: z.string().optional(),
  url: ImageOrFileSchema,
  alt: z.string().trim().max(200).nullable().optional(),
  order: z.number().int().default(0).optional(),
});

export type ZCGalleryImage = z.infer<typeof ZCGalleryImageSchema>;

// --- Contributor Schema ---
export const ZCContributorSchema = z.object({
  id: z.string().optional(),
  name: NameSchema,
  role: z
    .string()
    .trim()
    .min(1, "Role is required.")
    .max(100, "Role cannot exceed 100 characters."),
  avatar: ImageOrFileSchema,
  githubUrl: OptionalUrlSchema,
  website: OptionalUrlSchema,
  gitUrl: OptionalUrlSchema,
});

export type ZCContributor = z.infer<typeof ZCContributorSchema>;

// --- Project Schema ---
export const ZCProjectSchema = z.object({
  id: z.string().optional(),

  name: NameSchema,

  slug: SlugSchema.optional(),

  description: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters.")
    .max(500, "Short description cannot exceed 500 characters.")
    .optional(),
  des: z.string().trim().optional(),

  longDescription: z
    .string()
    .trim()
    .min(30, "Long description must be at least 30 characters.")
    .max(10000, "Long description cannot exceed 10000 characters.")
    .optional(),
  ldes: z.string().trim().optional(),

  year: z
    .number()
    .int("Year must be an integer.")
    .gte(2000, "Year cannot be earlier than 2000.")
    .lte(new Date().getFullYear() + 5, "Invalid project year."),

  featured: z.boolean().default(false),

  featureImage: ImageOrFileSchema,
  featureImg: ImageOrFileSchema,

  technologies: z
    .array(z.string().trim().min(1))
    .refine(
      (items) =>
        new Set(items.map((i) => i.toLowerCase())).size === items.length,
      {
        message: "Duplicate technologies are not allowed.",
      },
    )
    .default([]),
  tech: z.array(z.string()).optional(),

  categoryIds: z.array(z.string()).default([]),
  categories: z.array(z.union([z.string(), ZCCategorySchema])).optional(),
  category: z.array(ZCCategorySchema).optional(),

  links: z.array(ZCLinkSchema).default([]),

  gallery: z.array(z.union([ImageOrFileSchema, ZCGalleryImageSchema])).default([]),

  contributors: z.array(ZCContributorSchema).default([]),
});

export type ZCProject = z.infer<typeof ZCProjectSchema>;

// Input schema for creation
export const ZCCreateProjectSchema = ZCProjectSchema.omit({ id: true });
export type ZCCreateProjectInput = z.infer<typeof ZCCreateProjectSchema>;

// Input schema for update
export const ZCUpdateProjectSchema = ZCProjectSchema.extend({
  id: z.string().min(1, "Project ID is required."),
});
export type ZCUpdateProjectInput = z.infer<typeof ZCUpdateProjectSchema>;

/**
 * Helper to generate a clean URL slug from string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

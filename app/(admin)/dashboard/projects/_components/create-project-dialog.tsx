"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Plus,
  X,
  Upload,
  Trash2,
  ImagePlus,
  Link2,
  UserPlus,
  Sparkles,
  FolderGit2,
  Code2,
  Check,
  ChevronsUpDown,
  Loader2,
  Images,
  ImageIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import {
  ZCCreateProjectSchema,
  LinkIconEnum,
  slugify,
  type ZCCreateProjectInput,
} from "@/validators/project.zod";
import { getProjectCategories, createProjectCategory } from "@/actions/category.action";
import { createProject } from "@/actions/project.action";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export function CreateProjectDialog({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Categories & Tech Tag State
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [catPopoverOpen, setCatPopoverOpen] = useState(false);

  const [techInput, setTechInput] = useState("");
  const [featureImgPreview, setFeatureImgPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<Record<number, string>>({});
  const [avatarPreviews, setAvatarPreviews] = useState<Record<number, string>>({});

  // Load Categories on mount or dialog open
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await getProjectCategories();
      if (res.success && res.data) {
        setCategories(res.data as CategoryOption[]);
      }
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const res = await createProjectCategory(newCatName.trim());
      if (!res.success) {
        toast.error(res.error || "Failed to create category");
      } else {
        toast.success(`Category "${newCatName}" created!`);
        setNewCatName("");
        await fetchCategories();
      }
    } catch {
      toast.error("Error adding category");
    } finally {
      setAddingCat(false);
    }
  };

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ZCCreateProjectInput>({
    resolver: zodResolver(ZCCreateProjectSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      longDescription: "",
      year: new Date().getFullYear(),
      featured: false,
      featureImage: null,
      technologies: [],
      categoryIds: [],
      links: [],
      gallery: [],
      contributors: [],
    },
  });

  // Dynamic Array Handlers
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links" as never,
  });

  const {
    fields: galleryFields,
    append: appendGallery,
    remove: removeGallery,
  } = useFieldArray({
    control,
    name: "gallery" as never,
  });

  const {
    fields: contributorFields,
    append: appendContributor,
    remove: removeContributor,
  } = useFieldArray({
    control,
    name: "contributors" as never,
  });

  const watchName = watch("name");
  const watchTechs = watch("technologies") || [];
  const watchCategoryIds = watch("categoryIds") || [];

  // Auto-fill slug when name changes
  useEffect(() => {
    if (watchName) {
      setValue("slug", slugify(watchName), { shouldValidate: true });
    }
  }, [watchName, setValue]);

  // Technology Badge Handlers
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (!trimmed) return;
    if (watchTechs.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      toast.error("Technology already added.");
      return;
    }
    setValue("technologies", [...watchTechs, trimmed], { shouldValidate: true });
    setTechInput("");
  };

  const handleRemoveTech = (index: number) => {
    const updated = watchTechs.filter((_, i) => i !== index);
    setValue("technologies", updated, { shouldValidate: true });
  };

  // Feature Image Preview Handler
  const handleFeatureImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("featureImage", file, { shouldValidate: true });
      const previewUrl = URL.createObjectURL(file);
      setFeatureImgPreview(previewUrl);
    }
  };

  // Single Gallery Item File Change
  const handleGalleryFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`gallery.${index}.url` as never, file as never, { shouldValidate: true });
      const previewUrl = URL.createObjectURL(file);
      setGalleryPreviews((prev) => ({ ...prev, [index]: previewUrl }));
    }
  };

  // Bulk Gallery Upload Handler
  const handleBulkGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    fileList.forEach((file) => {
      const currentCount = galleryFields.length;
      const previewUrl = URL.createObjectURL(file);
      appendGallery({ url: file, alt: file.name.split(".")[0] } as never);
      setGalleryPreviews((prev) => ({ ...prev, [currentCount]: previewUrl }));
    });
    toast.success(`${fileList.length} image(s) added to gallery!`);
  };

  // Contributor Avatar File Change
  const handleAvatarFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`contributors.${index}.avatar` as never, file as never, { shouldValidate: true });
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreviews((prev) => ({ ...prev, [index]: previewUrl }));
    }
  };

  // Form Submit Handler
  const onSubmit = (data: ZCCreateProjectInput) => {
    console.log("========================================");
    console.log("🚀 CREATE PROJECT FORM SUBMITTED (RHF DATA):");
    console.log("========================================");
    console.dir(data, { depth: null });
    console.log("========================================\n");

    startTransition(async () => {
      try {
        const response = await createProject(data);
        console.log("SERVER ACTION RESPONSE:", response);

        if (response.success) {
          toast.success(response.message || "Project created successfully!");
          reset();
          setFeatureImgPreview(null);
          setGalleryPreviews({});
          setAvatarPreviews({});
          setOpen(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(response.error || "Failed to create project.");
        }
      } catch (err) {
        console.error("Error creating project:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold shadow-sm cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Add New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-primary" /> Create New Portfolio Project
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Fill in the project details, add categories, tech stack, links, and media gallery.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* SECTION 1: Basic Information */}
          <div className="space-y-4 border-b border-border/60 pb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Antigravity AI Portal"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <Label htmlFor="slug" className="text-sm font-medium">
                  URL Slug
                </Label>
                <Input
                  id="slug"
                  placeholder="antigravity-ai-portal"
                  {...register("slug")}
                  aria-invalid={!!errors.slug}
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">{errors.slug.message}</p>
                )}
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-sm font-medium">
                Short Summary / Teaser <span className="text-destructive">*</span>
              </Label>
              <Input
                id="description"
                placeholder="A high-performance AI workspace platform built with Next.js 16..."
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Long Description */}
            <div className="space-y-1.5">
              <Label htmlFor="longDescription" className="text-sm font-medium">
                Detailed Case Study / Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="longDescription"
                rows={4}
                placeholder="Elaborate on project goals, tech architecture, features, database structure, and achievements..."
                {...register("longDescription")}
                aria-invalid={!!errors.longDescription}
              />
              {errors.longDescription && (
                <p className="text-xs text-destructive">{errors.longDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Release Year */}
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-sm font-medium">
                  Release Year <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2026"
                  {...register("year", { valueAsNumber: true })}
                  aria-invalid={!!errors.year}
                />
                {errors.year && (
                  <p className="text-xs text-destructive">{errors.year.message}</p>
                )}
              </div>

              {/* Featured Switch */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/40 mt-2 sm:mt-0">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                    Feature on Homepage
                  </Label>
                  <p className="text-xs text-muted-foreground">Highlight this project in portfolio grid</p>
                </div>
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Switch
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Categories & Technology Stack */}
          <div className="space-y-4 border-b border-border/60 pb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" /> Classification & Tech Stack
            </h3>

            {/* Category Popover Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Categories <span className="text-xs text-muted-foreground">(Select one or more)</span>
              </Label>

              <div className="flex flex-wrap gap-2 mb-2">
                {watchCategoryIds.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Badge key={catId} variant="secondary" className="px-3 py-1 text-xs gap-1.5">
                      {cat?.name || catId}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                        onClick={() => {
                          setValue(
                            "categoryIds",
                            watchCategoryIds.filter((id) => id !== catId),
                            { shouldValidate: true }
                          );
                        }}
                      />
                    </Badge>
                  );
                })}
              </div>

              <Popover open={catPopoverOpen} onOpenChange={setCatPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal text-muted-foreground"
                  >
                    {loadingCategories
                      ? "Loading categories..."
                      : watchCategoryIds.length > 0
                      ? `${watchCategoryIds.length} category selected`
                      : "Select or add project categories..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 space-y-3" align="start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Available Categories
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                      {categories.map((cat) => {
                        const selected = watchCategoryIds.includes(cat.id);
                        return (
                          <div
                            key={cat.id}
                            onClick={() => {
                              if (selected) {
                                setValue(
                                  "categoryIds",
                                  watchCategoryIds.filter((id) => id !== cat.id),
                                  { shouldValidate: true }
                                );
                              } else {
                                setValue("categoryIds", [...watchCategoryIds, cat.id], {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted text-sm cursor-pointer transition-colors"
                          >
                            <span>{cat.name}</span>
                            {selected && <Check className="w-4 h-4 text-primary" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border pt-2 flex gap-1.5">
                    <Input
                      placeholder="New category..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddCategory}
                      disabled={addingCat || !newCatName.trim()}
                      className="h-8 text-xs px-2.5"
                    >
                      {addingCat ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Technologies Badges Input */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Technologies & Tools</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type technology (e.g. Next.js, Tailwind, Prisma) & click Add"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTech} variant="secondary">
                  Add Tag
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {watchTechs.map((tech, idx) => (
                  <Badge key={idx} variant="outline" className="px-3 py-1 text-xs gap-1.5 bg-card">
                    {tech}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
                      onClick={() => handleRemoveTech(idx)}
                    />
                  </Badge>
                ))}
              </div>
              {errors.technologies && (
                <p className="text-xs text-destructive">{errors.technologies.message}</p>
              )}
            </div>
          </div>

          {/* SECTION 3: Feature & Gallery Media Assets */}
          <div className="space-y-4 border-b border-border/60 pb-6">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-primary" /> Media Assets
            </h3>

            {/* Feature Cover Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cover / Feature Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-36 h-24 rounded-lg border-2 border-dashed border-border bg-muted/40 flex flex-col items-center justify-center overflow-hidden">
                  {featureImgPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featureImgPreview}
                      alt="Feature Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-muted-foreground">
                      <Upload className="w-6 h-6 mx-auto mb-1 opacity-60" />
                      <span className="text-[10px]">Select Cover</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeatureImgChange}
                    className="text-xs max-w-xs"
                  />
                  {featureImgPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive h-7 self-start"
                      onClick={() => {
                        setValue("featureImage", null, { shouldValidate: true });
                        setFeatureImgPreview(null);
                      }}
                    >
                      Remove Cover
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Images List with File Upload & Previews */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Gallery Images</Label>
                  <p className="text-xs text-muted-foreground">Upload multiple images to Showcase</p>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="bulk-gallery-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs cursor-pointer"
                      asChild
                    >
                      <span>
                        <Images className="w-3.5 h-3.5 mr-1 text-primary" /> Bulk Upload Images
                      </span>
                    </Button>
                  </label>
                  <input
                    id="bulk-gallery-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBulkGalleryUpload}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendGallery({ url: "", alt: "" } as never)}
                    className="h-8 text-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Empty Row
                  </Button>
                </div>
              </div>

              {galleryFields.length === 0 && (
                <div className="p-6 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground bg-card/30 flex flex-col items-center gap-2">
                  <ImageIcon className="w-6 h-6 opacity-40" />
                  <span>No gallery images added yet. Click &quot;Bulk Upload Images&quot; or &quot;Add Empty Row&quot;.</span>
                </div>
              )}

              {galleryFields.map((field, idx) => {
                const previewUrl = galleryPreviews[idx];
                return (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row gap-3 items-center p-3 rounded-lg border border-border bg-card/30"
                  >
                    {/* Thumbnail Preview */}
                    <div className="w-16 h-12 rounded border border-border bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 opacity-40" />
                      )}
                    </div>

                    {/* File Picker */}
                    <div className="flex-1 space-y-1 w-full">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleGalleryFileChange(idx, e)}
                        className="text-xs"
                      />
                    </div>

                    {/* Alt Text Input */}
                    <div className="flex-1 space-y-1 w-full">
                      <Input
                        placeholder="Alt Description (e.g. Dashboard view)..."
                        {...register(`gallery.${idx}.alt` as never)}
                        className="text-xs"
                      />
                    </div>

                    {/* Remove Button */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeGallery(idx);
                        setGalleryPreviews((prev) => {
                          const copy = { ...prev };
                          delete copy[idx];
                          return copy;
                        });
                      }}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: External Links */}
          <div className="space-y-4 border-b border-border/60 pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" /> External Links
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendLink({ name: "", url: "", icon: "WEBSITE" } as never)}
                className="h-8 text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
              </Button>
            </div>

            {linkFields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center p-3 rounded-lg border border-border bg-card/30">
                <div className="sm:col-span-4">
                  <Input
                    placeholder="Link Name (e.g. Live Demo, GitHub)"
                    {...register(`links.${idx}.name` as never)}
                    className="text-xs"
                  />
                </div>
                <div className="sm:col-span-5">
                  <Input
                    placeholder="https://..."
                    {...register(`links.${idx}.url` as never)}
                    className="text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Controller
                    control={control}
                    name={`links.${idx}.icon` as never}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {LinkIconEnum.options.map((icon) => (
                            <SelectItem key={icon} value={icon} className="text-xs">
                              {icon}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLink(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION 5: Contributors with Avatar File Upload */}
          <div className="space-y-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" /> Contributors
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendContributor({
                    name: "",
                    role: "Contributor",
                    avatar: "",
                    githubUrl: "",
                    website: "",
                  } as never)
                }
                className="h-8 text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Contributor
              </Button>
            </div>

            {contributorFields.map((field, idx) => {
              const avatarPreview = avatarPreviews[idx];
              return (
                <Card key={field.id} className="p-3 border-border/80 bg-card/40">
                  <CardContent className="p-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Contributor #{idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContributor(idx)}
                        className="text-xs text-destructive h-6 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <Input
                        placeholder="Name (e.g. Masrafi)"
                        {...register(`contributors.${idx}.name` as never)}
                        className="text-xs"
                      />
                      <Input
                        placeholder="Role (e.g. Lead Engineer)"
                        {...register(`contributors.${idx}.role` as never)}
                        className="text-xs"
                      />

                      {/* Avatar File Picker with Preview */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full border border-border bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                          {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserPlus className="w-3.5 h-3.5 opacity-40" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAvatarFileChange(idx, e)}
                          className="text-xs"
                        />
                      </div>

                      <Input
                        placeholder="GitHub URL (https://github.com/...)"
                        {...register(`contributors.${idx}.githubUrl` as never)}
                        className="text-xs"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <DialogFooter className="border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isPending}
              className="font-semibold cursor-pointer shadow-md"
            >
              {isSubmitting || isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Project...
                </>
              ) : (
                "Save & Submit Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

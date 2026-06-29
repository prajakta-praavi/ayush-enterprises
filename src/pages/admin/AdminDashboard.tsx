import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FileText,
  Layers3,
  LayoutGrid,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { categories, products, type Product } from "@/data/products";
import { serviceSections } from "@/data/brochure";

type ContentStatus = "Published" | "Draft";

type ProductDraft = Product & {
  slug: string;
  status: ContentStatus;
};

type ServiceDraft = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: ContentStatus;
  items: string[];
};

type BlogDraft = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: ContentStatus;
  author: string;
  publishedAt: string;
  readTime: string;
  coverLabel: string;
  excerpt: string;
  content: string;
};

const contentStatuses: ContentStatus[] = ["Published", "Draft"];
const blogCategories = ["Safety Guide", "Company Update", "Compliance", "Product Insight", "Training Tips"];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createId = (prefix: string) => {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${randomPart}`;
};

const emptySpecs = Array.from({ length: 4 }, () => ({ label: "", value: "" }));

const makeEmptyProduct = (): ProductDraft => ({
  id: createId("product"),
  name: "",
  slug: "",
  category: categories[1] ?? "Head Protection",
  image: "",
  shortDesc: "",
  description: "",
  specs: emptySpecs.map((spec) => ({ ...spec })),
  status: "Draft",
});

const makeEmptyService = (): ServiceDraft => ({
  id: createId("service"),
  title: "",
  slug: "",
  description: "",
  status: "Draft",
  items: ["", "", ""],
});

const makeEmptyBlog = (): BlogDraft => ({
  id: createId("blog"),
  title: "",
  slug: "",
  category: blogCategories[0],
  status: "Draft",
  author: "Aayush Editorial",
  publishedAt: "2026-04-27",
  readTime: "4 min read",
  coverLabel: "Draft",
  excerpt: "",
  content: "",
});

const initialProducts = products.map((product) => ({
  ...product,
  slug: slugify(product.name),
  status: "Published" as ContentStatus,
}));

const initialServices: ServiceDraft[] = serviceSections.map((section, index) => ({
  id: `service-${index + 1}`,
  title: section.title,
  slug: slugify(section.title),
  description: section.description,
  status: "Published",
  items: [...section.items],
}));

const initialBlogs: BlogDraft[] = [
  {
    id: "blog-1",
    title: "Choosing the right PPE for industrial sites",
    slug: "choosing-the-right-ppe-for-industrial-sites",
    category: "Safety Guide",
    status: "Published",
    author: "Aayush Editorial",
    publishedAt: "2026-04-12",
    readTime: "4 min read",
    coverLabel: "PPE",
    excerpt: "A practical checklist for selecting helmets, gloves, footwear and eye protection for mixed work sites.",
    content:
      "Use this space to outline the final article draft. Keep the tone practical, product-focused and easy to scan for procurement teams.",
  },
  {
    id: "blog-2",
    title: "How to prepare a basic workplace safety audit",
    slug: "how-to-prepare-a-basic-workplace-safety-audit",
    category: "Compliance",
    status: "Draft",
    author: "Aayush Editorial",
    publishedAt: "2026-04-20",
    readTime: "6 min read",
    coverLabel: "Audit",
    excerpt: "A short editorial for operations teams planning an internal safety review before an external inspection.",
    content:
      "Outline the audit stages here. This draft can later be connected to a CMS or database-backed blog module.",
  },
  {
    id: "blog-3",
    title: "What makes a safety product brochure easier to use",
    slug: "what-makes-a-safety-product-brochure-easier-to-use",
    category: "Product Insight",
    status: "Published",
    author: "Aayush Editorial",
    publishedAt: "2026-04-18",
    readTime: "5 min read",
    coverLabel: "Brochure",
    excerpt: "A layout and content guide for turning large product ranges into a clearer sales tool.",
    content:
      "Use this content block for the longer blog draft, supporting notes, internal comments or SEO copy when the backend is ready.",
  },
];

const AdminDashboard = () => {
  const [productItems, setProductItems] = useState<ProductDraft[]>(initialProducts);
  const [serviceItems, setServiceItems] = useState<ServiceDraft[]>(initialServices);
  const [blogItems, setBlogItems] = useState<BlogDraft[]>(initialBlogs);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialProducts[0]?.id ?? null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServices[0]?.id ?? null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(initialBlogs[0]?.id ?? null);

  const [productDraft, setProductDraft] = useState<ProductDraft>(initialProducts[0] ?? makeEmptyProduct());
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>(initialServices[0] ?? makeEmptyService());
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(initialBlogs[0] ?? makeEmptyBlog());

  const [productQuery, setProductQuery] = useState("");
  const [productCategory, setProductCategory] = useState("All");
  const [serviceQuery, setServiceQuery] = useState("");
  const [blogQuery, setBlogQuery] = useState("");

  const publishedCount = [...productItems, ...serviceItems, ...blogItems].filter(
    (item) => item.status === "Published",
  ).length;
  const draftCount = [...productItems, ...serviceItems, ...blogItems].filter((item) => item.status === "Draft").length;

  const filteredProducts = productItems.filter((item) => {
    const matchesQuery =
      item.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(productQuery.toLowerCase());
    const matchesCategory = productCategory === "All" || item.category === productCategory;
    return matchesQuery && matchesCategory;
  });

  const filteredServices = serviceItems.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(serviceQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(serviceQuery.toLowerCase());
    return matchesQuery;
  });

  const filteredBlogs = blogItems.filter((item) => {
    const query = blogQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query)
    );
  });

  const openProduct = (product: ProductDraft | null) => {
    if (!product) {
      setSelectedProductId(null);
      setProductDraft(makeEmptyProduct());
      return;
    }

    setSelectedProductId(product.id);
    setProductDraft(product);
  };

  const saveProduct = () => {
    if (!productDraft.name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    const nextProduct: ProductDraft = {
      ...productDraft,
      slug: productDraft.slug.trim() || slugify(productDraft.name),
      id: selectedProductId ?? productDraft.id,
    };

    setProductItems((current) => {
      if (selectedProductId) {
        return current.map((item) => (item.id === selectedProductId ? nextProduct : item));
      }

      return [nextProduct, ...current];
    });
    setSelectedProductId(nextProduct.id);
    setProductDraft(nextProduct);
    toast.success("Product saved locally. Connect the database later.");
  };

  const deleteProduct = () => {
    if (!selectedProductId) {
      return;
    }

    const target = productItems.find((item) => item.id === selectedProductId);
    if (!target) {
      return;
    }

    if (!window.confirm(`Delete ${target.name}?`)) {
      return;
    }

    setProductItems((current) => current.filter((item) => item.id !== selectedProductId));
    const fallback = productItems.filter((item) => item.id !== selectedProductId)[0] ?? null;
    openProduct(fallback);
    toast.success("Product removed locally.");
  };

  const openService = (service: ServiceDraft | null) => {
    if (!service) {
      setSelectedServiceId(null);
      setServiceDraft(makeEmptyService());
      return;
    }

    setSelectedServiceId(service.id);
    setServiceDraft(service);
  };

  const saveService = () => {
    if (!serviceDraft.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    const nextService: ServiceDraft = {
      ...serviceDraft,
      slug: serviceDraft.slug.trim() || slugify(serviceDraft.title),
      items: serviceDraft.items.map((item) => item.trim()).filter(Boolean),
      id: selectedServiceId ?? serviceDraft.id,
    };

    setServiceItems((current) => {
      if (selectedServiceId) {
        return current.map((item) => (item.id === selectedServiceId ? nextService : item));
      }

      return [nextService, ...current];
    });
    setSelectedServiceId(nextService.id);
    setServiceDraft(nextService);
    toast.success("Service saved locally. Connect the database later.");
  };

  const deleteService = () => {
    if (!selectedServiceId) {
      return;
    }

    const target = serviceItems.find((item) => item.id === selectedServiceId);
    if (!target) {
      return;
    }

    if (!window.confirm(`Delete ${target.title}?`)) {
      return;
    }

    setServiceItems((current) => current.filter((item) => item.id !== selectedServiceId));
    const fallback = serviceItems.filter((item) => item.id !== selectedServiceId)[0] ?? null;
    openService(fallback);
    toast.success("Service removed locally.");
  };

  const openBlog = (blog: BlogDraft | null) => {
    if (!blog) {
      setSelectedBlogId(null);
      setBlogDraft(makeEmptyBlog());
      return;
    }

    setSelectedBlogId(blog.id);
    setBlogDraft(blog);
  };

  const saveBlog = () => {
    if (!blogDraft.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }

    const nextBlog: BlogDraft = {
      ...blogDraft,
      slug: blogDraft.slug.trim() || slugify(blogDraft.title),
      id: selectedBlogId ?? blogDraft.id,
    };

    setBlogItems((current) => {
      if (selectedBlogId) {
        return current.map((item) => (item.id === selectedBlogId ? nextBlog : item));
      }

      return [nextBlog, ...current];
    });
    setSelectedBlogId(nextBlog.id);
    setBlogDraft(nextBlog);
    toast.success("Blog saved locally. Connect the database later.");
  };

  const deleteBlog = () => {
    if (!selectedBlogId) {
      return;
    }

    const target = blogItems.find((item) => item.id === selectedBlogId);
    if (!target) {
      return;
    }

    if (!window.confirm(`Delete ${target.title}?`)) {
      return;
    }

    setBlogItems((current) => current.filter((item) => item.id !== selectedBlogId));
    const fallback = blogItems.filter((item) => item.id !== selectedBlogId)[0] ?? null;
    openBlog(fallback);
    toast.success("Blog removed locally.");
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border-2 border-secondary bg-[radial-gradient(circle_at_top_left,hsl(var(--primary))/0.18,transparent_35%),linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--background))_90%)] p-6 shadow-bold md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 border-2 border-secondary bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-[0.3em]">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Content Studio
            </div>
            <h1 className="mt-4 font-display text-4xl uppercase leading-tight md:text-6xl">
              Build the admin UI first. Connect the database later.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Products can be organized by category, services can be edited section by section, and blogs can be
              drafted, reviewed and published from the same workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="border-2 border-secondary font-bold uppercase tracking-wider">
              <Link to="/products">
                View Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="border-2 border-secondary bg-secondary font-bold uppercase tracking-wider text-secondary-foreground hover:bg-secondary/90">
              <Link to="/public-release">Open Public Release</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-secondary shadow-bold">
            <CardContent className="p-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Products</div>
              <div className="mt-2 text-3xl font-black leading-none">{productItems.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">Organized by public category</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-secondary shadow-bold">
            <CardContent className="p-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Services</div>
              <div className="mt-2 text-3xl font-black leading-none">{serviceItems.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">Editable brochure sections</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-secondary shadow-bold">
            <CardContent className="p-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Blogs</div>
              <div className="mt-2 text-3xl font-black leading-none">{blogItems.length}</div>
              <p className="mt-2 text-sm text-muted-foreground">Draft and publish workflow</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-secondary shadow-bold">
            <CardContent className="p-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Drafts</div>
              <div className="mt-2 text-3xl font-black leading-none">{draftCount}</div>
              <p className="mt-2 text-sm text-muted-foreground">{publishedCount} published locally</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Tabs defaultValue="products" className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList className="h-auto flex-wrap justify-start gap-2 border-2 border-secondary bg-card p-2 shadow-bold">
            <TabsTrigger value="products" className="gap-2 px-4 py-3 uppercase tracking-wider">
              <LayoutGrid className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2 px-4 py-3 uppercase tracking-wider">
              <Layers3 className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="blogs" className="gap-2 px-4 py-3 uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              Blogs
            </TabsTrigger>
          </TabsList>

          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            Local state only
          </div>
        </div>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <Card className="border-2 border-secondary shadow-bold">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-3xl uppercase">Product Library</CardTitle>
                    <CardDescription>Pick a product to edit or start a fresh draft.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => openProduct(null)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={productQuery}
                      onChange={(event) => setProductQuery(event.target.value)}
                      placeholder="Search products"
                      className="h-12 border-2 border-secondary pl-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider">Category filter</Label>
                    <select
                      value={productCategory}
                      onChange={(event) => setProductCategory(event.target.value)}
                      className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ScrollArea className="h-[760px] pr-3">
                  <div className="space-y-3">
                    {filteredProducts.map((product) => {
                      const active = selectedProductId === product.id;

                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => openProduct(product)}
                          className={cn(
                            "w-full rounded-2xl border-2 p-4 text-left transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-secondary/70 bg-muted/30 hover:border-secondary hover:bg-card",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display text-xl uppercase leading-tight">{product.name}</div>
                              <div
                                className={cn(
                                  "mt-1 text-sm",
                                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                                )}
                              >
                                {product.shortDesc}
                              </div>
                            </div>
                            <Badge variant={active ? "outline" : "secondary"}>{product.status}</Badge>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant={active ? "outline" : "default"}>{product.category}</Badge>
                            <Badge variant={active ? "outline" : "secondary"}>{product.slug}</Badge>
                          </div>
                        </button>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <div className="rounded-2xl border-2 border-dashed border-secondary/50 bg-muted/20 p-6 text-sm text-muted-foreground">
                        No products match the current search or category filter.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-2 border-secondary shadow-bold">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-display text-3xl uppercase">
                        {selectedProductId ? "Edit Product" : "Create Product"}
                      </CardTitle>
                      <CardDescription>
                        Assign the product to a category, refine the copy, and keep the specs editable.
                      </CardDescription>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={saveProduct}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={deleteProduct}
                        className="border-2 border-secondary font-bold uppercase tracking-wider"
                        disabled={!selectedProductId}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product name</Label>
                      <Input
                        id="product-name"
                        value={productDraft.name}
                        onChange={(event) => setProductDraft((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Industrial Safety Helmet"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-slug">Slug</Label>
                      <Input
                        id="product-slug"
                        value={productDraft.slug}
                        onChange={(event) => setProductDraft((current) => ({ ...current, slug: event.target.value }))}
                        placeholder="industrial-safety-helmet"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <select
                        id="product-category"
                        value={productDraft.category}
                        onChange={(event) => setProductDraft((current) => ({ ...current, category: event.target.value }))}
                        className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                      >
                        {categories
                          .filter((category) => category !== "All")
                          .map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-status">Status</Label>
                      <select
                        id="product-status"
                        value={productDraft.status}
                        onChange={(event) =>
                          setProductDraft((current) => ({
                            ...current,
                            status: event.target.value as ContentStatus,
                          }))
                        }
                        className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                      >
                        {contentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-image">Image source</Label>
                    <Input
                      id="product-image"
                      value={productDraft.image}
                      onChange={(event) => setProductDraft((current) => ({ ...current, image: event.target.value }))}
                      placeholder="/assets/product-helmet.jpg"
                      className="h-12 border-2 border-secondary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Keep this as an asset path or URL now. The upload flow can be added after the database.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-short">Short description</Label>
                    <Textarea
                      id="product-short"
                      value={productDraft.shortDesc}
                      onChange={(event) =>
                        setProductDraft((current) => ({ ...current, shortDesc: event.target.value }))
                      }
                      placeholder="One-line summary for cards and listings."
                      className="min-h-[90px] border-2 border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description">Description</Label>
                    <Textarea
                      id="product-description"
                      value={productDraft.description}
                      onChange={(event) =>
                        setProductDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Full product description for detail views."
                      className="min-h-[150px] border-2 border-secondary"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Specs</Label>
                      <Badge variant="secondary">{productDraft.specs.length} rows</Badge>
                    </div>
                    <div className="space-y-3">
                      {productDraft.specs.map((spec, index) => (
                        <div key={`${productDraft.id}-spec-${index}`} className="grid gap-3 md:grid-cols-2">
                          <Input
                            value={spec.label}
                            onChange={(event) =>
                              setProductDraft((current) => ({
                                ...current,
                                specs: current.specs.map((entry, specIndex) =>
                                  specIndex === index ? { ...entry, label: event.target.value } : entry,
                                ),
                              }))
                            }
                            placeholder={`Spec label ${index + 1}`}
                            className="h-12 border-2 border-secondary"
                          />
                          <Input
                            value={spec.value}
                            onChange={(event) =>
                              setProductDraft((current) => ({
                                ...current,
                                specs: current.specs.map((entry, specIndex) =>
                                  specIndex === index ? { ...entry, value: event.target.value } : entry,
                                ),
                              }))
                            }
                            placeholder={`Spec value ${index + 1}`}
                            className="h-12 border-2 border-secondary"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary bg-secondary text-secondary-foreground shadow-bold">
                <CardHeader>
                  <CardTitle className="font-display text-3xl uppercase">Live Preview</CardTitle>
                  <CardDescription className="text-secondary-foreground/80">
                    This is how the product content reads before it is connected to real data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="overflow-hidden rounded-3xl border-2 border-background bg-background text-foreground">
                    {productDraft.image ? (
                      <img src={productDraft.image} alt={productDraft.name || "Product preview"} className="h-56 w-full object-cover" />
                    ) : (
                      <div className="grid h-56 place-items-center bg-muted text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
                        Image preview
                      </div>
                    )}

                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{productDraft.status || "Draft"}</Badge>
                        <Badge variant="outline">{productDraft.category || "No category"}</Badge>
                      </div>
                      <div>
                        <h3 className="font-display text-3xl uppercase leading-tight">
                          {productDraft.name || "Untitled product"}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {productDraft.shortDesc || "Add a concise one-line summary for the card preview."}
                        </p>
                      </div>

                      <Separator />

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {productDraft.description || "Add the long description so the detail page is ready for the next phase."}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {productDraft.specs
                          .filter((spec) => spec.label || spec.value)
                          .map((spec) => (
                            <div key={`${productDraft.id}-preview-${spec.label}`} className="rounded-2xl border border-border bg-muted/40 p-3">
                              <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                                {spec.label || "Spec"}
                              </div>
                              <div className="mt-1 text-sm font-semibold leading-snug">{spec.value || "Value"}</div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <Card className="border-2 border-secondary shadow-bold">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-3xl uppercase">Service Library</CardTitle>
                    <CardDescription>Edit each brochure service as a standalone section.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => openService(null)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New
                  </Button>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={serviceQuery}
                    onChange={(event) => setServiceQuery(event.target.value)}
                    placeholder="Search services"
                    className="h-12 border-2 border-secondary pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ScrollArea className="h-[760px] pr-3">
                  <div className="space-y-3">
                    {filteredServices.map((service) => {
                      const active = selectedServiceId === service.id;

                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => openService(service)}
                          className={cn(
                            "w-full rounded-2xl border-2 p-4 text-left transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-secondary/70 bg-muted/30 hover:border-secondary hover:bg-card",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display text-xl uppercase leading-tight">{service.title}</div>
                              <div
                                className={cn(
                                  "mt-1 text-sm",
                                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                                )}
                              >
                                {service.description}
                              </div>
                            </div>
                            <Badge variant={active ? "outline" : "secondary"}>{service.status}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant={active ? "outline" : "default"}>{service.items.length} items</Badge>
                            <Badge variant={active ? "outline" : "secondary"}>{service.slug}</Badge>
                          </div>
                        </button>
                      );
                    })}

                    {filteredServices.length === 0 && (
                      <div className="rounded-2xl border-2 border-dashed border-secondary/50 bg-muted/20 p-6 text-sm text-muted-foreground">
                        No services match the current search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-2 border-secondary shadow-bold">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-display text-3xl uppercase">
                        {selectedServiceId ? "Edit Service" : "Create Service"}
                      </CardTitle>
                      <CardDescription>
                        Services behave like brochure sections, so the editor focuses on title, copy and item lists.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={saveService}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={deleteService}
                        className="border-2 border-secondary font-bold uppercase tracking-wider"
                        disabled={!selectedServiceId}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="service-title">Service title</Label>
                      <Input
                        id="service-title"
                        value={serviceDraft.title}
                        onChange={(event) => setServiceDraft((current) => ({ ...current, title: event.target.value }))}
                        placeholder="Training and Consulting"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service-slug">Slug</Label>
                      <Input
                        id="service-slug"
                        value={serviceDraft.slug}
                        onChange={(event) => setServiceDraft((current) => ({ ...current, slug: event.target.value }))}
                        placeholder="training-and-consulting"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="service-status">Status</Label>
                      <select
                        id="service-status"
                        value={serviceDraft.status}
                        onChange={(event) =>
                          setServiceDraft((current) => ({
                            ...current,
                            status: event.target.value as ContentStatus,
                          }))
                        }
                        className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                      >
                        {contentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Items count</Label>
                      <div className="flex h-12 items-center rounded-md border-2 border-secondary bg-muted/30 px-3 text-sm font-semibold">
                        {serviceDraft.items.filter(Boolean).length} active items
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service-description">Description</Label>
                    <Textarea
                      id="service-description"
                      value={serviceDraft.description}
                      onChange={(event) =>
                        setServiceDraft((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Short summary shown in the tab header."
                      className="min-h-[100px] border-2 border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="service-items">Items</Label>
                      <Badge variant="secondary">newline separated</Badge>
                    </div>
                    <Textarea
                      id="service-items"
                      value={serviceDraft.items.join("\n")}
                      onChange={(event) =>
                        setServiceDraft((current) => ({
                          ...current,
                          items: event.target.value.split("\n"),
                        }))
                      }
                      placeholder="Training topic one
Training topic two
Training topic three"
                      className="min-h-[280px] border-2 border-secondary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary bg-secondary text-secondary-foreground shadow-bold">
                <CardHeader>
                  <CardTitle className="font-display text-3xl uppercase">Live Preview</CardTitle>
                  <CardDescription className="text-secondary-foreground/80">
                    This preview shows how the section will read on the public services page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-3xl border-2 border-background bg-background p-6 text-foreground">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{serviceDraft.status || "Draft"}</Badge>
                      <Badge variant="outline">{serviceDraft.items.filter(Boolean).length} bullets</Badge>
                    </div>
                    <h3 className="mt-4 font-display text-3xl uppercase leading-tight">
                      {serviceDraft.title || "Untitled service"}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {serviceDraft.description || "Add the short intro that appears before the bullet list."}
                    </p>

                    <Separator className="my-5" />

                    <div className="space-y-3">
                      {serviceDraft.items.filter(Boolean).length > 0 ? (
                        serviceDraft.items
                          .filter(Boolean)
                          .map((item) => (
                            <div key={item} className="flex gap-3 text-sm leading-relaxed">
                              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                              <span>{item}</span>
                            </div>
                          ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                          Add service items to preview the list.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blogs" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <Card className="border-2 border-secondary shadow-bold">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-3xl uppercase">Blog Library</CardTitle>
                    <CardDescription>Create editorial drafts and format the content before publishing.</CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() => openBlog(null)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New
                  </Button>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={blogQuery}
                    onChange={(event) => setBlogQuery(event.target.value)}
                    placeholder="Search blogs"
                    className="h-12 border-2 border-secondary pl-9"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ScrollArea className="h-[760px] pr-3">
                  <div className="space-y-3">
                    {filteredBlogs.map((blog) => {
                      const active = selectedBlogId === blog.id;

                      return (
                        <button
                          key={blog.id}
                          type="button"
                          onClick={() => openBlog(blog)}
                          className={cn(
                            "w-full rounded-2xl border-2 p-4 text-left transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-secondary/70 bg-muted/30 hover:border-secondary hover:bg-card",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-display text-xl uppercase leading-tight">{blog.title}</div>
                              <div
                                className={cn(
                                  "mt-1 text-sm",
                                  active ? "text-primary-foreground/80" : "text-muted-foreground",
                                )}
                              >
                                {blog.excerpt}
                              </div>
                            </div>
                            <Badge variant={active ? "outline" : "secondary"}>{blog.status}</Badge>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge variant={active ? "outline" : "default"}>{blog.category}</Badge>
                            <Badge variant={active ? "outline" : "secondary"}>{blog.readTime}</Badge>
                          </div>
                        </button>
                      );
                    })}

                    {filteredBlogs.length === 0 && (
                      <div className="rounded-2xl border-2 border-dashed border-secondary/50 bg-muted/20 p-6 text-sm text-muted-foreground">
                        No blogs match the current search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="border-2 border-secondary shadow-bold">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-display text-3xl uppercase">
                        {selectedBlogId ? "Edit Blog" : "Create Blog"}
                      </CardTitle>
                      <CardDescription>
                        Use this panel to draft an article, set its category and shape the preview text.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={saveBlog}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={deleteBlog}
                        className="border-2 border-secondary font-bold uppercase tracking-wider"
                        disabled={!selectedBlogId}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="blog-title">Blog title</Label>
                      <Input
                        id="blog-title"
                        value={blogDraft.title}
                        onChange={(event) => setBlogDraft((current) => ({ ...current, title: event.target.value }))}
                        placeholder="The title shown in the blog list"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog-slug">Slug</Label>
                      <Input
                        id="blog-slug"
                        value={blogDraft.slug}
                        onChange={(event) => setBlogDraft((current) => ({ ...current, slug: event.target.value }))}
                        placeholder="blog-slug"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="blog-category">Category</Label>
                      <select
                        id="blog-category"
                        value={blogDraft.category}
                        onChange={(event) => setBlogDraft((current) => ({ ...current, category: event.target.value }))}
                        className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                      >
                        {blogCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog-status">Status</Label>
                      <select
                        id="blog-status"
                        value={blogDraft.status}
                        onChange={(event) =>
                          setBlogDraft((current) => ({
                            ...current,
                            status: event.target.value as ContentStatus,
                          }))
                        }
                        className="h-12 w-full rounded-md border-2 border-secondary bg-background px-3 text-sm"
                      >
                        {contentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="blog-author">Author</Label>
                      <Input
                        id="blog-author"
                        value={blogDraft.author}
                        onChange={(event) => setBlogDraft((current) => ({ ...current, author: event.target.value }))}
                        placeholder="Aayush Editorial"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog-date">Publish date</Label>
                      <Input
                        id="blog-date"
                        type="date"
                        value={blogDraft.publishedAt}
                        onChange={(event) =>
                          setBlogDraft((current) => ({ ...current, publishedAt: event.target.value }))
                        }
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blog-readtime">Read time</Label>
                      <Input
                        id="blog-readtime"
                        value={blogDraft.readTime}
                        onChange={(event) => setBlogDraft((current) => ({ ...current, readTime: event.target.value }))}
                        placeholder="4 min read"
                        className="h-12 border-2 border-secondary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blog-cover">Cover label</Label>
                    <Input
                      id="blog-cover"
                      value={blogDraft.coverLabel}
                      onChange={(event) => setBlogDraft((current) => ({ ...current, coverLabel: event.target.value }))}
                      placeholder="PPE / Audit / News"
                      className="h-12 border-2 border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blog-excerpt">Excerpt</Label>
                    <Textarea
                      id="blog-excerpt"
                      value={blogDraft.excerpt}
                      onChange={(event) => setBlogDraft((current) => ({ ...current, excerpt: event.target.value }))}
                      placeholder="A short paragraph used on the blog card."
                      className="min-h-[100px] border-2 border-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blog-content">Content</Label>
                    <Textarea
                      id="blog-content"
                      value={blogDraft.content}
                      onChange={(event) => setBlogDraft((current) => ({ ...current, content: event.target.value }))}
                      placeholder="Long-form article content."
                      className="min-h-[260px] border-2 border-secondary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary bg-secondary text-secondary-foreground shadow-bold">
                <CardHeader>
                  <CardTitle className="font-display text-3xl uppercase">Live Preview</CardTitle>
                  <CardDescription className="text-secondary-foreground/80">
                    This is the blog card and article preview before it hits the public site.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-3xl border-2 border-background bg-background text-foreground">
                    <div className="grid h-52 place-items-center bg-gradient-to-br from-muted to-card">
                      <div className="text-center">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                          {blogDraft.coverLabel || "Cover"}
                        </div>
                        <div className="mt-2 font-display text-3xl uppercase">{blogDraft.title || "Untitled post"}</div>
                      </div>
                    </div>
                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{blogDraft.status || "Draft"}</Badge>
                        <Badge variant="outline">{blogDraft.category || "No category"}</Badge>
                      </div>

                      <div>
                        <h3 className="font-display text-3xl uppercase leading-tight">
                          {blogDraft.title || "Untitled post"}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {blogDraft.publishedAt || "No date"}
                          </span>
                          <span>{blogDraft.readTime || "Read time"}</span>
                          <span>{blogDraft.author || "Unknown author"}</span>
                        </div>
                      </div>

                      <Separator />

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {blogDraft.excerpt || "Add a sharp excerpt to drive clicks from the card view."}
                      </p>

                      <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">
                        {blogDraft.content || "Use this preview panel to review the article body before publishing."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

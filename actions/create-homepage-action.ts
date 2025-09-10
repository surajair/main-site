import { getBrandConfig } from "@/lib/utils";

export const getHomepageBlocks = () => {
  const brandConfig = getBrandConfig();
  return [
    {
      _id: "amBjaf",
      _type: "Box",
      tag: "main",
      _name: "Main",
      styles: "#styles:,bg-gradient-to-t from-transparent to-primary/10",
    },
    {
      _id: "tykldr",
      _parent: "amBjaf",
      _type: "Box",
      tag: "main",
      _name: "Main",
      styles: "#styles:,min-h-screen container mx-auto flex",
    },
    {
      _id: "bpoalb",
      _parent: "tykldr",
      _type: "Box",
      tag: "section",
      _name: "Section",
      styles: "#styles:,flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8",
    },
    {
      _id: "zqDmDs",
      _parent: "bpoalb",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,max-w-3xl mx-auto text-center space-y-8 relative z-10",
    },
    {
      _id: "eBsCcc",
      _parent: "zqDmDs",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,flex items-center justify-center space-x-3 mb-6",
    },
    {
      _type: "Image",
      _id: "gjeeln",
      _parent: "eBsCcc",
      styles: "#styles:,w-12 h-12 rounded-xl",
      image: brandConfig.logo,
      alt: "",
      lazyLoading: true,
      width: "48",
      height: "48",
      mobileImage: "",
    },
    {
      _id: "rdDjhl",
      _parent: "eBsCcc",
      _type: "Span",
      tag: "span",
      styles: "#styles:,text-2xl font-bold",
      content: brandConfig.name || "Builder",
    },
    {
      _id: "zlbqpl",
      _parent: "zqDmDs",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles:
        "#styles:,inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground",
    },
    {
      _id: "dAyayx",
      _parent: "zlbqpl",
      _type: "Icon",
      styles: "#styles:, w-16px h-16px mr-2 h-4 w-4",
      height: "16",
      width: "16",
      icon: "<svg fill='currentColor' viewBox='0 0 20 20'><path fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd'></path></svg>",
    },
    {
      _id: "isBwtq",
      _parent: "zlbqpl",
      _type: "Span",
      tag: "span",
      styles: "#styles:,",
      content: "Welcome to Builder",
    },
    {
      _id: "CvonsB",
      _parent: "zqDmDs",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,space-y-4",
    },
    {
      _id: "iseBko",
      _parent: "CvonsB",
      _type: "Heading",
      tag: "h1",
      styles: "#styles:,text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
    },
    {
      _id: "atxwvw",
      _parent: "iseBko",
      _type: "Text",
      content: " Build amazing Websites ",
    },
    {
      _id: "xfBocr",
      _parent: "iseBko",
      _type: "Span",
      tag: "span",
      styles: "#styles:,text-muted-foreground",
      content: "with ease",
    },
    {
      _id: "dBoiBj",
      _parent: "CvonsB",
      _type: "Paragraph",
      content:
        " Get started with our powerful builder platform. Create, customize, and deploy your projects in minutes, not hours. ",
      styles: "#styles:,max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed",
    },
    {
      _id: "Babbxh",
      _parent: "zqDmDs",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,flex flex-wrap items-center justify-center gap-2 pt-8",
    },
    {
      _id: "llersp",
      _parent: "Babbxh",
      _type: "Span",
      tag: "span",
      styles:
        "#styles:,inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
      content: "⚡ Fast Setup",
    },
    {
      _id: "xlBklz",
      _parent: "Babbxh",
      _type: "Span",
      tag: "span",
      styles:
        "#styles:,inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
      content: "🎨 Customizable",
    },
    {
      _id: "txfxfa",
      _parent: "Babbxh",
      _type: "Span",
      tag: "span",
      styles:
        "#styles:,inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
      content: "📱 Responsive",
    },
    {
      _id: "uumbjh",
      _parent: "Babbxh",
      _type: "Span",
      tag: "span",
      styles:
        "#styles:,inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground",
      content: "🚀 Deploy Ready",
    },
    {
      _id: "ApbDdb",
      _parent: "amBjaf",
      _type: "Box",
      tag: "footer",
      _name: "Footer",
      styles: "#styles:,border-t border-border/20 bg-background/10 backdrop-blur-sm mt-auto relative z-10",
    },
    {
      _id: "ihqwos",
      _parent: "ApbDdb",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,px-4 sm:px-6 lg:px-8 py-6",
    },
    {
      _id: "mghbgs",
      _parent: "ihqwos",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,flex flex-col sm:flex-row items-center justify-between gap-4",
    },
    {
      _id: "tgAujz",
      _parent: "mghbgs",
      _type: "Box",
      tag: "div",
      _name: "Box",
      styles: "#styles:,flex items-center space-x-4 text-sm text-muted-foreground",
    },
    {
      _id: "tbocat",
      _parent: "tgAujz",
      _type: "Link",
      link: {
        href: "#",
      },
      styles: "#styles:,hover:text-foreground transition-colors",
      content: "Privacy",
    },
    {
      _id: "bleddt",
      _parent: "tgAujz",
      _type: "Link",
      link: {
        href: "#",
      },
      styles: "#styles:,hover:text-foreground transition-colors",
      content: "Terms",
    },
    {
      _id: "sAzdfg",
      _parent: "tgAujz",
      _type: "Link",
      link: {
        href: "#",
      },
      styles: "#styles:,hover:text-foreground transition-colors",
      content: "Contact",
    },
    {
      _id: "tzspsg",
      _parent: "mghbgs",
      _type: "Paragraph",
      content: " © 2024 Builder. All rights reserved. ",
      styles: "#styles:,text-sm text-muted-foreground",
    },
  ];
};

export async function createHomePage(appId: string, name: string, supabaseServer: any) {
  try {
    const { data, error } = await supabaseServer
      .from("app_pages")
      .insert({
        name: "Homepage",
        slug: "/",
        app: appId,
        pageType: "page",
        seo: {
          title: `Home - ${name}`,
          jsonLD: "",
          noIndex: false,
          ogImage: "",
          ogTitle: "",
          noFollow: "",
          description: `Build your ${name} website with Chai Builder`,
          searchTitle: "",
          cononicalUrl: "",
          ogDescription: "",
          searchDescription: "",
        },
        blocks: getHomepageBlocks(),
        online: true,
      })
      .select("*")
      .single();

    const { data: onlineData, error: onlineError } = await supabaseServer
      .from("app_pages_online")
      .insert({
        ...data,
        partialBlocks: null,
        links: null,
      })
      .select("*")
      .single();

    if (onlineError) throw onlineError;

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Failed to create home page",
    };
  }
}

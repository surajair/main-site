import { registerChaiPageType } from "chai-next/server";

registerChaiPageType("blog", {
  name: "Blog",
  helpText: "A blog post page.",
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a4 4 0 0 0 4 4h6z"/></svg>',
  dynamicSegments: "/[a-z0-9]+(?:-[a-z0-9]+)*$", // regex for slug. starts with / and should contain only lowercase letters, numbers and hyphens
  dynamicSlug: "{{slug}}",
  dataProvider: async () => {
    return {
      blog: {
        title: "Blog",
        description: "A blog post page.",
        posts: [
          {
            title: "Post 1",
          },
        ],
      },
    };
  },
});

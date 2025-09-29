## Chai Builder APPS:

CHai builder apps are the composible CMS peices which allows user to enhance the functionality of their websites. For eg: The basic builder offers a static site building experince. But if user needs blog functionality, they can use the blog builder app. This will be part of the plugins section in the builder.

User will see the builder apps in the plugins section in the builder. They can install and use them in their websites.
Pricing can be added to these apps(Optional). We will offer it as part of bundle.

Once the user installs the builder app, it will be see inside the builder (TBD). On clicking the builder app, it will open a 95% modal covering almost the entire screen. This modal will contain the builder app. It will have a close button on the top right corner and app itself will be loaded inside an iframe. The url and settings of these apps will come from the config of these apps.(probably from the db)

Once the app is loaded in frame, it can communicate to builder via our iframe apis. This can be saving the page, or loading a specific page in the builder or just reloading the builder. It can be anything.

Impact on site configs:
Each app can add few things dynamically to builder. Eg, pageTypes, collections, custom blocks, data providers etc.

eg: Blog app can add page types like 'Single blog', 'Blog Category', 'Blog Tag', 'Blog Author',

## TBD:

- Versioning of apps
- Testing apps
- hooks for apps
  - To add data into global data provider
- Custom blocks
- Data providers
- intall flow
- uninstall flow

### App config:

```ts
interface PageTypeConfig {
  id: string;
  name: string;
  icon: string;
  dynamicSegments: string;
  dynamicSlugLabel: string;
  seo?: Record<string, any>;
  JSONLD?: Record<string, any>;
}

interface CollectionConfig {
  id: string;
  name: string;
  filters: Record<string, any>;
  sorts: Record<string, any>;
}

interface AppDataProvider {
  id: string;
  name: string;
  request: {
    url: string;
    headers: Record<string, string>;
    queryParams: Record<string, string>;
  };
  pageTypes?: string[];
  collections?: string[];
}

interface AppConfig {
  versoin: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: string;
  description: string;
  icon: string;
  url: string;
  pageTypes: PageTypeConfig[];
  collections: CollectionConfig[];
  dataProviders: AppDataProvider[];
}
```

### Eg FAQ App

```ts
const FAQApp: AppConfig = {
  name: "FAQ App",
  createdAt: "2025-09-29T12:44:57+05:30",
  updatedAt: "2025-09-29T12:44:57+05:30",
  createdById: "",
  createdBy: "ChaiBuilder",
  description: "FAQ App",
  icon: "",
  url: "https://faq-app.chaibuilder.com",
  pageTypes: [
    {
      id: "faq",
      name: "FAQ",
      icon: "",
      dynamicSegments: "",
      dynamicSlugLabel: "",
      seo: {},
      JSONLD: {},
      dataProvider: "/api/data",
    },
  ],
  collections: [
    {
      id: "faq",
      name: "FAQ",
      filters: [{ id: "BY_SLUG", name: "By Slug", type: "slug" }],
      sorts: [{ id: "CREATED_AT", name: "Created At", type: "createdAt" }],
    },
  ],
};
```

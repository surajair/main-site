## Chai Builder APPS:

CHai builder apps are the composible CMS peices which allows user to enhance the functionality of their websites. For eg: The basic builder offers a static site building experince. But if user needs blog functionality, they can use the blog builder app. This will be part of the plugins section in the builder.

User will see the builder apps in the plugins section in the builder. They can install and use them in their websites.
Pricing can be added to these apps(Optional). We will offer it as part of bundle.

Once the user installs the builder app, it will be see inside the builder (TBD). On clicking the builder app, it will open a 95% modal covering almost the entire screen. This modal will contain the builder app. It will have a close button on the top right corner and app itself will be loaded inside an iframe. The url and settings of these apps will come from the config of these apps.(probably from the db)

Once the app is loaded in frame, it can communicate to builder via our iframe apis. This can be saving the page, or loading a specific page in the builder or just reloading the builder. It can be anything.

Impact on site configs:
Each app can add few things dynamically to builder. Eg, pageTypes, collections, custom blocks, data providers etc.

eg: Blog app can add page types like 'Single blog', 'Blog Category', 'Blog Tag', 'Blog Author',

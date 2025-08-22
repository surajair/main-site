## Chai builder + NextJS Starter

This is a starter project for Chai builder + NextJS.

## Requirements

- `CHAIBUILDER_API_KEY` - Get API KEY here [https://chaibuilder.com](https://chaibuilder.com/sites)

## Features

- Your Brand with drag and drop
- One click publish
- Revisions and restore
- Page lock (prevent multiple users from editing the same page)
- Multi-language support
- SEO ( Basic, Open Graph, JSON-LD )
- SSR and SSG support
  - Built in Vercel ISR support
- Themeable with Tailwind CSS(Shadcn themes)
- Global blocks for reusable content
- Draft preview mode (preview changes before publishing)
- Data binding with external data (e.g. from a CMS)
- Custom page blocks (e.g. a team page with a list of team members)
- Custom page types (e.g. a blog page template for all blogs)
- AI content generation ( with multilingual support )
- AI style editing
- Dark mode support

## Installation:

1. Fork this repo
2. `pnpm install`
3. Create a new .env file and add env variables from .env.sample
4. `pnpm dev`
5. Goto `/chai` route to login and edit in builder

## Stack

- NextJS15 + React 19
- Tailwind CSS 3.4+
- Shadcn UI
- TypeScript

## Development

We recomment using `pnpm` for development.

```bash
pnpm install
pnpm run dev
```

Navigate to `/chai` route to view the builder and publish. Sign in and start publishing your website.

## Deployment

We recomment using `Vercel` for deployment for better ISR support.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

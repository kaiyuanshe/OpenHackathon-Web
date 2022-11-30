# Open Hackathon - Web App

Open-source Hackathon Platform with Git-based Cloud Development Environment

[![CI & CD](https://github.com/kaiyuanshe/OpenHackathon-Web/actions/workflows/main.yml/badge.svg)][8]

## Key links

- [Task kanban](https://github.com/orgs/kaiyuanshe/projects/4?fullscreen=true)
- [UI design](https://www.figma.com/file/HKPV8IB4kxrAVAuuSBZKd1/Open-Hackathon)
- RESTful API
  - testing: https://hackathon-api-test.kaiyuanshe.cn/swagger/
  - production: https://hackathon-api.kaiyuanshe.cn/swagger/

## Technology stack

- Language: [TypeScript v4][2]
- Component engine: [Nextjs v12][3]
- Component suite: [Bootstrap v5][4]
- State management: [MobX][6]
- PWA framework: [Workbox v6][5]
- CI / CD: GitHub [Actions][11] + [Vercel][12]

## Getting Started

First, run the development server:

```bash
npm run dev
# or
npm i pnpm -g
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes][13] can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes][13] instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation][14] - learn about Next.js features and API.
- [Learn Next.js][15] - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository][16] - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform][12] from the creators of Next.js.

Check out our [Next.js deployment documentation][17] for more details.

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://nextjs.org/
[4]: https://getbootstrap.com/
[5]: https://developers.google.com/web/tools/workbox
[6]: https://github.com/mobxjs/mobx/tree/mobx4and5/docs
[8]: https://github.com/kaiyuanshe/OpenHackathon-Web/actions/workflows/main.yml
[11]: https://github.com/features/actions
[12]: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
[13]: https://nextjs.org/docs/api-routes/introduction
[14]: https://nextjs.org/docs
[15]: https://nextjs.org/learn
[16]: https://github.com/vercel/next.js/
[17]: https://nextjs.org/docs/deployment

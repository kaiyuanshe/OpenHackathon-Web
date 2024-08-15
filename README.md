# Open Hackathon - Web App

Open-source [Hackathon][1] Platform with **Git-based Cloud Development Environment**

[![CI & CD](https://github.com/kaiyuanshe/OpenHackathon-Web/actions/workflows/main.yml/badge.svg)][2]

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)][3]
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)][4]

## Key links

- [Task kanban](https://github.com/orgs/kaiyuanshe/projects/9/)
- [UI design](https://www.figma.com/file/HKPV8IB4kxrAVAuuSBZKd1/Open-Hackathon)
- Web entry
  - testing: https://test.hackathon.kaiyuanshe.cn/
  - production: https://hackathon.kaiyuanshe.cn/
- RESTful API
  - production: https://openhackathon-service-server.onrender.com/

## Technology stack

- Language: [TypeScript v5][5]
- Component engine: [Next.js v14][6]
- Component suite: [Bootstrap v5][7]
- State management: [MobX v6][8]
- PWA framework: [Workbox v6][9]
- CI / CD: GitHub [Actions][10] + [Vercel][11]

## Getting Started

First, run the development server:

```bash
npm i
npm run dev
# or
npm i pnpm -g
pnpm i
pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes][12] can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes][12] instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation][13] - learn about Next.js features and API.
- [Learn Next.js][14] - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository][15] - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform][11] from the creators of Next.js.

Check out our [Next.js deployment documentation][16] for more details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fkaiyuanshe%2FOpenHackathon-Web.svg?type=large)][17]

[1]: https://en.wikipedia.org/wiki/Hackathon
[2]: https://github.com/kaiyuanshe/OpenHackathon-Web/actions/workflows/main.yml
[3]: https://codespaces.new/kaiyuanshe/OpenHackathon-Web
[4]: https://gitpod.io/?autostart=true#https://github.com/kaiyuanshe/OpenHackathon-Web
[5]: https://www.typescriptlang.org/
[6]: https://nextjs.org/
[7]: https://getbootstrap.com/
[8]: https://mobx.js.org/
[9]: https://developers.google.com/web/tools/workbox
[10]: https://github.com/features/actions
[11]: https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme
[12]: https://nextjs.org/docs/api-routes/introduction
[13]: https://nextjs.org/docs
[14]: https://nextjs.org/learn
[15]: https://github.com/vercel/next.js/
[16]: https://nextjs.org/docs/deployment
[17]: https://app.fossa.com/projects/git%2Bgithub.com%2Fkaiyuanshe%2FOpenHackathon-Web?ref=badge_large

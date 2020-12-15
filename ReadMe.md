# Open Hackathon - Web App

**Progressive Web App** of [Open Hackathon platform][1] based on [WebCell v2][2]

[![NPM Dependency](https://david-dm.org/kaiyuanshe/OpenHackathon-Web.svg)][3]
[![CI & CD](https://github.com/kaiyuanshe/OpenHackathon-Web/workflows/CI%20&%20CD/badge.svg)][4]

## Key links

-   [Task kanban](https://github.com/kaiyuanshe/OpenHackathon-Web/projects/1?fullscreen=true)
-   UI design
    -   [Old site](https://hacking.kaiyuanshe.cn/)
    -   [New design](https://www.figma.com/file/HKPV8IB4kxrAVAuuSBZKd1/Open-Hackathon)
-   [RESTful API](https://github.com/kaiyuanshe/open-hackathon/wiki/Open-hackathon-Restful-API)

## Technology stack

-   Language: [TypeScript v4][5]
-   Component engine: [WebCell v2][6]
-   Component suite: [BootCell v1][7]
-   State management: [MobX v5][8]
-   PWA framework: [Workbox v6][9]
-   Package bundler: [Parcel v1][10]
-   CI / CD: GitHub [Actions][11] + [Pages][12]

## Development

```shell
cd ~/Desktop
git clone https://github.com/kaiyuanshe/OpenHackathon-Web.git
cd ~/Desktop/OpenHackathon-Web
npm install
npm start
```

## Deployment

```shell
cd ~/Desktop/OpenHackathon-Web
npm run build
```

[1]: https://hacking.kaiyuanshe.cn/
[2]: https://web-cell.dev/
[3]: https://david-dm.org/kaiyuanshe/OpenHackathon-Web
[4]: https://github.com/kaiyuanshe/OpenHackathon-Web/actions
[5]: https://typescriptlang.org
[6]: https://web-cell.dev/
[7]: https://bootstrap.web-cell.dev/
[8]: https://mobx.js.org
[9]: https://developers.google.com/web/tools/workbox
[10]: https://parceljs.org
[11]: https://github.com/features/actions
[12]: https://pages.github.com/

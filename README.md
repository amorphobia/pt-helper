# PT Helper

[中文简介](./README-zh.md)

A helper for private trackers.

## Usage

1. Install a userscript extension
2. Install the script from [greasyfork](https://greasyfork.org/zh-CN/scripts/460549-pt-helper) or [github](https://github.com/amorphobia/pt-helper/raw/main/userscript/index.user.js)

## Highlighted features

### Automatically fold banner

![auto fold banner](https://s2.loli.net/2023/02/14/x7NEu96le5Bq4IV.gif)

### Direct link

![tjupt-dl.gif](https://s2.loli.net/2023/02/17/JUtxICqRfHMN73y.gif)

### Automatically say thanks

![thanks.gif](https://s2.loli.net/2023/02/20/xRS1aX9eQfwuOtA.gif)

## Development

1. Install dependencies with `npm install` or `npm ci`.
2. Edit settings in `userscript` object in [`package.json`](./package.json), you can refer to the comments in [`plugins/userscript.plugin.ts`](./plugins/userscript.plugin.ts).
3. Code your userscript in `src` directory (like [`src/index.ts`](./src/index.ts)).
4. Generate userscript with `npm run build`.
5. Import generated userscript to Tampermonkey by local file URI.

## License

The code of [template](https://github.com/pboymt/userscript-typescript-template) is licensed under [MIT](./template-LICENSE).

The code of PT Helper is licensed under [AGPL-3.0](./LICENSE)-or-later.

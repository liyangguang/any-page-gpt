# AnyPageGPT extension

An extension to make any pages into a GPT chatbot.

This is the extension part of the code. Check the parent folder for more explanations of the project.

## How to develop

### Setup

1. Fill in `extension/.env` based on the instruction in `.example.env`.
1. `npm i` inside `/extension`.

### Develop

- As an extension
    1. `npm start` inside `/extension`.
    1. Visit chrome://extensions/, turn on "Developer mode" (top-right), and "Load unpacked", select `/extension/dist` folder.
    1. Chrome extensions won't auto refresh. Manually click the refresh button for this component on chrome://extensions/ after edits.
- As a standalone app
    1. `npm run dev:standalone` inside `/extension`, and the app will be available on http://localhost:5173/ with HMR.
    1. This is useful for UI development. But `chrome` API won't be available in this envrionment, thus most features wont' work.

### Deployment

- Extension code: After `npm run build` or `npm start`, compress `/extension/dist` into a `.zip` file, and manually submit on [Chrome Web Store](https://chrome.google.com/webstore/devconsole/).

### Skip API calls

Toggle `SKIP_API_CALL` in `/extension/src/shared/utils.ts` to skip the API calls (to save API usage).

## Structure

```
/src: The popup part of the extension. It's a normal Svelte app, together with `index.html`. Compiled by Vite via `npm run build`.
/index.html: the root file for the Svelte app under `/src`.
/public: It's normally static files of the site. But in this extension's context, this fold contains critical files for the extension.
    - manifest.json: The extension definition file. The output is a direct copy of this file.
/dist: The output folder after `npm run bulid`. It contains
    - manifest.json: A copy of the file above
    - index.html: Compiled Svelte index.html file.
    - assets: Compiled file used in index.html
```

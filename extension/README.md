# AnyPageGPT extension

An extension to make any pages into a GPT chatbot.

This is the extension part of the code. Check the parent folder for more explanations of the project.

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

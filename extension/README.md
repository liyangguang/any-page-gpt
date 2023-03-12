# any-page-gpp extension

This is the extension part of the code. Output of this part is the full Chrome extension.

## Structure

```
/src: The popup part of the extension. It's a normal Svelte app, together with `index.html`. Compiled by Vite via `npm run build`.
/index.html: the root file for the Svelte app under `/src`.
/public: It's normally static files of the site. But in this extension's context, this fold contains critical files for the extension.
    - manifest.json: The extension definition file. The output is a direct copy of this file.
    - background.js: The extension background script. The output is a direct copy of this file. (Idaelly this goes pass Vite as well, but since the content inside of it is short, nothing is setup.)
/dist: The output folder after `npm run bulid`. It contains
    - manifest.json: A copy of the file above
    - background.js: A copy of the file above
    - index.html: Compiled Svelte index.html file.
    - assets: Compiled file used in index.html
```

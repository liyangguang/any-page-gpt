# AnyPageGPT extension

An extension to make any pages into a GPT chatbot.

Check out the website - https://any-page-gpt.vercel.app/

## Eng overview

- APIs and landing page: SvelteKit, deployed on Vercel.
- Extension code: Svelte
- GPT API: OpenAI

## How to develop

### Setup

- APIs and landing page
    1. Fill in `.env` based on the instruction in `.example.env`.
    1. `npm i`.
- Extension code
    1. Fill in `extension/.env` based on the instruction in `.example.env`.
    1. `npm i` inside `/extension`.

### Develop

- APIs and landing page
    1. `npm start`, and the app will be available on http://localhost:5173/ (Or see console message).
- Extension code
    1. `npm start` inside `/extension`.
    1. Visit chrome://extensions/, turn on "Developer mode" (top-right), and "Load unpacked", select `/extension/dist` folder.
    1. Chrome extensions won't auto refresh. Manually click the refresh button for this component on chrome://extensions/ after edits.

### Deployment

- APIs and landing page: Linked to Vercel auto deployment.
- Extension code: Compress `/extension/dist` into a `.zip` file, and manually submit on [Chrome Web Store](https://chrome.google.com/webstore/devconsole/).

## Structure

```
/src and /static:
    SvelteKit code, including the APIs and the landing page. Deployed to Vercel.
/extension:
    A separate Svelte codebase. Compiles the extension code. Published to Chrome Web Store manually.
```

# AnyPageGPT extension

An extension to make any pages into a GPT chatbot.

Check out the website - https://any-page-gpt.vercel.app/

## Eng overview

- APIs and landing page: SvelteKit, deployed on Vercel.
- Extension code: Svelte
- GPT API: OpenAI

## File structure

```
/src and /static:
    SvelteKit code, including the APIs and the landing page. Deployed to Vercel.
/extension:
    A separate Svelte codebase. Compiles the extension code. Published to Chrome Web Store manually.
```

## How to develop

### APIs and the landing page

1. Setup
    1. Fill in `.env` based on the instruction in `.example.env`.
    1. `npm i`.
1. Dev server
    1. `npm start`, and the app will be available on http://localhost:5173/.
1. Deployment
    1. APIs and landing page: Linked to Vercel auto deployment.

### The extension

Follow `/extension/README`.

# AnyPageGPT extension

An extension to make any pages into a GPT chatbot.

Check out the website - https://any-page-gpt.vercel.app/

## Technical overview

- APIs and landing page: SvelteKit, deployed on Vercel.
- Extension code: Svelte
- GPT API: OpenAI

## File structure

```
/src and /static:
    APIs and the landing page. It's a SvelteKit app, deployed to Vercel.
/extension:
    Chrome extension code. It's a separate Svelte codebase. Published to Chrome Web Store manually.
```

## How to develop

### APIs and the landing page

1. Setup
    - Fill in `.env` based on the instruction in `.example.env`.
    - `npm i`.
1. Dev server
    - `npm start`, and the app will be available on `http://localhost:5173/`.
1. Deployment
    - APIs and landing page: Linked to Vercel auto deployment.

### The extension

Follow [`/extension/README`](./extension/).

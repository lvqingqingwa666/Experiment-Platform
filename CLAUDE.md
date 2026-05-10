# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server at localhost:5173
npm run build     # build for production (output: dist/)
npm run preview   # preview production build
npm run lint      # lint with ESLint
```

## Project Architecture

Vue 3 SPA — experiment subject recruitment & management platform. **No real backend yet**; runs in mock mode by default.

### Tech Stack

- **Vue 3** (Composition API, `<script setup>`) + **Vite** 4
- **Element Plus** UI library + `@element-plus/icons-vue` (globally registered)
- **Vue Router** 4 (lazy-loaded routes, HTML5 history mode)
- **Pinia** (Composition API store pattern)
- **Axios** (interceptors for auth token & error handling)
- **SCSS** for styling

### Key Files

| File | Purpose |
|------|---------|
| `src/main.js` | App bootstrap: registers Element Plus icons globally, creates Pinia, inits store from localStorage |
| `src/App.vue` | Root layout: auth pages (login/register) vs. main layout (header + sidebar + router-view with fade transition) |
| `src/router/index.js` | Routes with `meta.requiresAuth` and `meta.role` guards (subject/researcher/admin) |
| `src/store/index.js` | Pinia `main` store: user, token, isLoggedIn, login/logout/init from localStorage |
| `src/api/index.js` | All API calls — `USE_MOCK = true` enables mock responses, switch to `false` for real backend |
| `src/utils/request.js` | Axios instance with baseURL from env, Bearer token injection, response error handling (401/403/404/500) |
| `src/utils/common.js` | Utility functions: debounce, throttle, formatDate, deepClone, storage wrapper |
| `vite.config.js` | Dev proxy `/api` → `localhost:3000`, `@` alias to `src/`, Element Plus chunk splitting |

### Route Structure (3 roles)

- **Public**: `/login`, `/register`, `/about`, `/` (redirects to `/login`)
- **Researcher** (`meta.role: 'researcher'`): `/researcher`, `/experiments`, `/experiments/config/:id?`, `/experiments/review/:id`, `/experiments/checkin/:id`, `/payments`, `/reviews`
- **Admin** (`meta.role: 'admin'`): `/admin`
- **404**: catch-all `/:pathMatch(.*)*`

### API Layer

`src/api/index.js` exports 6 API modules (`userApi`, `experimentApi`, `registrationApi`, `paymentApi`, `reviewApi`, `checkInApi`). Each module has both `real*` and `mock*` implementations, selected by the `USE_MOCK` flag. Mock data is inline (no mock server).

### Environment Variables

```env
VITE_API_BASE_URL=/api          # Axios base URL
VITE_APP_NAME=Experiment Platform
```

Files: `.env` (shared), `.env.development`, `.env.production`.

### Mock Mode

Set `USE_MOCK = true` (default) for frontend-only development. Set to `false` to connect to the real backend at `localhost:3000` via Vite proxy.

### Code Style

- Vue 3 `<script setup>` Composition API
- ESLint: `plugin:vue/vue3-essential` + `eslint:recommended`
- `vue/multi-word-component-names` disabled
- `no-unused-vars` set to warn
- Prettier config in `.prettierrc.json`
- EditorConfig in `.editorconfig`

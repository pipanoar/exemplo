import { expo } from "@hot-updater/expo";
import { pipanoar } from "@pipanoar/hot-updater";
import { defineConfig } from "hot-updater";

import { PIPANOAR_APP_ID } from "./src/pipanoar";

// O appId vem de src/pipanoar.ts, o mesmo que o app usa.
// No CI, PIPANOAR_APP_ID (opcional) confere se o deploy vai para o app certo.
const appId = process.env.PIPANOAR_APP_ID || PIPANOAR_APP_ID;
if (appId !== PIPANOAR_APP_ID) {
  throw new Error(
    `PIPANOAR_APP_ID (${appId}) é diferente do appId em src/pipanoar.ts (${PIPANOAR_APP_ID}). Use o mesmo app nos dois.`,
  );
}

export default defineConfig({
  build: expo(),
  // O token de deploy vem da variável de ambiente PIPANOAR_TOKEN.
  ...pipanoar({ appId }),
  updateStrategy: "appVersion",
});

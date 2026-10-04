/**
 * Credenciais do app no Pipa no Ar. Troque pelos valores do seu app:
 *
 * - appId: painel, página Setup do app (começa com `app_`);
 * - API key: painel, página API keys do app.
 *
 * A API key só lê os updates deste app, então pode ir dentro do bundle.
 * O token de deploy (`pn_...`) é outra coisa: ele é secreto e fica só na
 * variável de ambiente PIPANOAR_TOKEN, nunca no código.
 */
export const PIPANOAR_APP_ID = "app_xxxxxxxxxxxxxxxxxxxx";

// Placeholder: cole aqui a API key do seu app.
export const PIPANOAR_API_KEY = "COLE_A_API_KEY_AQUI";

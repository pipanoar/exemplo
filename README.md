# Pipa no Ar: apps de exemplo

Dois apps React Native mínimos configurados com o [Pipa no Ar](https://pipanoar.scuderiatech.com.br), updates OTA para React Native sem operar servidor, banco ou armazenamento. Os dois usam o SDK e a CLI oficiais do [hot-updater](https://hot-updater.dev), na versão `1.0.6`, com o preset [`@pipanoar/hot-updater`](https://www.npmjs.com/package/@pipanoar/hot-updater).

A tela de cada app mostra a **Versão do JavaScript**, o id do bundle em uso, o canal e a versão do app. Você muda o JavaScript, publica, reabre o app e vê o update chegar.

| Pasta | O que é | Versões |
|---|---|---|
| [`bare/`](bare) | React Native sem Expo, criado com o template oficial (`@react-native-community/cli`) | React Native 0.85.3, React 19.2.3 |
| [`expo/`](expo) | Expo com prebuild (o `ios/` e o `android/` são gerados) | Expo SDK 56, React Native 0.85.3 |

Os dois usam `@hot-updater/react-native`, `hot-updater` e `@hot-updater/bare` ou `@hot-updater/expo` na versão `1.0.6`, e `@pipanoar/hot-updater` 0.2.

**Documentação:** https://docs.pipanoar.scuderiatech.com.br

## Antes de começar

- Node 22 ou mais novo.
- Para o app bare no iOS: Xcode, Ruby e CocoaPods. No Android: Android Studio com o SDK.
- Uma conta no [painel](https://app.pipanoar.scuderiatech.com.br). O plano Free serve.

## Aponte para o seu app

Os apps vêm com valores de exemplo. Para receber updates, troque pelos do seu app:

1. No painel, crie uma organização e um app. O **appId** (começa com `app_`) fica na página **Setup** do app.
2. No app, abra **API keys** e crie uma chave.
3. Cole os dois em `src/pipanoar.ts` (o arquivo existe em `bare/` e em `expo/`):
   ```ts
   export const PIPANOAR_APP_ID = "app_...";
   export const PIPANOAR_API_KEY = "...";
   ```
   A API key só lê os updates deste app, então pode ir dentro do bundle. O `hot-updater.config.ts` usa o mesmo appId.
4. Na organização, abra **Tokens de deploy**, crie um token com escopo **Deploy** e deixe na variável de ambiente:
   ```sh
   export PIPANOAR_TOKEN=pn_...
   ```
   O token é secreto: nunca coloque no código nem no repositório.

## React Native (bare)

```sh
cd bare
npm install
cd ios && bundle install && bundle exec pod install && cd ..
```

Gere uma build **de release** e instale no aparelho ou no emulador. Updates OTA não rodam em builds de debug, que carregam o JavaScript do Metro.

```sh
npx react-native run-android --mode release
npx react-native run-ios --mode Release
```

Publique um update:

1. Em `src/DemoScreen.tsx`, mude `JS_VERSION` (por exemplo, de `"1"` para `"2"`).
2. Rode:
   ```sh
   npm run deploy:android   # ou deploy:ios
   ```
3. Feche e abra o app duas vezes: na primeira ele baixa o update, na segunda abre com ele. A tela mostra a versão nova e o id do bundle.

No painel, a release aparece em **Releases** e os números começam a chegar em **Insights**.

### Onde está a integração

| Arquivo | O que faz |
|---|---|
| `App.tsx` | Envolve o app com `HotUpdater.wrap(...)`, `pipanoarClient(...)` e o plugin `insights()` |
| `hot-updater.config.ts` | Build `bare({ enableHermes: true })` e `pipanoar({ appId })` para a CLI |
| `ios/PipaNoArExemplo/AppDelegate.swift` | Na release, `bundleURL()` devolve `HotUpdater.bundleURL()` |
| `android/app/src/main/java/com/pipanoarexemplo/MainApplication.kt` | Na release, `getDefaultReactHost(...)` recebe `jsBundleFilePath = HotUpdater.getJSBundleFile(applicationContext)` |

O `npx hot-updater doctor` confere se a parte nativa ficou certa.

## Expo

O Expo Go não carrega bundles de fora, então não serve para testar updates. Use uma build de release gerada por você (ou pelo EAS).

```sh
cd expo
npm install
npx expo prebuild
npm run android:release        # ou ios:release
```

O plugin `@hot-updater/expo` no `app.json` faz a parte nativa sozinho no `npx expo prebuild`. Para publicar, mude `JS_VERSION` em `src/DemoScreen.tsx` e rode:

```sh
npm run deploy:android   # ou deploy:ios
```

Os scripts de deploy do Expo passam `-t` com a `version` do `app.json`, porque sem o prebuild a CLI não acha a versão do app nos arquivos nativos.

## CI

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em cada push e pull request:

- instala com `npm ci` e roda o `tsc --noEmit` nos dois apps;
- gera o bundle JavaScript sem Xcode nem Android SDK: `npx react-native bundle` no bare e `npx expo export` no Expo.

Ele também tem um job manual de deploy. Para usar no seu fork:

1. Em **Settings, Secrets and variables, Actions**, crie os segredos:
   - `PIPANOAR_TOKEN`: token de deploy (obrigatório);
   - `PIPANOAR_APP_ID`: appId do app (opcional). Se existir, o deploy confere se é o mesmo appId de `src/pipanoar.ts` e para se for diferente.
2. Em **Actions, CI, Run workflow**, escolha o app (`bare` ou `expo`) e o canal.

O job roda `npx hot-updater deploy -p android` no app escolhido. Mais detalhes em [Deploy pelo CI](https://docs.pipanoar.scuderiatech.com.br/guia/ci).

## Próximos passos

- [Guia rápido](https://docs.pipanoar.scuderiatech.com.br/guia/comecando) e [guia do Expo](https://docs.pipanoar.scuderiatech.com.br/guia/expo).
- [Releases e rollout](https://docs.pipanoar.scuderiatech.com.br/conceitos/releases): liberar para uma parte dos aparelhos e desativar uma release.
- [Assinatura de bundles](https://docs.pipanoar.scuderiatech.com.br/conceitos/assinatura): o app só aceitar updates assinados.
- Num projeto seu, `npx @pipanoar/init` instala os pacotes, cria o config e envolve o app.

## English

Minimal React Native apps (bare and Expo) wired to [Pipa no Ar](https://pipanoar.scuderiatech.com.br), a hosted over-the-air update service for React Native built on the official [hot-updater](https://hot-updater.dev) SDK and CLI (`1.0.6`).

1. Create an app in the [dashboard](https://app.pipanoar.scuderiatech.com.br), then put its appId and an API key in `src/pipanoar.ts`.
2. Create a deploy token and export it as `PIPANOAR_TOKEN`. Never commit it.
3. Install a **release** build (`bare`: `npx react-native run-android --mode release`; `expo`: `npx expo prebuild` then `npm run android:release`).
4. Change `JS_VERSION` in `src/DemoScreen.tsx` and run `npm run deploy:android`. Restart the app twice to see the update.

CI type-checks both apps and bundles the JavaScript without native toolchains. A manual job deploys an update using the `PIPANOAR_TOKEN` and `PIPANOAR_APP_ID` repository secrets. Docs (Portuguese): https://docs.pipanoar.scuderiatech.com.br

## Licença

MIT, veja [LICENSE](LICENSE). Built on hot-updater. Um produto ScuderiaTech.

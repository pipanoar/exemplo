import { HotUpdater, insights } from "@hot-updater/react-native";
import { pipanoarClient } from "@pipanoar/hot-updater/client";
import { StatusBar } from "expo-status-bar";

import { DemoScreen } from "./src/DemoScreen";
import { PIPANOAR_API_KEY, PIPANOAR_APP_ID } from "./src/pipanoar";

function App() {
  return (
    <>
      <StatusBar style="auto" />
      <DemoScreen />
    </>
  );
}

export default HotUpdater.wrap({
  ...pipanoarClient({
    appId: PIPANOAR_APP_ID,
    apiKey: PIPANOAR_API_KEY,
  }),
  // Use o mesmo updateStrategy aqui e no hot-updater.config.ts.
  updateStrategy: "appVersion",
  // Insights: instalações ativas, adoção e falhas no painel.
  plugins: [insights()],
})(App);

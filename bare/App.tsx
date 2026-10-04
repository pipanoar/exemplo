import { HotUpdater, insights } from "@hot-updater/react-native";
import { pipanoarClient } from "@pipanoar/hot-updater/client";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DemoScreen } from "./src/DemoScreen";
import { PIPANOAR_API_KEY, PIPANOAR_APP_ID } from "./src/pipanoar";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <DemoScreen />
    </SafeAreaProvider>
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

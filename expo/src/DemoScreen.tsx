import { HotUpdater, useHotUpdaterStore } from "@hot-updater/react-native";
import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

/**
 * Mude este texto (por exemplo, para "2") e publique com
 * `npx hot-updater deploy -p android`. Feche e abra o app duas vezes:
 * na primeira ele baixa o update, na segunda abre com ele.
 */
export const JS_VERSION = "1";

type Palette = Record<"fundo" | "superficie" | "borda" | "tinta" | "tinta2" | "ceu" | "ceuForte", string>;

// Cores do design system do Pipa no Ar (claro e escuro).
const themes: Record<"light" | "dark", Palette> = {
  light: {
    fundo: "#f5f7fa",
    superficie: "#ffffff",
    borda: "#e4e9ef",
    tinta: "#13324a",
    tinta2: "#4a6378",
    ceu: "#8fd3ff",
    ceuForte: "#1d6fa5",
  },
  dark: {
    fundo: "#0b1520",
    superficie: "#111e2b",
    borda: "#1f3346",
    tinta: "#e8eff5",
    tinta2: "#a5b6c5",
    ceu: "#8fd3ff",
    ceuForte: "#8fd3ff",
  },
};

/** Data de publicação embutida no id do bundle (UUIDv7). */
const bundleDate = (bundleId: string): string | null => {
  const hex = bundleId.replaceAll("-", "").slice(0, 12);
  const timestamp = Number.parseInt(hex, 16);
  if (!Number.isFinite(timestamp) || timestamp === 0) return null;
  return new Date(timestamp).toLocaleString("pt-BR");
};

const Row = ({ label, value, color }: { label: string; value: string; color: Palette }) => (
  <View style={[styles.row, { borderColor: color.borda }]}>
    <Text style={[styles.label, { color: color.tinta2 }]}>{label}</Text>
    <Text style={[styles.value, { color: color.tinta }]} selectable>
      {value}
    </Text>
  </View>
);

export function DemoScreen() {
  const color = themes[useColorScheme() === "dark" ? "dark" : "light"];
  const progress = useHotUpdaterStore((state) => state.progress);
  const isUpdateDownloaded = useHotUpdaterStore((state) => state.isUpdateDownloaded);

  const bundleId = HotUpdater.getBundleId();
  const isEmbedded = bundleId === HotUpdater.getMinBundleId();
  const publishedAt = isEmbedded ? null : bundleDate(bundleId);

  return (
    <ScrollView style={{ backgroundColor: color.fundo }} contentContainerStyle={styles.container}>
      <Text style={[styles.brand, { color: color.ceuForte }]}>Pipa no Ar</Text>
      <Text style={[styles.title, { color: color.tinta }]}>App de exemplo</Text>

      <View style={[styles.card, { backgroundColor: color.superficie, borderColor: color.borda }]}>
        <Text style={[styles.label, { color: color.tinta2 }]}>Versão do JavaScript</Text>
        <Text style={[styles.jsVersion, { color: color.tinta }]}>{JS_VERSION}</Text>
        <Text style={[styles.hint, { color: color.tinta2 }]}>
          Mude JS_VERSION em src/DemoScreen.tsx, publique e reabra o app para ver o update chegar.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: color.superficie, borderColor: color.borda }]}>
        <Row label="Bundle" value={isEmbedded ? "Embutido na build" : bundleId} color={color} />
        {publishedAt ? <Row label="Publicado em" value={publishedAt} color={color} /> : null}
        <Row label="Canal" value={HotUpdater.getChannel()} color={color} />
        <Row label="Versão do app" value={HotUpdater.getAppVersion() ?? "Desconhecida"} color={color} />
      </View>

      {progress > 0 && progress < 1 ? (
        <Text style={[styles.hint, { color: color.tinta2 }]}>Baixando update: {Math.round(progress * 100)}%</Text>
      ) : null}

      {isUpdateDownloaded ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => HotUpdater.reload()}
          style={[styles.button, { backgroundColor: color.ceu }]}
        >
          <Text style={[styles.buttonText, { color: "#13324a" }]}>Aplicar o update agora</Text>
        </Pressable>
      ) : null}

      <Text style={[styles.footer, { color: color.tinta2 }]}>Built on hot-updater. Um produto ScuderiaTech.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 72, gap: 16 },
  brand: { fontSize: 14, fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "700" },
  card: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 4 },
  label: { fontSize: 13 },
  jsVersion: { fontSize: 56, fontWeight: "700" },
  hint: { fontSize: 14, lineHeight: 20 },
  row: { borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: 8, gap: 2 },
  value: { fontSize: 15, fontFamily: "monospace" },
  button: { borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  buttonText: { fontSize: 16, fontWeight: "700" },
  footer: { fontSize: 12, textAlign: "center", marginTop: 16 },
});

import { TodoProvider } from "@/contexts/TodoContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TodoProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Home" }} />
          </Stack>
        </TodoProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

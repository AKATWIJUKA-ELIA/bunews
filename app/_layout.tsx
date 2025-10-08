import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Header from '@/components/Header/Header';


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar
          style="dark" // or "light"
          backgroundColor="#ffff" // match your header color
          translucent={false}
        />
        <ConvexProvider client={convex}>
      <Stack>        
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {/* <StatusBar style="auto" /> */}
      </ConvexProvider>
    </ThemeProvider>
  );
}
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "./ThemeContext";


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
       <GestureHandlerRootView>
        <ConvexProvider client={convex}>
         <StatusBar
          style="auto" //or "light"
         backgroundColor="#000000ff" // match your header color
          translucent={true}
        />
        
      <Stack>        
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="timeline" options={{ title: "User Timeline" }}/>
        <Stack.Screen name="otherUserTimeLine" options={{ title: "User Timeline" }}/>
      </Stack>
      {/* <StatusBar style="auto" /> */}
      </ConvexProvider>
       </GestureHandlerRootView>
    </ThemeProvider>
  );
}
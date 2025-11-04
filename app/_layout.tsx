// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme,Appearance } from '@/hooks/use-color-scheme';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
 const colorScheme = useColorScheme();

  return (
//     <ThemeProvider>
       <GestureHandlerRootView>
        <ConvexProvider client={convex}>
         <StatusBar
           style="auto"
           backgroundColor={Platform.OS === 'android' ? (colorScheme === 'dark' ? '#000000ff' : '#ffffffff') : undefined}
           translucent={Platform.OS === 'ios'}
           animated

         />

      <Stack
        screenOptions={{
          statusBarStyle: colorScheme === 'light' ? 'dark' : 'light',
          
        //   statusBarBackgroundColor: theme === 'dark' ? '#000' : '#fff',
        }}
      >        
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="timeline" options={{ title: "User Timeline" }}/>
        <Stack.Screen name="otherUserTimeLine" options={{ title: "User Timeline" }}/>
      </Stack>
      </ConvexProvider>
       </GestureHandlerRootView>
//     </ThemeProvider>
  );
}
import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../../constants/theme";


const tabs: {
  title: string;
  name: string;
  icon: { name: React.ComponentProps<typeof Ionicons>['name']; size: number };
}[] = [
  { title: 'Home', name: 'home', icon: { name: 'home', size: 28 } },
  { title: 'Search', name: 'search', icon: { name: 'search', size: 28 } },
  {title:"Post", name:"post", icon:{name:"add-circle", size:28}},
  { title: 'Notifications', name: 'notifications', icon: { name: 'notifications', size: 28 } },
  { title: 'Account', name: 'account', icon: { name: 'person', size: 28 } },
  { title: 'Account', name: 'index', icon: { name: 'person', size: 28 } },
];
export default function TabLayout() {
        const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
                tabBarStyle: {  backgroundColor:colors.background , borderTopColor: 'transparent' },
        // tabBarInactiveTintColor: '#4a3737a0',
        tabBarActiveBackgroundColor:"'#6d6c8aff',",
        tabBarActiveTintColor: '#007AFF',
        headerTintColor: '#e9e9e9ff',
        
        // 👇 Customize the header bar
    headerStyle: {
      backgroundColor: 'rgba(125, 25, 25, 1)',
//       backdropFilter: 'blur(10px)',
//       backgroundBlendMode:"multiply" ,
      opacity: 0.1,
      height: 35, // 🔥 This sets the header height
    },
    headerTitleStyle: {
      fontSize: 20, // Text size
      fontWeight: '700',
    },
    headerTitleAlign: 'left',
      }}>
        <Stack.Screen
        options={{
          headerShown: false,
          headerStyle: {
            // Only supported properties here, e.g. backgroundColor
          }
        }}
      />
        {tabs.map((tab) => (
                <Tabs.Screen
        name={tab.name}
        options={{
          title: tab.title,
          tabBarIcon: ({ size }) => (
            <Ionicons name={tab.icon.name} size={size} color={colors.icon} />
          ),
        }}
      />
        ))}
    </Tabs>
  );
}

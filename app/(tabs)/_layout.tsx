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
        tabBarStyle: {  backgroundColor:colors.background , borderTopColor: 'transparent',position: "absolute",height: 70,paddingTop: 10, 
          left: 0,
          right: 0,
          bottom: 0, },
        tabBarInactiveTintColor: '#8e8e93ff',
        
        tabBarActiveTintColor: '#007AFF',
        headerTintColor: '#e9e9e9ff',
        tabBarPosition: 'bottom',
        tabBarVariant: 'uikit',
        animation:"shift",
        
        
        
        // 👇 Customize the header bar
//     headerStyle: {
//       backgroundColor: 'rgba(125, 25, 25, 1)',
//       backdropFilter: 'blur(10px)',
//       backgroundBlendMode:"multiply" ,
//       opacity: 0.1,
//       height: 3, 
//     },
//     headerTitleStyle: {
//       fontSize: 20, 
//       fontWeight: '700',
//     },
//     headerTitleAlign: 'left',
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
                tabBarShowLabel: false,
          title: tab.title,
          tabBarIcon: ({ focused }) => (
            <Ionicons name={tab.icon.name} size={focused ? 32 : tab.icon.size} color={focused ? colors.tabIconSelected : colors.tabIconDefault} />
          ),
        }}
      />
        ))}
    </Tabs>
  );
}

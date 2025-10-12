import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack } from "expo-router";
import useGetUserById from "@/hooks/useGetUserById";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader/loader";
import { getUserById } from "@/lib/convex";
import { Id } from "@/convex/_generated/dataModel";
import useLogOut from "@/hooks/useLogOut";
import { UserProfile } from "@/lib/types";

export interface User {
        _id?: Id<"users">|undefined,
        username?: string,
        email?: string,
        passwordHash?: string,
        phoneNumber?: string,
        profilePicture?: string|null,
        isVerified?: boolean | false|undefined,
        role?: string|""|undefined,
        reset_token?:string
        reset_token_expires?:number|0|undefined,
        updatedAt?: number,
        lastLogin?: number,
        _creationTime?:number,
}
export default function SettingsScreen() {

        const [user, setUser] = useState<any>(null);
        const {signOut} = useLogOut();
            
  useEffect(() => {
  (async () => {
    const userString = await AsyncStorage.getItem("user");
    console.log("userString", userString);
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  })();
}, []);


 
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
        const handleLogOut = async () => {
                await signOut();
                setUser(null);
                router.replace('/login');
        }
       if(!user){
                return <Loader />;
        }
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen
        options={{
          title: `Account `, // dynamic title
          headerTitleAlign: 'left',
          headerStyle: {
                 backgroundColor: '#05032bff',
                 
           },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.profilePicture||"" }} alt={user.profilePicture} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{user?.Username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Preferences Section */}
      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.settingRow}>
        <Ionicons name="moon-outline" size={22} color="#007AFF" />
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      <View style={styles.settingRow}>
        <Ionicons name="notifications-outline" size={22} color="#007AFF" />
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>

      <Link href="/editprofile" asChild>
        <TouchableOpacity style={styles.settingRow}>
          <Ionicons name="person-outline" size={22} color="#007AFF" />
          <Text style={styles.settingLabel}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </Link>

      <TouchableOpacity style={styles.settingRow}>
        <Ionicons name="lock-closed-outline" size={22} color="#007AFF" />
        <Text style={styles.settingLabel}>Change Password</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow} onPress={()=>handleLogOut()} >
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={[styles.settingLabel, { color: "#FF3B30" }]}>Log Out</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* About Section */}
      <Text style={styles.sectionTitle}>About</Text>

      <TouchableOpacity style={styles.settingRow}>
        <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
        <Text style={styles.settingLabel}>App Version</Text>
        <Text style={{ color: "#888", fontSize: 14 }}>1.0.0</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow}>
        <Ionicons name="help-circle-outline" size={22} color="#007AFF" />
        <Text style={styles.settingLabel}>Help & Support</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,

  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
        marginTop: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 18,
    color: "#333",
    fontWeight: "700",
  },
  email: {
    color: "#888",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginTop: 24,
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  settingLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginTop: 15,
  },
});

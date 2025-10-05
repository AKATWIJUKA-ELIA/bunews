import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";

import type { NavigationProp } from '@react-navigation/native';
import { Stack } from "expo-router";

interface AccountsPageProps {
  navigation: NavigationProp<any>;
}

const AccountsPage = ({ navigation }: AccountsPageProps) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Stack.Screen
        options={{
          title: `Account `, // dynamic title
          headerTitleAlign: 'left',
          headerStyle: {
                 backgroundColor: '#05032bff',
           },
          headerTitleStyle: { fontWeight: '700', fontSize: 18,color:"white" },
        }}
      />
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Elia</Text>
        <Text style={styles.userEmail}>elia@example.com</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Account Options */}
      <View style={styles.optionsSection}>
        <OptionItem title="My Orders" icon="📦" onPress={() => navigation.navigate("Orders")} />
        <OptionItem title="Payment Methods" icon="💳" onPress={() => navigation.navigate("Payments")} />
        <OptionItem title="Security" icon="🔒" onPress={() => navigation.navigate("Security")} />
        <OptionItem title="Notifications" icon="🔔" onPress={() => navigation.navigate("Notifications")} />
        <OptionItem title="Help & Support" icon="🧾" onPress={() => navigation.navigate("Support")} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// OptionItem Component
const OptionItem = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.optionItem} onPress={onPress}>
    <Text style={styles.optionIcon}>{icon}</Text>
    <Text style={styles.optionText}>{title}</Text>
  </TouchableOpacity>
);

export default AccountsPage;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  optionsSection: {
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  logoutButton: {
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

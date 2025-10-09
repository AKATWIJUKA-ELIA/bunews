import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Link, router, Stack } from "expo-router";
import useAuthenticate from "@/hooks/useAuthenticate";


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
        const { Authenticate } = useAuthenticate();
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    await Authenticate( email, password ).then((res) => {
      if (!res.success) {
        Alert.alert("Error", res.message || "Login failed");
        return;
      }
        Alert.alert("Success", "Logged in successfully");
         router.replace("/(tabs)/home"); // Navigate to main app
    });

   
  };

  return (
    <View style={styles.container}>
        <Stack.Screen
        options={{
                headerShown: false,
          title: ``, // dynamic title
          headerTitleAlign: 'left',
          
          headerStyle: {
                 backgroundColor: '#05032bff',
                 
           },
        }}
      />
      <KeyboardAvoidingView
                  style={{flex:1, justifyContent:"center", alignItems:"center", width:"100%"}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={80} // adjust if needed for your header
            >
      <Image
      source={require("../../assets/images/icon.png")}  
        style={styles.logo}
      />
        <Text style={styles.title}>BU News</Text>
      {/* <Text style={styles.title}>Welcome Back </Text> */}
      <Text style={styles.subtitle}>Log in to continue</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: "#888" }}>Don't have an account?</Text>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#888",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 5,
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

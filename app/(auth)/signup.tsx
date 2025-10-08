import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { Link, router, Stack } from "expo-router";
import useCreateUser from "@/hooks/useCreateUser";
// import bcrypt from "bcryptjs";
// import * as Crypto from 'expo-crypto';

export default function SignUpScreen() {

  const [email, setEmail] = useState("");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
        const [phoneNumber, setphoneNumber] = useState("");

  const { CreateUser } = useCreateUser();
// const hashPassword = async (plainPassword: string) => {
//   const saltRounds = 10;
//   const salt = await bcrypt.genSalt(saltRounds); // Generate the salt string
//   const hashedPassword = await bcrypt.hash(plainPassword, salt); // Hash with salt string
//   console.log("hash", hashedPassword);
//   return hashedPassword;
// };
  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
//     const hash = await hashPassword(password);

    try{
        CreateUser({
                username:userName,
                email,
                passwordHash:password,
                role:"user",
                reset_token:"",
                isVerified:false,
                reset_token_expires:0,
                phoneNumber:phoneNumber,
                profilePicture:"",
                updatedAt:Date.now(),
                lastLogin:Date.now(),
        }).then((res)=>{
                if(!res.success){
                        Alert.alert("Error", res.message || "Signup failed");
                        return;
                }
                Alert.alert("Success", "Account created successfully");
                router.replace("/login");
        })
    }catch(err){
        Alert.alert("Error", "Signup failed");
        return;
    }
    
    
  };

  return (
    <View style={styles.container}>
        <Stack.Screen
        options={{
          title: ``, // dynamic title
          headerTitleAlign: 'left',
          
          headerStyle: {
                 backgroundColor: '#05032bff',
           },
        }}
      />
      <Image
        source={require("../../assets/images/icon.png")}  
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account ✨</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        placeholder="UserName"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={userName}
        onChangeText={setuserName}
      />

      <TextInput
        placeholder="phoneNumber"
        style={styles.input}
        placeholderTextColor="#aaa"
        value={phoneNumber}
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
        onChangeText={setphoneNumber}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={{ color: "#888" }}>Already have an account?</Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
    marginTop: -150,
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

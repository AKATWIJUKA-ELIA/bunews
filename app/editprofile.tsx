import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "@/components/Loader/loader";
import { uploadImage } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UpdateUser } from "@/lib/convex";
import { useTheme } from "./ThemeContext";
import { lightTheme, darkTheme } from "../constants/theme";

// Default image URLs
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=1";
const DEFAULT_BANNER = "https://tangible-jaguar-208.convex.cloud/api/storage/359ce195-fa40-4bfe-afe2-6be4aebd9559";


export default function EditProfileScreen() {
  // User state
    const [user, setUser] = useState<any>(null);
    const { theme } = useTheme();
        const colors = theme === "dark" ? darkTheme : lightTheme;

  const [loading, setLoading] = useState(false);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);

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
const [username, setUsername] = useState(user?.Username || "");
  const [about, setAbout] = useState(user?.about || "");

  const [profilePicture, setProfilePicture] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  // Pick an image (profile or banner)
  const pickImage = async (setter: (uri: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setter(result.assets[0].uri);
    }
  };

  // Handle save (replace with your backend logic)
  const handleSave = async () => {
        let profilePictureUrl = "";
        let bannerImageUrl = "";
    setLoading(true);
    try {
        if(profilePicture && profilePicture.length>1){
                await uploadImage(profilePicture).then(async (imagefile)=>{
                        if(!imagefile){
                                Alert.alert("Error", "Image conversion failed, please try again");
                                return;
                        }
                        const postUrl = await generateUploadUrl();
                                        if (!postUrl) 
                                                Alert.alert("eror","Failed to get upload URL")
                
                                        const result = await fetch(postUrl, {
                                          method: "POST",
                                          headers: { "Content-Type": imagefile?.type},
                                          body: imagefile ?? undefined,
                                        });
                
                                        if (!result.ok) throw new Error("Failed to upload image");
                                        const res = await result.json();
                                        profilePictureUrl = res.storageId;
                        console.log("imagefile from upload", imagefile);
                        }).catch((err)=>{
                                console.log("Image upload failed", err);
                                Alert.alert("Error", "Image conversion failed, please try again");
                                return;
                        });
                
        }else{console.log("No profile picture selected or empty string", profilePicture);}
        if(bannerImage && bannerImage.length>1){
                console.log("Uploading banner image", bannerImage);
                await uploadImage(bannerImage).then(async (imagefile)=>{
                        if(!imagefile){
                                Alert.alert("Error", "Image conversion failed, please try again");
                                return;
                        }
                        const postUrl = await generateUploadUrl();
                                        if (!postUrl) throw new Error("Failed to get upload URL");
                
                                        const result = await fetch(postUrl, {
                                          method: "POST",
                                          headers: { "Content-Type": imagefile?.type},
                                          body: imagefile ?? undefined,
                                        });
                
                                        if (!result.ok) throw new Error("Failed to upload image");
                                        const res = await result.json();
                                        bannerImageUrl = res.storageId;
                        console.log("imagefile from upload", imagefile);
                        }).catch((err)=>{
                                console.log("Image upload failed", err);
                                Alert.alert("Error", "Image conversion failed, please try again");
                                return;
                        });
                
        }else{console.log("No banner picture selected or empty string", bannerImage);}
        await UpdateUser({
                _id: user.User_id,
                username: username||user.Username,
                about: about||user.about,
                profilePicture: profilePictureUrl||user.profilePicture,
                bannerImage: bannerImageUrl||user.bannerImage,
        }).then((res)=>{
                if(!res.success){
                        Alert.alert("Error", res.message || "Profile update failed");
                        return;
                }
                 Alert.alert("Profile Updated", "Your profile has been successfully updated!");
        })
     
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile.");
    }
    setLoading(false);
  };
  if(!user){
                return <Loader />;
        }
  return (
    <ScrollView style={[styles.container,{backgroundColor:colors.background}]} contentContainerStyle={{ paddingBottom: 40 }}>
        <Stack.Screen
        options={{
          title: `Account `, // dynamic title
          headerTitleAlign: 'left',
          headerShown: false,
          headerStyle: {
                 backgroundColor: '#05032bff',
                 
           },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      {/* Banner */}
      <TouchableOpacity onPress={() => pickImage(setBannerImage)} activeOpacity={0.8}>
        <Image
          source={{ uri: user.bannerImage || DEFAULT_BANNER }}
          style={styles.banner}
        />
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerEditText}>Edit Banner</Text>
        </View>
      </TouchableOpacity>

      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => pickImage(setProfilePicture)}>
          <Image
            source={{ uri: user.profilePicture || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.avatarOverlay}>
            <Text style={styles.avatarEditText}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={username}
          placeholder={user?.Username||""}
          onChangeText={setUsername}
        //   onChange={(e) => {setUsername(e.nativeEvent.text);}}
          style={styles.input}
          maxLength={30}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={user.email}
        //   onChangeText={setEmail}
          style={styles.input}
          editable={false} // Often email is not editable
        />

        <Text style={styles.label}>About</Text>
        <TextInput
          value={about}
                placeholder={user?.about||"Tell us about yourself"}
          onChangeText={setAbout}
          style={[styles.input, { minHeight: 60 }]}
          multiline
          maxLength={250}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveBtn, loading && { backgroundColor: "#aaa" }]}
        onPress={()=>{handleSave()}}
        disabled={loading}
      >
        <Text style={styles.saveBtnText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  banner: { width: "100%", height: 140, backgroundColor: "#eee" },
  bannerOverlay: {
    position: "absolute", bottom: 8, right: 18, backgroundColor: "#0008", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4
  },
  bannerEditText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  avatarContainer: { alignItems: "center", marginTop: -45, marginBottom: 4 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: "#fff", backgroundColor: "#eee" },
  avatarOverlay: {
    position: "absolute", bottom: 0, right: 0, backgroundColor: "#0009", borderRadius: 16, paddingHorizontal: 8, paddingVertical: 2
  },
  avatarEditText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  form: { paddingHorizontal: 24, marginTop: 14 },
  label: { fontSize: 15, color: "#333", marginTop: 16, marginBottom: 4, fontWeight: "600" },
  input: {
    backgroundColor: "#f6f8fa", borderRadius: 8, padding: 12, fontSize: 15, borderWidth: 1, borderColor: "#eee", marginBottom: 4
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: "#2b2bff",
    paddingVertical: 15,
    marginHorizontal: 28,
    borderRadius: 10,
    alignItems: "center"
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import NewsCard from "@/components/Feed/NewsCard/NewsCard";
import { PostWithAuthor } from "@/lib/types";
import { Stack } from "expo-router";
import useRepost from "@/hooks/useRepost";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { uploadImage } from "@/lib/utils";
import { useTheme } from "./ThemeContext";
import { lightTheme, darkTheme } from "../constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function RepostScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  // Expect route.params.post to be the post object being reposted
  const { post } = route.params as { post: PostWithAuthor };
const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
        const { repost } = useRepost();
           const { theme } = useTheme();
          const colors = theme === "dark" ? darkTheme : lightTheme;
          const [user, setUser] = useState<any>(null);

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
 
  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
        aspect: [4, 3],
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Submit repost handler (replace with your backend logic)
  const handleRepost = async (postId:Id<"posts">, ) => {
        let imageUrl = "";
    if (!comment.trim() && !image) {
      Alert.alert("Add text or image", "Please add a comment or select an image to repost.");
      return;
    }
    setLoading(true);
    await uploadImage(image||"").then(async (imagefile)=>{
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
                            imageUrl = res.storageId;
            console.log("imagefile from upload", imagefile);
            }).catch((err)=>{
                    console.log("Image upload failed", err);
                    Alert.alert("Error", "Image conversion failed, please try again");
                    return;
            });
    try {
      await repost({
        reposterId: user.User_id as Id<"users">, // Replace with actual current user ID
        originalPostId: postId,
        content: comment,
        repostImage: imageUrl || null,
      });

        Alert.alert("Success", "Your repost has been shared!");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "Failed to repost. Try again.");
    } finally {
      setLoading(false);
        setComment("");
        setImage(null);
    }
  };

  return (
        <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={40} // adjust if needed for your header
            >
    <ScrollView style={[styles.container,{backgroundColor:colors.background}]} contentContainerStyle={{paddingBottom: 60}}>
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
       
      <Text style={[styles.header,{color:colors.text}]}>Repost</Text>
      <Text style={styles.subheader}>You are reposting:</Text>
      <NewsCard post={post} />
      <Text style={styles.label}>Add a comment (optional):</Text>
      <TextInput
        style={styles.input}
        placeholder="Say something about this post..."
        placeholderTextColor="#888"
        value={comment}
        onChangeText={setComment}
        multiline
        maxLength={300}
      />
      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageBtnText}>Add Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.repostBtn, loading && { backgroundColor: "#aaa" }]}
          onPress={()=>{handleRepost(post?._id as Id<"posts"> )}}
          disabled={loading}
        >
          <Text style={styles.repostBtnText}>{loading ? "Posting..." : "Repost"}</Text>
        </TouchableOpacity>
      </View>
      
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", marginTop: 10, marginBottom: 2 },
  subheader: { fontSize: 15, color: "#666", marginBottom: 8 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 16, marginBottom: 6 },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafd",
    fontSize: 15,
    marginBottom: 12,
  },
  imagePreview: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 2,
    backgroundColor: "#eee",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  imageBtn: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  imageBtnText: {
    fontWeight: "600",
    color: "#2b2bff",
    fontSize: 15,
  },
  repostBtn: {
    backgroundColor: "#2b2bff",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 8,
  },
  repostBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
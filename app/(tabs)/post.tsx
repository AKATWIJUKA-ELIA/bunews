import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useCreatePost from '@/hooks/useCreatePost';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { uploadImage } from '@/lib/utils';
import { fetch } from 'expo/fetch';
import { File } from 'expo-file-system';
import { router } from 'expo-router';
import { useTheme } from "../ThemeContext";
import { lightTheme, darkTheme } from "../../constants/theme";


export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
   const { theme } = useTheme();
          const colors = theme === "dark" ? darkTheme : lightTheme;
//   const user = AsyncStorage.getItem('user');
        const [user, setUser] = useState<any>(null);
    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
    const [imagepreview, setImagePreview] = useState<string | null>(null);
    const {CreatePost} = useCreatePost();

  const categories = [
    'Politics',
    'Technology',
    'Business',
    'Culture',
    'Science',
    'Sports',
  ]

  useEffect(() => {
  (async () => {
    const userString = await AsyncStorage.getItem("user");
//     console.log("userString", userString);
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  })();
}, []);
  // 🖼 Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      setImagePreview(result.assets[0].uri);
    }
  };


  const handlePost = async () => {
        setSubmitting(true);
        let imageUrl = "";
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
        setSubmitting(false);
      return;
    }
    await uploadImage(selectedImage?.uri||"").then(async (imagefile)=>{
        if(!imagefile){
                Alert.alert("Error", "Image conversion failed, please try again");
                        setSubmitting(false);
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

        
                  

  await CreatePost({
    authorId:user?.User_id as Id<"users"> ,
        content,
        category: category || 'General',
        postImage: imageUrl || '',
  }).then((res)=>{
        if(!res.success){
                Alert.alert("Error", res.message || "Post creation failed");
                setSubmitting(false);
                return;
        }
        Alert.alert("Success", "Post created successfully");
        setSubmitting(false);
        setContent('');
        setSelectedImage(null);
        setCategory(null);
  });
        router.replace("/");
  };


  return (
    <SafeAreaView style={[styles.container,{backgroundColor: colors.background}]}>
      {/* 🧭 Top Bar */}
      {submitting && (
        <View style={styles.overlay}>
        <Text style={styles.overlayText}>Posting...</Text>
    </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="close" size={26} color="#000" onPress={()=>router.replace("/")} />
        </TouchableOpacity>
        <Text style={[styles.title,{color:colors.text}]}>Create Post</Text>
        <TouchableOpacity onPress={handlePost} disabled={submitting}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* 👤 Avatar + Input */}
        <View style={styles.row}>
          <Image
            source={{ uri: user?.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
            style={styles.avatar}
          />
          <TextInput
            style={[styles.input, {color: colors.text}]}
            placeholder="What's happening?"
            placeholderTextColor="#888"
            multiline
            value={content}
            onChangeText={setContent}
          />
        </View>

        {/* 🗂 Category Picker */}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.category,
                category === item && styles.selectedCategory,
              ]}
              onPress={() => setCategory(item)}>
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.selectedCategoryText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🖼 Image Picker */}
        {selectedImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imagepreview || selectedImage.uri || "" }} style={styles.imagePreview} />
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={styles.removeImage}>
              <Ionicons name="close-circle" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={22} color="#007AFF" />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
         overlay: {
    position: "absolute",
    top: 35, left: 0, right: 0,
    padding: 10,
    backgroundColor: "rgba(219, 219, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100, // High zIndex to overlay other content
  },
  overlayText: {
    fontSize: 18,
    color: "#001effff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    marginTop:30,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  postButton: {
    fontWeight: '600',
    color: '#007AFF',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  label: {
    marginTop: 8,
    marginBottom: 6,
    fontWeight: '600',
    fontSize: 15,
  },
  category: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#555',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  addImageText: {
    color: '#007AFF',
    marginLeft: 5,
    fontWeight: '600',
  },
  imageContainer: {
    marginTop: 15,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 2,
  },
});

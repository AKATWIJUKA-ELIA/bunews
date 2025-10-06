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

export default function CreatePostScreen() {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [category, setCategory] = useState<string | null>(null);
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
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0] as unknown as File);
        setImagePreview(result.assets[0].uri);
    }
  };

  // 🚀 Submit handler
  const handlePost = async () => {
        // const NewUser = await user ? user : 
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }
    const TIMEOUT_MS = 90000;  //
        let imageUrl = "";
         const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
                        return Promise.race([
                          promise,
                          new Promise<T>((_, reject) =>
                            setTimeout(() => reject(new Error("Request timed out")), ms)
                          
                          ),
                        ]);
                      };

                  try {
                        await withTimeout((async () => {
                         // Step 1: Get a short-lived upload URL
                        const postUrl = await generateUploadUrl();
                                if (!postUrl) throw new Error("Failed to get upload URL");

                                const formData = new FormData();
                                formData.append("file", {
                                        uri: imagepreview || "", // e.g. "file:///..."
                                        name: selectedImage?.name,
                                        type: selectedImage?.type
                                    } as any);
                                    const result = await fetch(postUrl, {
                                        method: "POST",
                                        headers: { "Content-Type":" multipart/form-data" },
                                        body: formData,
                                  });
                                  
                                  if (!result.ok) throw new Error("Failed to ucpload image");
                                  const res= await result.json();
                                        imageUrl = res.storageId;
                                        console.log("Image uploaded successfully:", imageUrl);

                        })(), TIMEOUT_MS);} catch(errrr) {
                        alert("Image upload timed out. Please try again.");
                        alert(errrr);
                        return;
                        }

  await CreatePost({
    title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
    authorId:user?._id as Id<"users"> ,
        content,
        category: category || 'General',
        excerpt: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        postImage: imageUrl || '',
  });

    Alert.alert('Success', 'Your news update has been posted!');
    setContent('');
    setSelectedImage(null);
    setCategory(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🧭 Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="close" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* 👤 Avatar + Input */}
        <View style={styles.row}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/50' }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
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
            <Image source={{ uri: imagepreview||"" }} style={styles.imagePreview} />
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

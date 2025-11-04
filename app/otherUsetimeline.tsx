import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView,ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Id } from "@/convex/_generated/dataModel";
// import your hooks or API functions to fetch user and posts info
import useGetUserById from "@/hooks/useGetUserById";
import useGetPostsByAuthor from "@/hooks/useGetPostsByAuthor";
import { PostWithAuthor, User } from "@/lib/types";
import NewsCard from "@/components/Feed/NewsCard/NewsCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 
import { useColorScheme } from "@/hooks/use-color-scheme";
import { lightTheme, darkTheme } from "@/constants/theme";
const tabs = [
  { title: 'Home', name: 'home', href: '/(tabs)/home' as const, icon: { name: 'home' as const, size: 28 } },
  { title: 'Post', name: 'post', href: '/(tabs)/post' as const, icon: { name: 'add-circle' as const, size: 28 } },
  { title: 'Account', name: 'account', href: '/(tabs)/account' as const, icon: { name: 'person' as const, size: 28 } },
];

export default function OtherUserTimelineScreen() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkTheme : lightTheme;

           const [user, setUser] = useState<any>(null);
  // Fetch user info and posts (custom hooks or your API logic)
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
  const { postWithAuthor:posts, loading: loadingPosts } = useGetPostsByAuthor(user?.User_id as Id<"users">);
 

  if ( loadingPosts) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2b2bff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loader}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
        options={{
          title: `Account `, // dynamic title
          headerShown: false,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.text },
        }}
      />
      {/* User About Section */}
      <ImageBackground
      source={{ uri:user.bannerImage||"https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" }}
      style={styles.profileSectionImage}
      imageStyle={{ borderRadius: 1 }} // optional: round the image corners
      resizeMode="cover"
      >
        <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
        <Image
          source={{ uri: user.profilePicture || "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: colors.text }]}>{user.Username}</Text>
        <Text style={[styles.username, { color: colors.tint }]}>@{user.Username.toLowerCase()}</Text>
        <Text style={[styles.email, { color: colors.text }]}>{user.email}</Text>
        {user.about ? <Text style={[styles.about, { color: colors.text }]}>{user.about}</Text> : <Text style={[styles.about, { color: colors.text }]}>This is my about info and so on</Text>}
        {/* Add followers/following, join date, etc. if needed */}
        <View style={{height:"auto",paddingVertical:10,paddingHorizontal:12,flexDirection:"row",gap:34, position:"absolute",top:30, right:22, zIndex:50, borderRadius:40, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.borderColor }} >
                   {tabs.map((tab)=>(
                <View key={tab.name} style={{borderWidth:2, padding:3,borderRadius:40,borderColor:"#ffff" ,alignItems:"center", justifyContent:"center"}} >
  <Link href={tab.href} style={{ alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={tab.icon.name} size={tab.icon.size} color={colors.tint} />
        </Link>
      </View>
         ))}
        </View>
      
      </View>
      </ImageBackground>
      
     

      {/* Timeline Section */}
      <Text style={[styles.sectionHeader, { color: colors.text }]}>Posts by You</Text>
      {posts?.length === 0 ? (
        <Text style={[styles.noPosts, { color: colors.icon }]}>No posts yet. Your Posts will Appear Here</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => 
          <NewsCard post={item as PostWithAuthor} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1,paddingHorizontal:14, backgroundColor: colors.background }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loader: {
    flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff"
  },
  profileSectionImage: {
//     alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        backgroundImage: '',
    padding: 2,
    
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: 30,
  },
        profileSection: {
                backgroundColor: "#ffffffff",
                padding: 16,
        },
  avatar: {
    width: 90, height: 90, borderRadius: 45, marginBottom: 12,
    backgroundColor: "#353535ff"
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#000000ff" },
  username: { fontSize: 14, color: "#0011ffff", marginTop: 2 },
  email: { fontSize: 14, color: "#000000ff", marginTop: 4 },
  about: { marginTop: 10, fontSize: 15, color: "#000000ff", textAlign: "left", fontStyle: "italic" },
  sectionHeader: {
    fontSize: 17, fontWeight: "700", marginVertical: 14, marginLeft: 18
  },
  noPosts: {
    textAlign: "center", color: "#aaa", marginTop: 20
  }
});
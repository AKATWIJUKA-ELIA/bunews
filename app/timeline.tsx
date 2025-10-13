import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView,ImageBackground, TouchableOpacity } from "react-native";
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
import { useTheme } from "./ThemeContext";
import { lightTheme, darkTheme } from "../constants/theme";
import RepostCard from "@/components/RepostCard/RepostCard";
import useGetRepostsByUser from "@/hooks/useGetRepostsByUser";

const tabs: {
  title: string;
  name: string;
  icon: { name: React.ComponentProps<typeof Ionicons>['name']; size: number };
}[] = [
  { title: 'Home', name: 'home', icon: { name: 'home', size: 28 } },
  {title:"Post", name:"post", icon:{name:"add-circle", size:28}},
  { title: 'Account', name: 'account', icon: { name: 'person', size: 28 } },
];

export default function UserTimelineScreen() {
           const { theme } = useTheme();
          const colors = theme === "dark" ? darkTheme : lightTheme;
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
        const { data:reposts, loading: loadingReposts } = useGetRepostsByUser(user?.User_id as Id<"users">);
 const [activeTab, setActiveTab] = useState<"posts" | "reposts">("posts");

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
    <ScrollView style={[styles.container, {backgroundColor: colors.background}]}>
        <Stack.Screen
        options={{
          title: `Account `, // dynamic title
                headerShown: false,
          headerTitleAlign: 'left',
          headerStyle: {
                 backgroundColor: '#05032bff',
                 
           },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      {/* User About Section */}
      <ImageBackground
      source={{ uri:user.bannerImage||"https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" }}
      style={styles.profileSectionImage}
      imageStyle={{ borderRadius: 1 }} // optional: round the image corners
      resizeMode="cover"
      >
        <View style={styles.profileSection}>
        <Image
          source={{ uri: user.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.Username}</Text>
        <Text style={styles.username}>@{user.Username.toLowerCase()}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.about ? <Text style={styles.about}>{user.about}</Text> : <Text style={styles.about}>This is my about info and so on</Text>}
        {/* Add followers/following, join date, etc. if needed */}
        <View style={{height:"auto",paddingVertical:10,paddingHorizontal:12,flexDirection:"row",gap:34, position:"absolute",top:30, right:22, zIndex:50, borderRadius:40, backgroundColor:"#9b9abeff", }} >
                   {tabs.map((tab)=>(
                <View key={tab.name} style={{borderWidth:2, padding:3,borderRadius:40,borderColor:"#ffff" ,alignItems:"center", justifyContent:"center"}} >
        <Link href={`/${tab.name}`} style={{ alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={tab.icon.name} size={tab.icon.size} color={"blue"} />
        </Link>
      </View>
         ))}
        </View>
      
      </View>
      </ImageBackground>
      
     <View style={styles.tabBar}>
  <TouchableOpacity
    style={[styles.tabButton, activeTab === "posts" && styles.activeTab]}
    onPress={() => setActiveTab("posts")}
  >
    <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>Posts</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.tabButton, activeTab === "reposts" && styles.activeTab]}
    onPress={() => setActiveTab("reposts")}
  >
    <Text style={[styles.tabText, activeTab === "reposts" && styles.activeTabText]}>Reposts</Text>
  </TouchableOpacity>
</View>

      {/* Timeline Section */}
      {activeTab === "posts" && (
        <>
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Posts by You</Text>
          {posts?.length === 0 ? (
            <Text style={[styles.noPosts, { color: colors.text }]}>No posts yet. Your Posts will Appear Here</Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={item => item._id}
              renderItem={({ item }) =>
                <NewsCard post={item as PostWithAuthor} />}
              contentContainerStyle={{ paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, paddingHorizontal: 14 }}
            />
          )}
        </>
      )}

        {activeTab === "reposts" && (
        <>
        <Text style={[styles.sectionHeader, { color: colors.text }]}>Reposts by You</Text>
          {reposts?.length === 0 ? (
            <Text style={[styles.noPosts, { color: colors.text }]}>No reposts yet. Your Reposts will Appear Here</Text>):(
                reposts?.map((repost)=>(
                        
                         <View key={repost?.post._id} style={{paddingHorizontal:4, marginBottom:6}}>
                        <RepostCard repost={repost} />
                        </View>
                ))
                ) }
        </>
        )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
        tabBar: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 12,
  backgroundColor: "#e2e8f0",
  borderRadius: 20,
  marginHorizontal: 20,
},
tabButton: {
  flex: 1,
  paddingVertical: 10,
  borderRadius: 20,
  alignItems: "center",
},
activeTab: {
  backgroundColor: "#2b2bff",
},
tabText: {
  color: "#222",
  fontWeight: "600",
  fontSize: 16,
},
activeTabText: {
  color: "#fff",
},
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
                opacity: 0.7,
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
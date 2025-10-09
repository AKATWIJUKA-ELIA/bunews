import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, ScrollView } from "react-native";
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
    <ScrollView style={styles.container}>
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
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user.profilePicture || "https://i.pravatar.cc/150?img=1" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.Username}</Text>
        <Text style={styles.username}>@{user.Username.toLowerCase()}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : <Text style={styles.bio}>This is my about info and so on</Text>}
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
     

      {/* Timeline Section */}
      <Text style={styles.sectionHeader}>Posts by You</Text>
      {posts?.length === 0 ? (
        <Text style={styles.noPosts}>No posts yet. Your Posts will Appear Here</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => 
          <NewsCard post={item as PostWithAuthor} />}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1,paddingHorizontal:14 }}
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
  profileSection: {
//     alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
    padding: 20,
    backgroundColor: "#f6f8fa",
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginTop: 30,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45, marginBottom: 12,
    backgroundColor: "#ddd"
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#222" },
  username: { fontSize: 14, color: "#888", marginTop: 2 },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  bio: { marginTop: 10, fontSize: 15, color: "#444", textAlign: "left", fontStyle: "italic" },
  sectionHeader: {
    fontSize: 17, fontWeight: "700", marginVertical: 14, marginLeft: 18
  },
  noPosts: {
    textAlign: "center", color: "#aaa", marginTop: 20
  }
});
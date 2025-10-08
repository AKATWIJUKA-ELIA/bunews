import React  from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import Loader from '@/components/Loader/loader';
import useGetPostById from '@/hooks/useGetPostById';
import { formatDate } from '@/lib/utils';



const comments = [
  {
    id: '1',
    user: 'John Doe',
    username: '@johndoe',
    text: 'This is an important move!',
    avatar: 'https://i.pravatar.cc/40?img=5',
    time: '1h',
  },
  {
    id: '2',
    user: 'Sarah K.',
    username: '@sarahk',
    text: 'Hope this ensures peace and transparency.',
    avatar: 'https://i.pravatar.cc/40?img=6',
    time: '30m',
  },
];


export default function PostDetailsScreen() {
        const route = useRoute();
        const { id } = route.params as { id: Id<"posts"> };
        // console.log("Post ID:", id);
        const { postWithAuthor:post , loading, error } = useGetPostById(id);
        if (loading) {
                return <Loader />;
        }
        
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Post `, // dynamic title
          headerTitleAlign: 'left',
          headerStyle: {
                 backgroundColor: '#05032bff',
           },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />

      {/* 📰 Post Content */}
      <View style={styles.postContainer}>

        <View style={styles.postHeader }>
          <Image source={{ uri: post.author?.profilePicture||""}} style={styles.avatar} />
          <View  style={{ flexDirection: 'row', gap: 24, alignItems: 'center' , flex: 0 }}>
            <Text style={styles.author}>{post.author?.username} </Text>
            <Text style={styles.username}>@{post.author?.username} • {formatDate(post._creationTime||0)}</Text>
          </View>
        </View>



        <View style={styles.contentwithImage}>

        <View>
                <Text style={styles.content}>{post.content}</Text>
                {post.postImage && <Image source={{ uri: post.postImage }} style={styles.image} />}
        </View>

          <View style={styles.actions}>
              
          <TouchableOpacity style={styles.action}>
            <Ionicons name="chatbubble-outline" size={20} color="#555" />
            {/* <Text style={styles.count}>{post.comments}</Text> */}
          </TouchableOpacity>
            <TouchableOpacity style={styles.action}>
            <Ionicons name="heart-outline" size={20} color="#555" />
            <Text style={styles.count}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action}>
            <Ionicons name="repeat-outline" size={20} color="#555" />
            <Text style={styles.count}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.action}>
            <Ionicons name="share-social-sharp" size={20} color="#555" />
          </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 💬 Comments Section */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListHeaderComponent={<Text style={styles.commentsHeader}>Comments</Text>}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.commentUser}>{item.user} <Text style={styles.commentUsername}>{item.username}</Text></Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
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
    gap: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  postContainer: {
    padding: 16,
    paddingLeft: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  contentwithImage:{
paddingLeft: 30,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  author: {
    fontWeight: '700',
  },
  username: {
    color: '#777',
    fontSize: 12,
  },
  content: {
    fontSize: 15,
    marginVertical: 6,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: 13,
    color: '#555',
  },
  commentsHeader: {
    fontSize: 16,
    fontWeight: '700',
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  commentAvatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  commentUser: {
    fontWeight: '600',
  },
  commentUsername: {
    color: '#666',
  },
  commentText: {
    marginTop: 2,
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});

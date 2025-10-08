import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import Loader from '@/components/Loader/loader';
import useGetPostById from '@/hooks/useGetPostById';
import NewsCard from '@/components/Feed/NewsCard/NewsCard';
import { PostWithAuthor } from '@/lib/types';


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
  {
        id: '3',
        user: 'Mike L.',
        username: '@mikel',
        text: 'What are the implications for the tech industry?',
        avatar: 'https://i.pravatar.cc/40?img=7',
        time: '15m',
  },
  {
        id: '4',
        user: 'Anna W.',
        username: '@annaw',
        text: 'Great to see such initiatives being taken!',
        avatar: 'https://i.pravatar.cc/40?img=8',
        time: '5m',
  },
  {
        id: '5',
        user: 'David R.',
        username: '@davidr',
        text: 'Looking forward to more updates on this.',
        avatar: 'https://i.pravatar.cc/40?img=9',
        time: '2m',
  },
  {
        id: '6',
        user: 'Emily S.',
        username: '@emilys',
        text: 'This could change everything!',
        avatar: 'https://i.pravatar.cc/40?img=10',
        time: '1m',
  }
];


export default function PostDetailsScreen() {
  const route = useRoute();
  const { id } = route.params as { id: Id<"posts"> };
  const [comment, setComment] = useState('');
  const { postWithAuthor: post, loading } = useGetPostById(id);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Post `,
          headerShown: true,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: '#ffffffff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: "#000" },
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80} // adjust if needed for your header
      >
        <ScrollView
          style={styles.postContainer}
          contentContainerStyle={{ paddingBottom: 90 }} // leave space for the input
          keyboardShouldPersistTaps="handled"
        >
          <NewsCard post={post as PostWithAuthor} />
          
          {/* Comments Section */}
          <Text style={styles.commentsHeader}>Comments</Text>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>
                  {comment.user} <Text style={styles.commentUsername}>{comment.username}</Text>
                </Text>
                <Text style={styles.commentText}>{comment.text}</Text>
                <Text style={styles.commentTime}>{comment.time} ago</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="what do you say about this 🤔?"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
            returnKeyType="send"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  postContainer: { flex: 1, padding: 16, paddingLeft: 10 },
  commentsHeader: { fontSize: 16, fontWeight: '700', padding: 16, paddingLeft: 0 },
  commentItem: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  commentAvatar: { width: 35, height: 35, borderRadius: 50 },
  commentUser: { fontWeight: '600' },
  commentUsername: { color: '#666' },
  commentText: { marginTop: 2, fontSize: 14 },
  commentTime: { fontSize: 12, color: '#999', marginTop: 2 },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    minHeight: 45,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#0400ffff",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9ff",
    fontSize: 16,
  },
});
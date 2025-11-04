import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import { CommentWithUser } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import useInteractWithPost from '@/hooks/useInteractWithPost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme } from "../../constants/theme";
import useGetRepliesToComment from '@/hooks/useGetRepliesToComment';
import Loader from '@/components/Loader/loader';

export default function CommentDetailsScreen() {
  const { comment: commentParam } = useLocalSearchParams<{ comment?: string }>();
  const commentObj: CommentWithUser | null = commentParam ? JSON.parse(commentParam) : null;

  const [reply, setReply] = useState('');
  const { commentOnComment } = useInteractWithPost();
  const [user, setUser] = useState<any>(null);
  const { commentsWithAuthors,loading } = useGetRepliesToComment(commentObj?._id as Id<'comments'>);

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('user');
      if (userString) setUser(JSON.parse(userString));
    })();
  }, []);

  const handleReply = async () => {
    if (!reply.trim() || !commentObj || !commentObj._id || !commentObj.postId || !user?.User_id) return;
    try {
      await commentOnComment(commentObj.postId as Id<'posts'>, commentObj._id as Id<'comments'>, user.User_id as Id<'users'>, reply);
      setReply('');
    } catch (e) {
      console.log('Reply failed', e);
    }
  };

  if (loading) {
    return (
      <Loader />
  
    );
  }

  if (!commentObj) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}> 
        <Text style={{ color: colors.text }}>No comment data provided.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Comment',
          headerShown: true,
          headerTintColor: colors.text,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.text },
        }}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={80}>
        <FlatList
          data={commentsWithAuthors ?? []}
          keyExtractor={(item) => String(item._id)}
          style={styles.postContainer}
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <View>
              <View style={[styles.commentItem, { backgroundColor: colors.background }]}> 
                <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between' }}>
                  <Image source={{ uri: commentObj.user?.profilePicture || '' }} style={styles.commentAvatar} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.commentUser}>
                      <Text style={styles.commentUsername}>{commentObj.user?.username}</Text>
                      <Text style={styles.commentTime}>{formatDate(commentObj._creationTime || 0)} ago</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.commentText, { color: colors.text }]}>{commentObj.content}</Text>
              </View>
              <Text style={[styles.commentsHeader, { color: colors.text }]}>Replies</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.commentItem, { backgroundColor: colors.background }]}> 
              <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'space-between' }}>
                <Image source={{ uri: item.user?.profilePicture || '' }} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.commentUser}>
                    <Text style={styles.commentUsername}>{item.user?.username}</Text>
                    <Text style={styles.commentTime}>{formatDate(item._creationTime || 0)} ago</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.commentText, { color: colors.text }]}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: colors.icon, marginTop: 16 }}>No replies yet.</Text>
          }
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
          <TextInput
            placeholder="Reply 🫴?"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={reply}
            onChangeText={setReply}
            multiline
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleReply} style={styles.SendButton}>
            <Text style={{ color: '#00a6ffff', fontWeight: '600' }}>Reply</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: '#0000f8ff',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  postContainer: { flex: 1, padding: 16, paddingLeft: 10 },
  commentsHeader: {
        fontSize: 16,
        fontWeight: '700',
        padding: 16, 
        paddingLeft: 0
           },
  commentItem: {
    flexDirection: 'column',
    paddingHorizontal: 0,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  commentAvatar: { width: 35, height: 35, borderRadius: 50 },
  commentUser: {
        flexDirection:"row", 
        fontWeight: '600',
        alignItems:"center",
        justifyContent:"space-between",
        // gap:"24"
},
  commentUsername: { color: '#666' },
  commentText: { 
        // marginTop: 2,
        fontSize: 14,
        marginLeft:44
        },
  commentTime: { fontSize: 12, color: '#999', marginTop: 2 },
  SendButton:{
        marginLeft: 8,
        color: '#00a6ffff',
        fontWeight: '600',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#00a6ffff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
  },
  inputContainer: {
//     position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    bottom: 0,
    left: 0,
    right: 30,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    minHeight: 45,
    minWidth: "70%",
    maxWidth: "80%",
    textOverflow:'wrap',
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
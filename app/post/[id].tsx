import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, Button, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Id } from '@/convex/_generated/dataModel';
import Loader from '@/components/Loader/loader';
import useGetPostById from '@/hooks/useGetPostById';
import NewsCard from '@/components/Feed/NewsCard/NewsCard';
import { PostWithAuthor } from '@/lib/types';
import useInteractWithPost from '@/hooks/useInteractWithPost';
import useGetPostComments from '@/hooks/useGetPostComments';
import { formatDate } from '@/lib/utils';
import { CommentWithUser } from '@/lib/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme } from "../../constants/theme";
import { Ionicons } from '@expo/vector-icons';



export default function PostDetailsScreen() {
  const route = useRoute();
  const { id } = route.params as { id: Id<"posts"> };
  const [comment, setComment] = useState('');
  const { postWithAuthor: post, loading } = useGetPostById(id);
  const { commentOnPost, } = useInteractWithPost();
  const { commentsWithAuthors: commentsData, } = useGetPostComments(id);
  const [user, setUser] = useState<any>(null);
          const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [showImage,setShowImage] = useState(false)

   const colorScheme = useColorScheme();
        const colors = colorScheme === "dark" ? darkTheme : lightTheme;

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



        useEffect(() => {
    if (post?.postImage) {
      Image.getSize(
        post.postImage,
        (width, height) => {
          const screenWidth = Dimensions.get('window').width - 32; // padding margin
          const scaleFactor = width / screenWidth;
          const imageHeight = height / scaleFactor;
          setImageSize({ width: screenWidth, height: imageHeight });
        },
        (error) => {
          console.warn('Failed to get image size', error);
        }
      );
    }
  }, [post?.postImage]);

  const handleComment=async(comment:string) => {
        if(!comment.trim()) return;
        await commentOnPost(id, user.User_id, comment).then((res)=>{
                console.log("Comment response:", res);
                setComment('');
        }).catch((err)=>{console.log(err)});
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Stack.Screen
        options={{
          title: `Post `,
          headerShown: true,
          headerTintColor:`${colors.text}`,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: `${colors.background}`, },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: `${colors.text}` },
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
          {/* Card without inline image to avoid duplication */}
          <TouchableOpacity  onPress={()=>setShowImage(true)}style={{zIndex:50}} >
                <NewsCard post={post as PostWithAuthor} />
          </TouchableOpacity>
          

          {/* Full-size post image preserving aspect ratio */}
          {/* {post?.postImage && imageRatio && (
            <Image
              source={{ uri: post.postImage }}
              resizeMode="contain"
              style={{ width: '100%', aspectRatio: imageRatio, borderRadius: 10, marginTop: 6, marginBottom: 12 }}
            />
          )} */}
        

          {/* Comments Section */}
          <Text style={styles.commentsHeader}>Comments</Text>
          {commentsData && commentsData.length > 0 ? commentsData.map((comment) => (
            <View key={comment._id} style={[styles.commentItem, {backgroundColor: colors.background}]}>
              <Image source={{ uri: comment.user?.profilePicture||"" }} style={styles.commentAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>
                <Text style={styles.commentUsername}>{comment.user?.username}</Text>
                </Text>
                <Text style={[styles.commentText,{color:colors.text}]}>{comment.content}</Text>
                <Text style={styles.commentTime}>{formatDate(comment._creationTime||0)} ago</Text>
              </View>
            </View>
          )): (
                <Text style={{textAlign:'center', color:'#9a1515ff', marginTop:20}}>No comments yet. Be the first to comment!</Text>
          
          )}
        </ScrollView>
        <View style={[styles.inputContainer, {backgroundColor: colors.background}]}>
          <TextInput
            placeholder="Reply 🫴?"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={comment}
            onChangeText={setComment}
            multiline
            returnKeyType="send"
          />
                <TouchableOpacity onPress={() => handleComment(comment)} style={styles.SendButton}>
                        <Text style={{color:'#00a6ffff', fontWeight:'600'}}>Reply</Text>
                </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
        {post?.postImage && showImage && (
                      <View style={{position:"absolute",left:0,right:0,top:0,bottom:0,backgroundColor:"#000000ff"}} >
                        <TouchableOpacity onPress={()=>{setShowImage(false)}} >
                                <Ionicons name="close" size={36} color={colors.icon} style={{position:"absolute", top:2,right:32}} />
                        </TouchableOpacity>
                        <Image
                        source={{ uri: post?.postImage }}
                        resizeMode="contain"
                         style={[ {width:imageSize.width,height:imageSize.height, position:"absolute", borderRadius: 10,right:1,left:1,top:"25%", } ]}
                      />
                      </View>
                    )}
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
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useNavigation } from 'expo-router';
import { PostWithAuthor } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import useInteractWithPost from '@/hooks/useInteractWithPost';
import { Id } from '@/convex/_generated/dataModel';
import useGetPostComments from '@/hooks/useGetPostComments';
import { FontAwesome } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from "../../../app/ThemeContext";
import { lightTheme, darkTheme } from "../../../constants/theme";
import useGetAllReposts from '@/hooks/useGetAllReposts';

type RootStackParamList = {
  repostScreen: { post: PostWithAuthor };
  // add other routes here if needed
};

export default function NewsCard({ post }: { post: PostWithAuthor }) {
         const { theme } = useTheme();
        const colors = theme === "dark" ? darkTheme : lightTheme;
                const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
                const { likePost } = useInteractWithPost();
                const [liked, setLiked] = useState(false);
                        const handleLike = async () => {

                await likePost(post?._id as Id<"posts">, post?.author?._id!).then((res)=>{
                        console.log("Like response:", res);
                }).catch((err)=>{console.log(err)});
        }
          const { data:comments} = useGetPostComments(post?._id as Id<"posts">);
        const { data:reposts } = useGetAllReposts();
        const repostsCount = reposts?.filter(r => r.originalPostId === post?._id).length || 0;

  return (
          <View style={[styles.postContainer, { backgroundColor: colors.background,borderColor: colors.borderColor }]}>
    
            
    
            <View style={styles.postHeader }>
               <Link
  href={{
    pathname: "/otherUserTimeLine/[user]",
    params: { user: JSON.stringify(post?.author) }
  }}
  
>
  <Image
    source={{ uri: post?.author?.profilePicture || "https://www.gravatar.com/avatar/?d=mp" }}
    style={styles.avatar}
  />
</Link>
             
              <View  style={{ flexDirection: 'row', gap: 20, alignItems: 'center' , flex: 0 }}>
                <Text style={[styles.author,{color:colors.text}]}>{post?.author?.username} </Text>
                <Text style={[styles.username,{color:colors.icon}]}>@{post?.author?.username} • <Text style={styles.date}>{formatDate(post?._creationTime||0)}</Text></Text>
                {/* <Text style={styles.follow}>follow</Text> */}
              </View>
            </View>
    
    
    
            <View style={styles.contentwithImage}>
    
            <View>
                    <Text style={[styles.content,{color:colors.text}]}>{post?.content}</Text>
                    <Link href={`/post/${post?._id}`} >
                    {post?.postImage && <Image source={{ uri: post?.postImage }} style={styles.image} />}
                    </Link>
            </View>
    
              <View style={styles.actions}>
                  <Link href={`/post/${post?._id}`} asChild>
                  <TouchableOpacity style={styles.action}>
                <Ionicons name="chatbubble-outline" size={20} color="#0077ffff" />
                <Text style={[styles.count,{color:colors.text}]}>{comments?.length}</Text>
              </TouchableOpacity>
                  </Link>
              

              <TouchableOpacity style={styles.action} onPress={()=>{navigation.navigate("repostScreen", { post })}}>
                <Ionicons name="repeat-outline" size={20} color="#555" />
                <Text style={[styles.count,{color:colors.text}]}>{repostsCount}</Text>
              </TouchableOpacity>
    
    
                <TouchableOpacity style={styles.action} onPress={()=>handleLike()}>
                <FontAwesome name="heart" size={20} color="#ff0000ff" />
                <Text style={[styles.count,{color:colors.text}]}>{post?.likes}</Text>
              </TouchableOpacity>
    
              
              <TouchableOpacity style={styles.action}>
                <Ionicons name="share-social-sharp" size={20} color={colors.icon} />
              </TouchableOpacity>
              </View>
            </View>
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
    borderRadius: 10,
    borderWidth: 0.9,
    borderLeftWidth: 0.9,
    borderColor: '#2200ffff',
    marginVertical: 6,
  },
  contentwithImage:{
        marginTop: -10,
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
        
    color: '#0d00c9ff',
    fontSize: 12,
  },
  date:{
        color: '#777777ff',
  },
    follow:{
        color: '#040ab7ff',
        fontSize: 12,
        borderWidth: 0.5,
        padding:6,
        borderRadius:10,
        borderColor: '#2200ffff',
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
    color: '#0000f8ff',
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


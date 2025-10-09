import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { PostWithAuthor } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import useInteractWithPost from '@/hooks/useInteractWithPost';
import { Id } from '@/convex/_generated/dataModel';
import useGetPostComments from '@/hooks/useGetPostComments';


export default function NewsCard({ post }: { post: PostWithAuthor }) {
                const { likePost } = useInteractWithPost();
                        const handleLike = async () => {
                await likePost(post?._id as Id<"posts">, post?.author?._id!).then((res)=>{
                        console.log("Like response:", res);
                }).catch((err)=>{console.log(err)});
        }
          const { data:comments} = useGetPostComments(post?._id as Id<"posts">);

  return (
          <View style={styles.postContainer}>
    
            
    
            <View style={styles.postHeader }>
              <Image source={{ uri: post?.author?.profilePicture||""}} style={styles.avatar} />
              <View  style={{ flexDirection: 'row', gap: 24, alignItems: 'center' , flex: 0 }}>
                <Text style={styles.author}>{post?.author?.username} </Text>
                <Text style={styles.username}>@{post?.author?.username} • <Text style={styles.date}>{formatDate(post?._creationTime||0)}</Text></Text>
                <Text style={styles.follow}>follow</Text>
              </View>
            </View>
    
    
    
            <View style={styles.contentwithImage}>
    
            <View>
                    <Text style={styles.content}>{post?.content}</Text>
                    <Link href={`/post/${post?._id}`} >
                    {post?.postImage && <Image source={{ uri: post?.postImage }} style={styles.image} />}
                    </Link>
            </View>
    
              <View style={styles.actions}>
                  
              <TouchableOpacity style={styles.action}>
                <Ionicons name="chatbubble-outline" size={20} color="#0077ffff" />
                <Text style={styles.count}>{comments?.length}</Text>
              </TouchableOpacity>
    
              <TouchableOpacity style={styles.action}>
                <Ionicons name="repeat-outline" size={20} color="#555" />
                <Text style={styles.count}>5</Text>
              </TouchableOpacity>
    
    
                <TouchableOpacity style={styles.action} onPress={()=>handleLike()}>
                <Ionicons name="heart-outline" size={20} color="#ff00008f" />
                <Text style={styles.count}>{post?.likes}</Text>
              </TouchableOpacity>
    
              
              <TouchableOpacity style={styles.action}>
                <Ionicons name="share-social-sharp" size={20} color="#2200ffff" />
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


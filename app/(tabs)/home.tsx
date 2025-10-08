import React, { useEffect, useRef, useState } from 'react';
import { View, Text,SafeAreaView, StyleSheet, Image, Animated, FlatList } from 'react-native';
import FeedList from "@/components/Feed/FeedList";
import Header from "@/components/Header/Header";
import useGetAllPosts from '@/hooks/useGetAllPosts';
import Loader from '@/components/Loader/loader'

export default function NewsFeedScreen() {

        const { postsWithAuthors: posts, loading } = useGetAllPosts();
        // const newsPosts = posts?.filter(post => post !== undefined);
        const scrollY = useRef(new Animated.Value(0)).current;
        const headerTranslateY = scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -100], // Header slides up by 80px
                extrapolate: 'clamp',
        });
        const [newsPosts, setNewsPosts] = useState(posts); // consider: useState<PostWithAuthor[] | undefined>(posts);

        useEffect(() => {
                setNewsPosts(posts);
        }, [posts]);
        
        // if (loading) {
        //         return <Loader />;
        // }

  return (
    <SafeAreaView style={styles.container}>
         <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Header />
         </Animated.View>

         <Animated.FlatList
        data={newsPosts ?? []} // ensure data is always an array
         keyExtractor={(item, index) => (item && item._id ? item._id.toString() : index.toString())}
        contentContainerStyle={{ paddingTop: 70 }} // space for header
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
         renderItem={({ item }) => ( // <-- destructure here
        <FeedList item={item} />
        )}
         />
         
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 83,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.3,
    borderColor: '#0008ffdd',
  },
});

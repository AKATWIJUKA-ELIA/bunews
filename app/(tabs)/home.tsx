import React, { useRef } from 'react';
import { View, Text,SafeAreaView, StyleSheet, Image, Animated, FlatList } from 'react-native';
import FeedList from "@/components/Feed/FeedList";
import Header from "@/components/Feed/Header/Header";

export default function NewsFeedScreen() {
        const scrollY = useRef(new Animated.Value(0)).current;
        const headerTranslateY = scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -100], // Header slides up by 80px
                extrapolate: 'clamp',
        });
        const mockData = [
  {
    id: '1',
    author: 'Daily Monitor',
    username: '@dmonitor',
    time: '2h',
    content:
      'Uganda has tightened and increased security as it approaches the 2025/26 Presidential Elections.',
    image: 'https://picsum.photos/600/400',
  },
  {
    id: '2',
    author: 'TechDigest',
    username: '@techdigest',
    time: '5h',
    content: 'AI is revolutionizing journalism with real-time fact-checking tools.',
    image: 'https://picsum.photos/600/350',
  },
  {
    id: '3',
    author: 'HealthNews',
    username: '@healthnews',
    time: '1h',
    content: 'New advancements in cancer research show promising results.',
    image: 'https://picsum.photos/600/300',
  },
  {
    id: '4',
    author: 'SportsDaily',
    username: '@sportsdaily',
    time: '3h',
    content: 'Local team wins championship in a thrilling final match.',
    image: 'https://picsum.photos/600/250',
  }
];
  return (
    <SafeAreaView style={styles.container}>
         <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}>
                <Header />
         </Animated.View>

         <Animated.FlatList
        data={mockData}
         keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 70 }} // space for header
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
         renderItem={({ item }) => (
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
    height: 70,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.3,
    borderColor: '#ddd',
  },
});

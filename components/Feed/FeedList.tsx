import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NewsCard from './NewsCard/NewsCard';
import { PostWithAuthor } from '@/lib/types';
import { Link } from 'expo-router';

interface FeedListProps {
  item: PostWithAuthor| undefined;
 }


export default function FeedList({ item }: FeedListProps) {
  return (
        <View>
                <NewsCard post={item} />
                <View style={styles.separator} />
        </View>

  );
}

const styles = StyleSheet.create({
  separator: {
    height:10,
    backgroundColor: '#f4f4f4',
  },
  post:{
        flex: 1,
  }
});

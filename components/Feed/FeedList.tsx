import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NewsCard from './NewsCard/NewsCard';

interface FeedListProps {
  item: {
        id: string;
        author: string;
        username: string;
        time: string;
        content: string;
        image?: string;
      };
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
});

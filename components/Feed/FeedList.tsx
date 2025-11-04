import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NewsCard from './NewsCard/NewsCard';
import { PostWithAuthor } from '@/lib/types';
import { lightTheme, darkTheme } from "../../constants/theme";
import { useColorScheme, } from '@/hooks/use-color-scheme';
interface FeedListProps {
  item: PostWithAuthor| undefined;
 }


export default function FeedList({ item }: FeedListProps) {
        const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? darkTheme : lightTheme;
  return (
        <View style={{backgroundColor:colors.background}}>
                <NewsCard post={item} />
                <View style={[styles.separator,]} />
        </View>

  );
}

const styles = StyleSheet.create({
  separator: {
    height:0,
    borderTopWidth: 0.2,
    borderTopColor: '#bdbdbdff',
  },
  post:{
        flex: 1,
  }
});

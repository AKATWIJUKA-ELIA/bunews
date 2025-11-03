import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import NewsCard from './NewsCard/NewsCard';
import { PostWithAuthor } from '@/lib/types';
import { useTheme } from "../../app/ThemeContext";
import { lightTheme, darkTheme } from "../../constants/theme";

interface FeedListProps {
  item: PostWithAuthor| undefined;
 }


export default function FeedList({ item }: FeedListProps) {
        const { theme } = useTheme();
  const colors = theme === "dark" ? darkTheme : lightTheme;
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

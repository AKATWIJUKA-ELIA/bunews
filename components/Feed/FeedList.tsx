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
                <View style={[styles.separator,{backgroundColor:colors.background}]} />
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

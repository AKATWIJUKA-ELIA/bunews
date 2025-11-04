import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, } from '@/hooks/use-color-scheme';
import { lightTheme, darkTheme } from "../../constants/theme";
import useGetAllPosts from '@/hooks/useGetAllPosts';
import { formatDate } from '@/lib/utils';
import Loader from '@/components/Loader/loader';
import { Link, router } from 'expo-router';
import { ScrollView } from 'react-native';
  const categories = [
    'Politics',
    'Technology',
    'Business',
    'Culture',
    'Science',
    'Sports',
  ]
export default function SearchScreen() {
  const [query, setQuery] = useState('');

   const colorScheme = useColorScheme();
        const colors = colorScheme === "dark" ? darkTheme : lightTheme;
        const { JustPosts, loading } = useGetAllPosts();
        const trendingPosts = JustPosts?.filter((post)=>(post.likes>2)).slice(0,5);
         const [searchResults, setSearchResults] = useState<typeof JustPosts>([]);

        const NumberofTrending=(category:string)=>{
                return JustPosts?.filter((post)=>(post.category===category)).length;
        }



  const handleSearch = (text: string) => {
    setQuery(text);
    // You can replace this with API logic later
    if (text.length > 0) setSearchResults(JustPosts?.filter((item) => item.category.toLowerCase().includes(text.toLowerCase())) || []);
    else setSearchResults([]);
   
  };
  if (loading) {
        return <Loader/>;
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>

      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Search news or topics"
          placeholderTextColor="#888"
          style={styles.input}
          value={query}
          onChangeText={handleSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

    

      {/* 📜 Search Results */}
     
        
       <ScrollView>
         {searchResults && searchResults?.length > 0 ? (
         searchResults.map((item) => (
                        <TouchableOpacity key={item._id} style={[styles.resultCard,]}  onPress={() => router.push(`/post/${item._id}`)}>
              <Image source={{ uri: item.postImage||"" }} style={styles.resultImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{item.category}</Text>
                <Text style={styles.resultSource}>{item.content}</Text>
                <Text>{formatDate(item._creationTime)}</Text>
              </View>
              
            </TouchableOpacity>
                
        ))
        ):
     
      (
        
        <>
        
          <Text style={[styles.sectionTitle,{color:colors.text}]}>Trending</Text>
          {trendingPosts?.map((item) => (
            <TouchableOpacity key={item._id} style={styles.trendingItem} onPress={() => {handleSearch(item.category)}}>
              <View  >
                <Text style={[styles.topic,{color:colors.text}]}>{item.category}</Text>
                <Text style={styles.tweets}>{NumberofTrending(item.category)} posts</Text>
              </View>
              {/* <Ionicons name="ellipsis-horizontal" size={18} color="#999" /> */}
            </TouchableOpacity>
          ))}
          <Text style={[styles.sectionTitle,{color:colors.text}]}>More Categories</Text>
          {categories?.map((item,index) => (
            <TouchableOpacity key={index} style={[styles.trendingItem,{borderBottomWidth: 0,}]} onPress={() => {handleSearch(item)}}>
              <View  >
                <Text style={[styles.topic,{color:colors.text}]}>{item}</Text>
              </View>
              {/* <Ionicons name="ellipsis-horizontal" size={18} color="#999" /> */}
            </TouchableOpacity>
          ))}
        </>
      )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
        
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 10,
    marginTop: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  topic: {
    fontWeight: '600',
    fontSize: 15,
  },
  tweets: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  resultCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 8,
        marginVertical: 6,
    borderWidth: 2,
    borderColor: '#0055ffff',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  resultSource: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
});

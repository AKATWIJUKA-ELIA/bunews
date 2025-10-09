import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockNews>([]);

  // Mock trending topics and search data
  const trendingTopics = [
    { id: '1', topic: '#UgandaElections2025', tweets: '32.4K' },
    { id: '2', topic: '#TechInAfrica', tweets: '12.1K' },
    { id: '3', topic: '#ClimateChange', tweets: '8.7K' },
  ];

  const mockNews = [
    {
      id: '1',
      title:
        'Uganda tightens security ahead of the 2025/26 Presidential Elections.',
      source: 'Daily Monitor',
      image: 'https://picsum.photos/200/120',
    },
    {
      id: '2',
      title: 'AI transforming journalism and real-time news verification.',
      source: 'TechDigest',
      image: 'https://picsum.photos/200/140',
    },
  ];

  const handleSearch = (text: string) => {
    setQuery(text);
    // You can replace this with API logic later
    if (text.length > 0) setSearchResults(mockNews);
    else setSearchResults([]);
  };

  return (
    <View style={styles.container}>
        
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

      {/* 🧭 Trending Topics */}
      {query.length === 0 && (
        <>
          <Text style={styles.sectionTitle}>Trending</Text>
          {trendingTopics.map((item) => (
            <TouchableOpacity key={item.id} style={styles.trendingItem}>
              <View>
                <Text style={styles.topic}>{item.topic}</Text>
                <Text style={styles.tweets}>{item.tweets} posts</Text>
              </View>
              <Ionicons name="ellipsis-horizontal" size={18} color="#999" />
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* 📜 Search Results */}
      {query.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultCard}>
              <Image source={{ uri: item.image }} style={styles.resultImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.resultTitle}>{item.title}</Text>
                <Text style={styles.resultSource}>{item.source}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
    marginTop: 26,
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
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
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

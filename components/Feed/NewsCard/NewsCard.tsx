import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function NewsCard({ post }: { post: any }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/40' }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.username}>
            {post.username} • {post.time}
          </Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.image && 
      <Link href={{
          pathname: '/post/[id]',
          params: { id: post.id },
        }} >
        <Image source={{ uri: post.image }} style={styles.image} />
      </Link>
      }

      <View style={styles.actions}>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="chatbubble-outline" size={20} color="#555" />
          <Text style={styles.count}>25</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="repeat-outline" size={20} color="#555" />
          <Text style={styles.count}>13</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="heart-outline" size={20} color="#555" />
          <Text style={styles.count}>100</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="share-outline" size={20} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 8,
  },
  info: {
    flex: 1,
  },
  author: {
    fontWeight: '600',
    fontSize: 14,
  },
  username: {
    color: '#666',
    fontSize: 12,
  },
  content: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    color: '#555',
    fontSize: 12,
  },
});

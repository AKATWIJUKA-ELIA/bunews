import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const notifications = [
  {
    id: '1',
    type: 'like',
    user: 'John Doe',
    message: 'liked your post',
    time: '2h',
    avatar: 'https://i.pravatar.cc/45?img=1',
  },
  {
    id: '2',
    type: 'comment',
    user: 'Jane Smith',
    message: 'commented on your post',
    time: '3h',
    avatar: 'https://i.pravatar.cc/45?img=2',
  },
  {
    id: '3',
    type: 'mention',
    user: 'TechDigest',
    message: 'mentioned you in a post',
    time: '6h',
    avatar: 'https://i.pravatar.cc/45?img=3',
  },
];

export default function NotificationsScreen() {

  const renderIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Ionicons name="heart" size={20} color="#ff4d4d" />;
      case 'comment':
        return <Ionicons name="chatbubble-outline" size={20} color="#1d9bf0" />;
      case 'mention':
        return <Ionicons name="at" size={20} color="#1d9bf0" />;
      default:
        return <Ionicons name="notifications-outline" size={20} color="#555" />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={{
          pathname: '/post/[id]',
          params: { id: item.id },
        }} asChild >
          <TouchableOpacity style={styles.notificationItem}>
            {renderIcon(item.type)}
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>
                <Text style={styles.user}>{item.user} </Text>
                {item.message}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        </Link>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 14,
    marginTop:3,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  user: {
    fontWeight: '600',
  },
  time: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function Header() {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/50' }}
        style={styles.avatar}
      />
      {/* <Text style={styles.title}>News Feed</Text> */}
      <Image
        source={require("../../../bunews/assets/images/icon.png")}
        style={styles.avatar}
      />
      <Link href={{
                pathname: '/settings',
      }} >
      <Ionicons name="settings-outline" size={24} color="#000"  />
      </Link>
      
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop:50,
    paddingLeft:5,
//     borderBottomWidth: 0.4,
//     borderColor: '#ddd',
    flex: 1,
        // backgroundColor: 'transparent',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});

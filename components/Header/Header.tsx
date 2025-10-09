import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Header() {
         const [user, setUser] = useState<any>(null);
           useEffect(() => {
  (async () => {
    const userString = await AsyncStorage.getItem("user");
    console.log("userString", userString);
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    }
  })();
}, []);
  return (
    <View style={styles.header}>
      <Link href="/timeline"  style={styles.avatar} >
      <Image
        source={{ uri: user?.profilePicture || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" }}
        style={styles.avatar}
      />
      </Link>
      {/* <Text style={styles.title}>News Feed</Text> */}
      <Image
        source={require("../../app/icon.png")}
        style={styles.avatar}
      />
      <Link href={{
                pathname: '/account',
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

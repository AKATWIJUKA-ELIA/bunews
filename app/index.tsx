import { Stack, Redirect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from '@/components/Loader/loader'

const Index = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setSignedIn(!!user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!signedIn) {
    return <Redirect href="/login" />;
  }
  return <Redirect href="/(tabs)/home" />;
};


export default Index;
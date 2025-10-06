
import { Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View ,Text, StyleSheet } from 'react-native'
import Loader from '@/components/Loader/loader'
import { Redirect } from 'expo-router'
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
        // Check if user is signed in
        const [signedIn, setSignedIn] = useState(false);
        useEffect(() => {
                const checkUser = async () => {
                        const user = await AsyncStorage.getItem('user');
                        if (user) {
                                setSignedIn(true);
                        }
                }
                checkUser();
        }, []);
        
        if (!signedIn) {
        return <Redirect href="/login" />
  }
  return <Redirect href="/(tabs)/home" />
   
}
const styles = StyleSheet.create({
        container: {
                // flex: 1,
                height:'100%',
                width:'100%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                backgroundColor:'white'
        }
 })

export default index
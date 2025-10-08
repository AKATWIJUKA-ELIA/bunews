import React from 'react'
import { Oval } from 'react-loader-spinner'
import { View, ActivityIndicator, Text } from 'react-native'

const loader = () => {
  return (
     <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#ffffffff'}}>
                            <View >
                                    <ActivityIndicator 
                                    size={50} 
                                    color="#0000ff"
                                     />
                                     <Text>Loading...</Text>
                            </View>
                                    </View>
  )
}

export default loader
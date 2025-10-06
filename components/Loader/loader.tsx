import React from 'react'
import { Oval } from 'react-loader-spinner'
import { View ,ActivityIndicator} from 'react-native'

const loader = () => {
  return (
     <View className="flex  opacity-95 w-[100%] h-[100%] items-center justify-center animate-pulse">
                            <View className="flex">
                                    <ActivityIndicator 
                                    size={50} 
                                    color="#0000ff"
                                     />
                            </View>
                                    </View>
  )
}

export default loader
import React from 'react'
import { Text } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import LinearGradient from 'react-native-linear-gradient'

export default function GradientText({ children }: { children: string }) {
  return (
    <MaskedView maskElement={
      <Text className="text-4xl font-bold text-black">
        {children}
      </Text>
    }>
      <LinearGradient
        colors={['#c084fc', '#5eead4']} // from-purple-400 to-teal-400
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="text-4xl font-bold opacity-0">
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  )
}

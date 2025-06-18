import React from 'react'
import { SafeAreaView, StatusBar, View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

type MainLayoutProps = {
  children: React.ReactNode
  canGoBack?: boolean
}

export default function MainLayout({ children, canGoBack }: MainLayoutProps) {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {canGoBack && (
        <View style={{ padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: 'white', fontSize: 16 }}>{'< Back'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {children}
    </SafeAreaView>
  )
}
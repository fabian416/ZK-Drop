import React from 'react'
import { SafeAreaView, StatusBar } from 'react-native'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      {children}
    </SafeAreaView>
  )
}
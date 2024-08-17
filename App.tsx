import React, { useEffect, useRef, useState } from 'react'
import { ColorSchemeName, StatusBar, useColorScheme } from 'react-native'

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native'
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
  PaperProvider
} from 'react-native-paper'
import merge from 'deepmerge'
import { useQuery } from './hooks/useQuery'
import useBoundStore from './store'
import AuthStacks from './navigators/stacks/AuthStacks'
import MainTabs from './navigators/tabs/MainTabs'
import BootSplash from 'react-native-bootsplash'

import NetworkLogger from 'react-native-network-logger'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './libs/axiosInstance'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme
})

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme)
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme)

function AppContent() {
  const colorScheme = useColorScheme()
  const authenticate = useBoundStore(state => state.authenticate)
  const isAuthenticated: boolean = useBoundStore(state => state.isAuthenticated)

  const isDarkTheme = colorScheme === 'dark'

  const theme = isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme

  const focusedRef = useRef<boolean>(true)

  useQuery({
    queryKey: ['users/2'],
    retry: 0,
    enabled: focusedRef.current,
    onSuccess: async () => {
      focusedRef.current = false
      authenticate()
      await BootSplash.hide({ fade: true })
    },
    onError: () => {
      focusedRef.current = false
    }
  })

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />

        <NavigationContainer theme={theme}>
          {isAuthenticated ? <MainTabs /> : <AuthStacks />}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      {/* <NetworkLogger /> */}
    </QueryClientProvider>
  )
}

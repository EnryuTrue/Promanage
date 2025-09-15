import { BundleInspector } from '../.rorkai/inspector';
import { RorkErrorBoundary } from '../.rorkai/rork-error-boundary';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuth } from "@/hooks/useAuth";
import { theme } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        color: theme.colors.text,
      },
    }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-payment" 
        options={{ 
          presentation: "modal",
          title: "Record Payment",
        }} 
      />
      <Stack.Screen 
        name="add-expense" 
        options={{ 
          presentation: "modal",
          title: "Add Expense",
        }} 
      />
      <Stack.Screen 
        name="add-property" 
        options={{ 
          presentation: "modal",
          title: "Add Property",
        }} 
      />
      <Stack.Screen 
        name="add-unit" 
        options={{ 
          presentation: "modal",
          title: "Add Unit",
        }} 
      />
      <Stack.Screen 
        name="add-tenant" 
        options={{ 
          presentation: "modal",
          title: "Add Tenant",
        }} 
      />
      <Stack.Screen 
        name="transactions" 
        options={{ 
          title: "All Transactions",
        }} 
      />
      <Stack.Screen 
        name="calendar" 
        options={{ 
          title: "Calendar",
        }} 
      />
      <Stack.Screen 
        name="tenant/[id]" 
        options={{ 
          title: "Tenant Details",
        }} 
      />
      <Stack.Screen 
        name="lease/[id]" 
        options={{ 
          title: "Lease Details",
        }} 
      />
      <Stack.Screen 
        name="mark-payment" 
        options={{ 
          presentation: "modal",
          title: "Mark Payment",
        }} 
      />
      <Stack.Screen 
        name="property/[id]" 
        options={{ 
          title: "Property Details",
        }} 
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <BundleInspector><RorkErrorBoundary><RootLayoutNav /></RorkErrorBoundary></BundleInspector>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
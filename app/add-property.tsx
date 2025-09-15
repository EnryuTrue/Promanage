import React, { useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProperties } from '@/hooks/useProperties';
import { theme } from '@/constants/theme';

export default function AddPropertyScreen() {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [currency, setCurrency] = useState('$');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addProperty } = useProperties();

  const handleSubmit = async () => {
    if (!title || !address || !city) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await addProperty({
        userId: 'temp-user-id', // TODO: Get actual user ID
        title,
        address,
        city,
        currency,
        notes,
      });
      
      Alert.alert('Success', 'Property added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch {
      Alert.alert('Error', 'Failed to add property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Property' }} />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.label}>Property Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter property name"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Street address"
            placeholderTextColor={theme.colors.textSecondary}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor={theme.colors.textSecondary}
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Currency</Text>
          <TextInput
            style={styles.input}
            placeholder="$, €, £, etc."
            placeholderTextColor={theme.colors.textSecondary}
            value={currency}
            onChangeText={setCurrency}
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes about the property"
            placeholderTextColor={theme.colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <Button
            title="Add Property"
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});
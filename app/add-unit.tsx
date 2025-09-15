import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProperties } from '@/hooks/useProperties';
import { theme } from '@/constants/theme';

export default function AddUnitScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const [unitNumber, setUnitNumber] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [size, setSize] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addUnit, properties } = useProperties();

  const property = properties.find(p => p.id === propertyId);

  const handleSubmit = async () => {
    if (!unitNumber || !bedrooms || !rentAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numBedrooms = parseInt(bedrooms);
    const numRentAmount = parseFloat(rentAmount);
    const numSize = size ? parseFloat(size) : undefined;

    if (isNaN(numBedrooms) || numBedrooms < 0) {
      Alert.alert('Error', 'Please enter a valid number of bedrooms');
      return;
    }

    if (isNaN(numRentAmount) || numRentAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid rent amount');
      return;
    }

    if (size && (isNaN(numSize!) || numSize! <= 0)) {
      Alert.alert('Error', 'Please enter a valid size');
      return;
    }

    setIsLoading(true);
    try {
      await addUnit({
        propertyId: propertyId!,
        unitNumber,
        bedrooms: numBedrooms,
        size: numSize,
        rentAmount: numRentAmount,
        active: true,
        notes,
      });
      
      Alert.alert('Success', 'Unit added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add unit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Add Unit - ${property?.title}` }} />
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Card>
          <Text style={styles.label}>Unit Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1A, 101, etc."
            placeholderTextColor={theme.colors.textSecondary}
            value={unitNumber}
            onChangeText={setUnitNumber}
          />

          <Text style={styles.label}>Bedrooms *</Text>
          <TextInput
            style={styles.input}
            placeholder="Number of bedrooms"
            placeholderTextColor={theme.colors.textSecondary}
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Size (sq ft)</Text>
          <TextInput
            style={styles.input}
            placeholder="Square footage"
            placeholderTextColor={theme.colors.textSecondary}
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Monthly Rent *</Text>
          <TextInput
            style={styles.input}
            placeholder="Rent amount"
            placeholderTextColor={theme.colors.textSecondary}
            value={rentAmount}
            onChangeText={setRentAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional notes about the unit"
            placeholderTextColor={theme.colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <Button
            title="Add Unit"
            onPress={handleSubmit}
            disabled={isLoading}
            style={styles.submitButton}
          />
        </Card>
      </KeyboardAvoidingView>
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
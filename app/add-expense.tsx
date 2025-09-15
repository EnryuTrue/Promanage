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
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addExpense } = usePayments();

  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert('Error', 'Please enter amount and category');
      return;
    }

    setIsLoading(true);
    try {
      await addExpense({
        propertyId: 'temp-property-id', // TODO: Get actual property ID
        amount: parseFloat(amount),
        category,
        vendor,
        note,
        date: new Date(),
      });
      
      Alert.alert('Success', 'Expense recorded successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to record expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Add Expense' }} />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor={theme.colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Category *</Text>
          <TextInput
            style={styles.input}
            placeholder="Maintenance, Utilities, etc."
            placeholderTextColor={theme.colors.textSecondary}
            value={category}
            onChangeText={setCategory}
          />

          <Text style={styles.label}>Vendor</Text>
          <TextInput
            style={styles.input}
            placeholder="Company or person paid"
            placeholderTextColor={theme.colors.textSecondary}
            value={vendor}
            onChangeText={setVendor}
          />

          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Optional note"
            placeholderTextColor={theme.colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />

          <Button
            title="Add Expense"
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
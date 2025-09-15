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

export default function AddPaymentScreen() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addPayment } = usePayments();

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    setIsLoading(true);
    try {
      await addPayment({
        leaseId: 'temp-lease-id', // TODO: Get actual lease ID
        amount: parseFloat(amount),
        method: method || 'Cash',
        note,
        date: new Date(),
      });
      
      Alert.alert('Success', 'Payment recorded successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to record payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Record Payment' }} />
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

          <Text style={styles.label}>Payment Method</Text>
          <TextInput
            style={styles.input}
            placeholder="Cash, Bank Transfer, etc."
            placeholderTextColor={theme.colors.textSecondary}
            value={method}
            onChangeText={setMethod}
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
            title="Record Payment"
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
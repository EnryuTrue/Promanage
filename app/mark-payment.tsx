import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function MarkPaymentScreen() {
  const { leaseId } = useLocalSearchParams<{ leaseId: string }>();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { leases, units, properties, getTenantById } = useProperties();
  const { addPayment } = usePayments();

  const lease = leases.find(l => l.id === leaseId);
  const unit = lease ? units.find(u => u.id === lease.unitId) : null;
  const property = unit ? properties.find(p => p.id === unit.propertyId) : null;
  const tenant = lease ? getTenantById(lease.tenantId) : null;

  const handleSubmit = async () => {
    if (!amount || !method) {
      Alert.alert('Error', 'Please fill in amount and payment method');
      return;
    }

    if (!lease) {
      Alert.alert('Error', 'Lease not found');
      return;
    }

    setIsLoading(true);
    try {
      await addPayment({
        leaseId: lease.id,
        amount: parseFloat(amount),
        date: new Date(),
        method,
        note,
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

  if (!lease || !unit || !property || !tenant) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Payment Not Found' }} />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Lease information not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Mark Payment - ${tenant.name}` }} />
      <ScrollView style={styles.content}>
        <Card style={styles.leaseInfo}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Property:</Text>
            <Text style={styles.infoValue}>{property.title}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Unit:</Text>
            <Text style={styles.infoValue}>{unit.unitNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tenant:</Text>
            <Text style={styles.infoValue}>{tenant.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Rent:</Text>
            <Text style={styles.infoValue}>{property.currency}{lease.rentAmount}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Record Payment</Text>
          
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter amount (${property.currency}${lease.rentAmount})`}
            placeholderTextColor={theme.colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Payment Method *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Bank Transfer, Cash, Check"
            placeholderTextColor={theme.colors.textSecondary}
            value={method}
            onChangeText={setMethod}
          />

          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  leaseInfo: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
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
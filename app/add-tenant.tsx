import React, { useState } from 'react';
import {
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
import { theme } from '@/constants/theme';

export default function AddTenantScreen() {
  const { unitId, propertyId } = useLocalSearchParams<{ unitId: string; propertyId: string }>();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [rentDueDay, setRentDueDay] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const { addTenant, addLease, units } = useProperties();

  const unit = units.find(u => u.id === unitId);

  const handleSubmit = async () => {
    if (!name || !phone || !email || !startDate || !endDate || !rentAmount || !depositAmount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Add tenant first
      const tenant = await addTenant({
        userId: '1', // TODO: Get actual user ID
        name,
        phone,
        email,
      });

      // Then create lease
      await addLease({
        unitId: unitId!,
        tenantId: tenant.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount: parseFloat(rentAmount),
        depositAmount: parseFloat(depositAmount),
        rentDueDay: parseInt(rentDueDay),
        active: true,
      });
      
      Alert.alert('Success', 'Tenant and lease added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add tenant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Add Tenant - Unit ${unit?.unitNumber}` }} />
      <ScrollView style={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Tenant Information</Text>
          
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tenant's full name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor={theme.colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Lease Information</Text>
          
          <Text style={styles.label}>Start Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
            value={startDate}
            onChangeText={setStartDate}
          />

          <Text style={styles.label}>End Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
            value={endDate}
            onChangeText={setEndDate}
          />

          <Text style={styles.label}>Monthly Rent *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter monthly rent amount"
            placeholderTextColor={theme.colors.textSecondary}
            value={rentAmount}
            onChangeText={setRentAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Security Deposit *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter deposit amount"
            placeholderTextColor={theme.colors.textSecondary}
            value={depositAmount}
            onChangeText={setDepositAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Rent Due Day *</Text>
          <TextInput
            style={styles.input}
            placeholder="Day of month (1-31)"
            placeholderTextColor={theme.colors.textSecondary}
            value={rentDueDay}
            onChangeText={setRentDueDay}
            keyboardType="numeric"
          />

          <Button
            title="Add Tenant & Lease"
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});
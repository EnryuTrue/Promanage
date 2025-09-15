import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function TransactionsScreen() {
  const { payments, expenses } = usePayments();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const allTransactions = [
    ...payments.map(payment => ({
      ...payment,
      type: 'income' as const,
      title: 'Rent Payment',
      description: `Payment received`,
    })),
    ...expenses.map(expense => ({
      ...expense,
      type: 'expense' as const,
      title: expense.category,
      description: expense.vendor || 'Expense',
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredTransactions = allTransactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'All Transactions' }} />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter color={theme.colors.text} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterChip,
                filter === option.key && styles.activeFilterChip,
              ]}
              onPress={() => setFilter(option.key as any)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === option.key && styles.activeFilterChipText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTransactions.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Transactions</Text>
              <Text style={styles.emptySubtitle}>
                No transactions found for the selected filter
              </Text>
              <View style={styles.emptyActions}>
                <Button
                  title="Add Payment"
                  onPress={() => router.push('/add-payment')}
                  size="small"
                  style={styles.emptyButton}
                />
                <Button
                  title="Add Expense"
                  onPress={() => router.push('/add-expense')}
                  variant="outline"
                  size="small"
                  style={styles.emptyButton}
                />
              </View>
            </View>
          </Card>
        ) : (
          <Card>
            {filteredTransactions.map((transaction, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={[
                  styles.transactionIcon,
                  {
                    backgroundColor: transaction.type === 'income' 
                      ? theme.colors.success + '20' 
                      : theme.colors.error + '20'
                  }
                ]}>
                  {transaction.type === 'income' ? (
                    <TrendingUp color={theme.colors.success} size={16} />
                  ) : (
                    <TrendingDown color={theme.colors.error} size={16} />
                  )}
                </View>
                
                <View style={styles.transactionContent}>
                  <Text style={styles.transactionTitle}>{transaction.title}</Text>
                  <Text style={styles.transactionDescription}>
                    {transaction.description}
                  </Text>
                </View>
                
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionValue,
                    {
                      color: transaction.type === 'income' 
                        ? theme.colors.success 
                        : theme.colors.error
                    }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.quickActions}>
          <Button
            title="Record Payment"
            onPress={() => router.push('/add-payment')}
            style={styles.actionButton}
          />
          <Button
            title="Add Expense"
            onPress={() => router.push('/add-expense')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  filterButton: {
    padding: theme.spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  emptyButton: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  transactionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});
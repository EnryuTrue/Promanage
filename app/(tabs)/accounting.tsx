import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function AccountingScreen() {
  const { payments, expenses } = usePayments();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const totalIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalIncome - totalExpenses;

  const recentTransactions = [
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
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const periods = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Accounting</Text>
          <TouchableOpacity style={styles.exportButton}>
            <Download color={theme.colors.text} size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.activePeriodButtonText,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingUp color={theme.colors.success} size={24} />
            </View>
            <Text style={styles.summaryValue}>${totalIncome.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Income</Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <TrendingDown color={theme.colors.error} size={24} />
            </View>
            <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
          </Card>
        </View>

        <Card>
          <View style={styles.netIncomeHeader}>
            <Text style={styles.netIncomeLabel}>Net Income</Text>
            <Text style={[
              styles.netIncomeValue,
              { color: netIncome >= 0 ? theme.colors.success : theme.colors.error }
            ]}>
              ${netIncome.toFixed(2)}
            </Text>
          </View>
          <Text style={styles.netIncomeSubtitle}>
            {netIncome >= 0 ? 'Profit' : 'Loss'} this {selectedPeriod}
          </Text>
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => console.log('View all transactions')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <DollarSign color={theme.colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Transactions Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Start recording payments and expenses to see your financial overview
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
              {recentTransactions.map((transaction, index) => (
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
        </View>

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
  exportButton: {
    padding: theme.spacing.sm,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 4,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  activePeriodButton: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  activePeriodButtonText: {
    color: theme.colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    marginBottom: theme.spacing.sm,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  netIncomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  netIncomeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  netIncomeValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  netIncomeSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
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
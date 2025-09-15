import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Home, DollarSign, AlertCircle, TrendingUp, Calendar } from 'lucide-react-native';
import { StatCard } from '@/components/StatCard';
import { Card } from '@/components/Card';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

export default function DashboardScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const { properties, units, leases } = useProperties();
  const { payments, expenses } = usePayments();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const totalEarning = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netCashFlow = totalEarning - totalExpenses;
  const activeLeases = leases.filter(lease => lease.active);
  const overdueCount = 3;

  const stats = [
    {
      id: 'earning',
      title: 'Total Earning',
      value: `$${totalEarning.toFixed(1)}`,
      subtitle: '+12% from last month',
      trend: 'up' as const,
    },
    {
      id: 'pending',
      title: 'Pending Request',
      value: overdueCount,
      subtitle: 'Need attention',
      trend: 'neutral' as const,
    },
    {
      id: 'properties',
      title: 'Properties',
      value: properties.length,
      subtitle: `${units.length} units total`,
      trend: 'neutral' as const,
    },
    {
      id: 'leases',
      title: 'Active Leases',
      value: activeLeases.length,
      subtitle: 'Currently rented',
      trend: 'up' as const,
    },
  ];

  const quickActions = [
    {
      id: 'property',
      title: 'Add Property',
      icon: Home,
      onPress: () => router.push('/properties'),
    },
    {
      id: 'payment',
      title: 'Record Payment',
      icon: DollarSign,
      onPress: () => router.push('/accounting'),
    },
    {
      id: 'expense',
      title: 'Add Expense',
      icon: TrendingUp,
      onPress: () => router.push('/accounting'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Here&apos;s your property overview</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/calendar')}
            >
              <Calendar color={theme.colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <AlertCircle color={theme.colors.text} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
            />
          ))}
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>89%</Text>
              <Text style={styles.quickStatLabel}>Rent Collection</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>46%</Text>
              <Text style={styles.quickStatLabel}>Occupancy Rate</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <action.icon color={theme.colors.primary} size={24} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Card>
          <View style={styles.recentHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/transactions')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <DollarSign color={theme.colors.success} size={16} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Rent Payment Received</Text>
              <Text style={styles.activitySubtitle}>Unit 3, 123 Main St • $1,200</Text>
            </View>
            <Text style={styles.activityTime}>2h ago</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <AlertCircle color={theme.colors.warning} size={16} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Rent Due Reminder</Text>
              <Text style={styles.activitySubtitle}>Unit 5, 456 Oak Ave • Due in 3 days</Text>
            </View>
            <Text style={styles.activityTime}>1d ago</Text>
          </View>
        </Card>
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/add-payment')}
      >
        <Plus color={theme.colors.text} size={24} />
      </TouchableOpacity>
    </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    padding: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  quickStatLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  actionTitle: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewAll: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  activitySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
});
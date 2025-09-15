import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Calendar, DollarSign, MapPin, User, FileText, Edit, Phone, Mail } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function LeaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { leases, units, properties, getTenantById } = useProperties();
  const { payments } = usePayments();
  
  const lease = leases.find(l => l.id === id);
  const unit = lease ? units.find(u => u.id === lease.unitId) : null;
  const property = unit ? properties.find(p => p.id === unit.propertyId) : null;
  const tenant = lease ? getTenantById(lease.tenantId) : null;
  
  const leasePayments = payments.filter(p => p.leaseId === id)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  if (!lease || !unit || !property || !tenant) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Lease Not Found' }} />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Lease information not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(lease.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalPaid = leasePayments.reduce((sum, payment) => sum + payment.amount, 0);
  const daysRemaining = getDaysRemaining();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `Lease - ${tenant.name}`,
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Edit color={theme.colors.text} size={20} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        {/* Lease Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusBadge,
              lease.active ? styles.activeBadge : styles.inactiveBadge
            ]}>
              <Text style={[
                styles.statusText,
                lease.active ? styles.activeText : styles.inactiveText
              ]}>
                {lease.active ? 'Active Lease' : 'Ended Lease'}
              </Text>
            </View>
            
            {lease.active && (
              <Text style={styles.daysRemaining}>
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Lease expired'}
              </Text>
            )}
          </View>
          
          <Text style={styles.leaseTitle}>
            {property.title} - Unit {unit.unitNumber}
          </Text>
          <Text style={styles.tenantName}>{tenant.name}</Text>
        </Card>

        {/* Property & Unit Info */}
        <Card>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          <View style={styles.infoRow}>
            <MapPin color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Property</Text>
              <Text style={styles.infoValue}>{property.title}</Text>
              <Text style={styles.infoSubvalue}>{property.address}, {property.city}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.unitIcon}>#{unit.unitNumber}</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Unit Details</Text>
              <Text style={styles.infoValue}>Unit {unit.unitNumber}</Text>
              <Text style={styles.infoSubvalue}>
                {unit.bedrooms} bed • {unit.size} sq ft
              </Text>
            </View>
          </View>
        </Card>

        {/* Tenant Information */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tenant Information</Text>
            <TouchableOpacity 
              onPress={() => router.push(`/tenant/${tenant.id}`)}
            >
              <Text style={styles.viewDetails}>View Profile</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoRow}>
            <User color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{tenant.name}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Phone color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{tenant.phone}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Mail color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{tenant.email}</Text>
            </View>
          </View>
        </Card>

        {/* Lease Terms */}
        <Card>
          <Text style={styles.sectionTitle}>Lease Terms</Text>
          
          <View style={styles.infoRow}>
            <Calendar color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Lease Period</Text>
              <Text style={styles.infoValue}>
                {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <DollarSign color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Monthly Rent</Text>
              <Text style={styles.infoValue}>{property.currency}{lease.rentAmount}</Text>
              <Text style={styles.infoSubvalue}>Due on {lease.rentDueDay}th of each month</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <DollarSign color={theme.colors.textSecondary} size={20} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Security Deposit</Text>
              <Text style={styles.infoValue}>{property.currency}{lease.depositAmount}</Text>
            </View>
          </View>
          
          {lease.leaseDocUrl && (
            <View style={styles.infoRow}>
              <FileText color={theme.colors.textSecondary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Lease Document</Text>
                <TouchableOpacity>
                  <Text style={styles.documentLink}>View Document</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>

        {/* Payment Summary */}
        <Card>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{property.currency}{totalPaid.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Total Paid</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{leasePayments.length}</Text>
              <Text style={styles.summaryLabel}>Payments Made</Text>
            </View>
          </View>
          
          {lease.active && (
            <Button
              title="Record Payment"
              onPress={() => router.push(`/mark-payment?leaseId=${lease.id}`)}
              style={styles.actionButton}
            />
          )}
        </Card>

        {/* Recent Payments */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payments</Text>
            {leasePayments.length > 3 && (
              <TouchableOpacity onPress={() => router.push('/transactions')}>
                <Text style={styles.viewDetails}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {leasePayments.length === 0 ? (
            <View style={styles.emptyState}>
              <DollarSign color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Payments Yet</Text>
              <Text style={styles.emptySubtitle}>
                Payment history will appear here once recorded
              </Text>
            </View>
          ) : (
            leasePayments.slice(0, 3).map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentIcon}>
                  <DollarSign color={theme.colors.success} size={16} />
                </View>
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentAmount}>
                    {property.currency}{payment.amount}
                  </Text>
                  <Text style={styles.paymentDate}>
                    {formatDate(payment.date)} • {payment.method}
                  </Text>
                  {payment.note && (
                    <Text style={styles.paymentNote}>{payment.note}</Text>
                  )}
                </View>
              </View>
            ))
          )}
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
  statusCard: {
    marginBottom: theme.spacing.md,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
  },
  activeBadge: {
    backgroundColor: theme.colors.success + '20',
  },
  inactiveBadge: {
    backgroundColor: theme.colors.textSecondary + '20',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeText: {
    color: theme.colors.success,
  },
  inactiveText: {
    color: theme.colors.textSecondary,
  },
  daysRemaining: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  leaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  tenantName: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewDetails: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoSubvalue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  documentLink: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
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
    lineHeight: 20,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  paymentContent: {
    flex: 1,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  paymentDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  paymentNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
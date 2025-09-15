import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Phone, Mail, MapPin, Calendar, DollarSign, FileText, Edit } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

export default function TenantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tenants, leases, units, properties } = useProperties();
  const { payments } = usePayments();
  
  const tenant = tenants.find(t => t.id === id);
  const tenantLeases = leases.filter(l => l.tenantId === id);
  const activeLease = tenantLeases.find(l => l.active);
  
  const unit = activeLease ? units.find(u => u.id === activeLease.unitId) : null;
  const property = unit ? properties.find(p => p.id === unit.propertyId) : null;
  
  const tenantPayments = payments.filter(p => 
    tenantLeases.some(l => l.id === p.leaseId)
  ).sort((a, b) => b.date.getTime() - a.date.getTime());

  if (!tenant) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Tenant Not Found' }} />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Tenant not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${tenant.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${tenant.email}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalPaid = tenantPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: tenant.name,
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Edit color={theme.colors.text} size={20} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        {/* Tenant Info */}
        <Card style={styles.tenantHeader}>
          <View style={styles.tenantIcon}>
            <Text style={styles.tenantInitials}>
              {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.tenantName}>{tenant.name}</Text>
          
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Phone color={theme.colors.primary} size={20} />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
              <Mail color={theme.colors.primary} size={20} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Contact Information */}
        <Card>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
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

        {/* Current Lease */}
        {activeLease && unit && property && (
          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Lease</Text>
              <TouchableOpacity 
                onPress={() => router.push(`/lease/${activeLease.id}`)}
              >
                <Text style={styles.viewDetails}>View Details</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin color={theme.colors.textSecondary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Property</Text>
                <Text style={styles.infoValue}>{property.title}</Text>
                <Text style={styles.infoSubvalue}>Unit {unit.unitNumber}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <DollarSign color={theme.colors.textSecondary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Monthly Rent</Text>
                <Text style={styles.infoValue}>{property.currency}{activeLease.rentAmount}</Text>
                <Text style={styles.infoSubvalue}>Due on {activeLease.rentDueDay}th of each month</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar color={theme.colors.textSecondary} size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Lease Period</Text>
                <Text style={styles.infoValue}>
                  {formatDate(activeLease.startDate)} - {formatDate(activeLease.endDate)}
                </Text>
              </View>
            </View>

            <Button
              title="Record Payment"
              onPress={() => router.push(`/mark-payment?leaseId=${activeLease.id}`)}
              style={styles.actionButton}
            />
          </Card>
        )}

        {/* Payment History */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <Text style={styles.totalPaid}>
              Total: {property?.currency || '$'}{totalPaid.toFixed(2)}
            </Text>
          </View>
          
          {tenantPayments.length === 0 ? (
            <View style={styles.emptyState}>
              <DollarSign color={theme.colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Payments Yet</Text>
              <Text style={styles.emptySubtitle}>
                Payment history will appear here once recorded
              </Text>
            </View>
          ) : (
            tenantPayments.slice(0, 5).map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentIcon}>
                  <DollarSign color={theme.colors.success} size={16} />
                </View>
                <View style={styles.paymentContent}>
                  <Text style={styles.paymentAmount}>
                    {property?.currency || '$'}{payment.amount}
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
          
          {tenantPayments.length > 5 && (
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/transactions')}
            >
              <Text style={styles.viewAllText}>View All Payments</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Lease History */}
        {tenantLeases.length > 1 && (
          <Card>
            <Text style={styles.sectionTitle}>Lease History</Text>
            
            {tenantLeases.map((lease) => {
              const leaseUnit = units.find(u => u.id === lease.unitId);
              const leaseProperty = leaseUnit ? properties.find(p => p.id === leaseUnit.propertyId) : null;
              
              return (
                <TouchableOpacity 
                  key={lease.id}
                  style={styles.leaseItem}
                  onPress={() => router.push(`/lease/${lease.id}`)}
                >
                  <View style={styles.leaseContent}>
                    <Text style={styles.leaseProperty}>
                      {leaseProperty?.title} - Unit {leaseUnit?.unitNumber}
                    </Text>
                    <Text style={styles.leasePeriod}>
                      {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                    </Text>
                    <Text style={styles.leaseRent}>
                      {leaseProperty?.currency}{lease.rentAmount}/month
                    </Text>
                  </View>
                  <View style={[
                    styles.leaseStatus,
                    lease.active ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    <Text style={[
                      styles.leaseStatusText,
                      lease.active ? styles.activeStatusText : styles.inactiveStatusText
                    ]}>
                      {lease.active ? 'Active' : 'Ended'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Card>
        )}
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
  tenantHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  tenantIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  tenantInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  tenantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
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
  totalPaid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.success,
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
  actionButton: {
    marginTop: theme.spacing.md,
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
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  leaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  leaseContent: {
    flex: 1,
  },
  leaseProperty: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  leasePeriod: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  leaseRent: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  leaseStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  activeStatus: {
    backgroundColor: theme.colors.success + '20',
  },
  inactiveStatus: {
    backgroundColor: theme.colors.textSecondary + '20',
  },
  leaseStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeStatusText: {
    color: theme.colors.success,
  },
  inactiveStatusText: {
    color: theme.colors.textSecondary,
  },
});
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
import { Home, MapPin, Users, Plus } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useProperties } from '@/hooks/useProperties';
import { theme } from '@/constants/theme';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, getUnitsForProperty, getActiveLeaseForUnit } = useProperties();
  
  const property = properties.find(p => p.id === id);
  const units = property ? getUnitsForProperty(property.id) : [];

  if (!property) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Property Not Found' }} />
        <View style={styles.errorState}>
          <Text style={styles.errorText}>Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: property.title }} />
      <ScrollView style={styles.content}>
        <Card style={styles.propertyHeader}>
          <View style={styles.propertyIcon}>
            <Home color={theme.colors.primary} size={32} />
          </View>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <View style={styles.addressRow}>
            <MapPin color={theme.colors.textSecondary} size={16} />
            <Text style={styles.propertyAddress}>
              {property.address}, {property.city}
            </Text>
          </View>
          {property.notes && (
            <Text style={styles.propertyNotes}>{property.notes}</Text>
          )}
        </Card>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Units ({units.length})</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`/add-unit?propertyId=${property.id}`)}
            >
              <Plus color={theme.colors.text} size={20} />
            </TouchableOpacity>
          </View>

          {units.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <Users color={theme.colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Units Yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add units to start managing tenants and rent
                </Text>
                <Button
                  title="Add First Unit"
                  onPress={() => router.push(`/add-unit?propertyId=${property.id}`)}
                  size="small"
                  style={styles.emptyButton}
                />
              </View>
            </Card>
          ) : (
            units.map((unit) => {
              const lease = getActiveLeaseForUnit(unit.id);
              return (
                <Card key={unit.id} style={styles.unitCard}>
                  <View style={styles.unitHeader}>
                    <Text style={styles.unitNumber}>Unit {unit.unitNumber}</Text>
                    <Text style={styles.unitRent}>
                      {property.currency}{unit.rentAmount}
                    </Text>
                  </View>
                  
                  <View style={styles.unitDetails}>
                    <Text style={styles.unitInfo}>
                      {unit.bedrooms} bed • {unit.size} sq ft
                    </Text>
                    {lease ? (
                      <Text style={styles.tenantInfo}>
                        Occupied • Rent due: {lease.rentDueDay}th
                      </Text>
                    ) : (
                      <Text style={styles.vacantInfo}>Vacant</Text>
                    )}
                  </View>

                  {unit.notes && (
                    <Text style={styles.unitNotes}>{unit.notes}</Text>
                  )}

                  <View style={styles.unitActions}>
                    {lease ? (
                      <>
                        <Button
                          title="Record Payment"
                          onPress={() => router.push(`/mark-payment?leaseId=${lease.id}`)}
                          size="small"
                          style={styles.actionButton}
                        />
                        <Button
                          title="View Tenant"
                          onPress={() => router.push(`/tenant/${lease.tenantId}`)}
                          variant="outline"
                          size="small"
                          style={styles.actionButton}
                        />
                      </>
                    ) : (
                      <Button
                        title="Add Tenant"
                        onPress={() => router.push(`/add-tenant?propertyId=${property.id}&unitId=${unit.id}`)}
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                  </View>
                </Card>
              );
            })
          )}
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  propertyHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  propertyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  propertyAddress: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  propertyNotes: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
  emptyButton: {
    alignSelf: 'stretch',
  },
  unitCard: {
    marginBottom: theme.spacing.md,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  unitNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  unitRent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  unitDetails: {
    marginBottom: theme.spacing.sm,
  },
  unitInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  tenantInfo: {
    fontSize: 14,
    color: theme.colors.success,
  },
  vacantInfo: {
    fontSize: 14,
    color: theme.colors.error,
  },
  unitNotes: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontStyle: 'italic',
  },
  unitActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
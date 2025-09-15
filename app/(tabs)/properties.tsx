import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Home, MapPin, Users, Plus } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useProperties } from '@/hooks/useProperties';
import { theme } from '@/constants/theme';

export default function PropertiesScreen() {
  const { properties, getUnitsForProperty, getActiveLeaseForUnit } = useProperties();

  const getPropertyStats = (propertyId: string) => {
    const units = getUnitsForProperty(propertyId);
    const occupiedUnits = units.filter(unit => getActiveLeaseForUnit(unit.id));
    return {
      totalUnits: units.length,
      occupiedUnits: occupiedUnits.length,
      totalRent: units.reduce((sum, unit) => sum + unit.rentAmount, 0),
    };
  };

  if (properties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Home color={theme.colors.textSecondary} size={64} />
          <Text style={styles.emptyTitle}>No Properties Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first property to start managing your rental business
          </Text>
          <Button
            title="Add Property"
            onPress={() => router.push('/add-property')}
            style={styles.addButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Properties</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-property')}
          >
            <Plus color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {properties.map((property) => {
          const stats = getPropertyStats(property.id);
          return (
            <TouchableOpacity
              key={property.id}
              onPress={() => router.push(`/property/${property.id}`)}
            >
              <Card style={styles.propertyCard}>
                <View style={styles.propertyHeader}>
                  <View style={styles.propertyIcon}>
                    <Home color={theme.colors.primary} size={24} />
                  </View>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyTitle}>{property.title}</Text>
                    <View style={styles.addressRow}>
                      <MapPin color={theme.colors.textSecondary} size={16} />
                      <Text style={styles.propertyAddress}>
                        {property.address}, {property.city}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{stats.totalUnits}</Text>
                    <Text style={styles.statLabel}>Units</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>{stats.occupiedUnits}</Text>
                    <Text style={styles.statLabel}>Occupied</Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statValue}>
                      {property.currency}{stats.totalRent}
                    </Text>
                    <Text style={styles.statLabel}>Total Rent</Text>
                  </View>
                </View>

                <View style={styles.occupancyBar}>
                  <View
                    style={[
                      styles.occupancyFill,
                      {
                        width: `${(stats.occupiedUnits / stats.totalUnits) * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.occupancyText}>
                  {Math.round((stats.occupiedUnits / stats.totalUnits) * 100)}% Occupied
                </Text>
              </Card>
            </TouchableOpacity>
          );
        })}
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  propertyCard: {
    marginBottom: theme.spacing.md,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  propertyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyAddress: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  occupancyBar: {
    height: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: 2,
    marginBottom: theme.spacing.sm,
  },
  occupancyFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  occupancyText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property, Unit, Tenant, Lease } from '@/types';

const PROPERTIES_KEY = 'landlord_properties';
const UNITS_KEY = 'landlord_units';
const TENANTS_KEY = 'landlord_tenants';
const LEASES_KEY = 'landlord_leases';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesData, unitsData, tenantsData, leasesData] = await Promise.all([
        AsyncStorage.getItem(PROPERTIES_KEY),
        AsyncStorage.getItem(UNITS_KEY),
        AsyncStorage.getItem(TENANTS_KEY),
        AsyncStorage.getItem(LEASES_KEY),
      ]);

      const parsedProperties = propertiesData ? JSON.parse(propertiesData) : [];
      const parsedUnits = unitsData ? JSON.parse(unitsData) : [];
      const parsedTenants = tenantsData ? JSON.parse(tenantsData) : [];
      const parsedLeases = leasesData ? JSON.parse(leasesData) : [];

      // Add sample data if no data exists
      if (parsedProperties.length === 0) {
        const sampleProperties = [
          {
            id: 'prop-1',
            userId: '1',
            title: 'Sunset Apartments',
            address: '123 Main Street',
            city: 'New York',
            currency: '$',
            notes: 'Modern apartment complex with great amenities',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'prop-2',
            userId: '1',
            title: 'Downtown Lofts',
            address: '456 Oak Avenue',
            city: 'San Francisco',
            currency: '$',
            notes: 'Trendy lofts in the heart of downtown',
            createdAt: new Date('2024-02-01'),
          },
        ];
        
        const sampleUnits = [
          {
            id: 'unit-1',
            propertyId: 'prop-1',
            unitNumber: '101',
            bedrooms: 2,
            size: 850,
            rentAmount: 1200,
            active: true,
            notes: 'Corner unit with great views',
          },
          {
            id: 'unit-2',
            propertyId: 'prop-1',
            unitNumber: '102',
            bedrooms: 1,
            size: 650,
            rentAmount: 900,
            active: true,
          },
          {
            id: 'unit-3',
            propertyId: 'prop-2',
            unitNumber: 'A',
            bedrooms: 3,
            size: 1200,
            rentAmount: 2500,
            active: true,
            notes: 'Spacious loft with exposed brick',
          },
        ];
        
        const sampleTenants = [
          {
            id: 'tenant-1',
            userId: '1',
            name: 'John Smith',
            phone: '+1-555-0123',
            email: 'john.smith@email.com',
          },
          {
            id: 'tenant-2',
            userId: '1',
            name: 'Sarah Johnson',
            phone: '+1-555-0456',
            email: 'sarah.johnson@email.com',
          },
        ];
        
        const sampleLeases = [
          {
            id: 'lease-1',
            unitId: 'unit-1',
            tenantId: 'tenant-1',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
            rentAmount: 1200,
            depositAmount: 1200,
            rentDueDay: 1,
            active: true,
          },
          {
            id: 'lease-2',
            unitId: 'unit-3',
            tenantId: 'tenant-2',
            startDate: new Date('2024-02-01'),
            endDate: new Date('2025-01-31'),
            rentAmount: 2500,
            depositAmount: 2500,
            rentDueDay: 5,
            active: true,
          },
        ];
        
        await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(sampleProperties));
        await AsyncStorage.setItem(UNITS_KEY, JSON.stringify(sampleUnits));
        await AsyncStorage.setItem(TENANTS_KEY, JSON.stringify(sampleTenants));
        await AsyncStorage.setItem(LEASES_KEY, JSON.stringify(sampleLeases));
        
        setProperties(sampleProperties);
        setUnits(sampleUnits);
        setTenants(sampleTenants);
        setLeases(sampleLeases);
      } else {
        setProperties(parsedProperties);
        setUnits(parsedUnits);
        setTenants(parsedTenants);
        setLeases(parsedLeases);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    const updatedProperties = [...properties, newProperty];
    setProperties(updatedProperties);
    await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(updatedProperties));
    return newProperty;
  };

  const addUnit = async (unit: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
    };

    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    await AsyncStorage.setItem(UNITS_KEY, JSON.stringify(updatedUnits));
    return newUnit;
  };

  const addTenant = async (tenant: Omit<Tenant, 'id'>) => {
    const newTenant: Tenant = {
      ...tenant,
      id: Date.now().toString(),
    };

    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    await AsyncStorage.setItem(TENANTS_KEY, JSON.stringify(updatedTenants));
    return newTenant;
  };

  const addLease = async (lease: Omit<Lease, 'id'>) => {
    const newLease: Lease = {
      ...lease,
      id: Date.now().toString(),
    };

    const updatedLeases = [...leases, newLease];
    setLeases(updatedLeases);
    await AsyncStorage.setItem(LEASES_KEY, JSON.stringify(updatedLeases));
    return newLease;
  };

  const getUnitsForProperty = (propertyId: string) => {
    return units.filter(unit => unit.propertyId === propertyId);
  };

  const getActiveLeaseForUnit = (unitId: string) => {
    return leases.find(lease => lease.unitId === unitId && lease.active);
  };

  const getTenantById = (tenantId: string) => {
    return tenants.find(tenant => tenant.id === tenantId);
  };

  return {
    properties,
    units,
    tenants,
    leases,
    isLoading,
    addProperty,
    addUnit,
    addTenant,
    addLease,
    getUnitsForProperty,
    getActiveLeaseForUnit,
    getTenantById,
  };
}
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  currency: string;
  createdAt: Date;
}

export interface Property {
  id: string;
  userId: string;
  title: string;
  address: string;
  city: string;
  currency: string;
  notes?: string;
  createdAt: Date;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  bedrooms: number;
  size?: number;
  rentAmount: number;
  active: boolean;
  notes?: string;
}

export interface Tenant {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  idDocUrl?: string;
}

export interface Lease {
  id: string;
  unitId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  rentAmount: number;
  depositAmount: number;
  rentDueDay: number;
  leaseDocUrl?: string;
  active: boolean;
}

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  date: Date;
  method: string;
  note?: string;
  receiptUrl?: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  unitId?: string;
  amount: number;
  category: string;
  date: Date;
  vendor?: string;
  receiptUrl?: string;
  note?: string;
}

export interface DashboardStats {
  totalEarning: number;
  pendingRequests: number;
  rentRequestRate: number;
  complaintRate: number;
  rentDueThisMonth: number;
  overdueCount: number;
  netCashFlow: number;
}
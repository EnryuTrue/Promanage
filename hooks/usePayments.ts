import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Payment, Expense } from '@/types';

const PAYMENTS_KEY = 'landlord_payments';
const EXPENSES_KEY = 'landlord_expenses';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, expensesData] = await Promise.all([
        AsyncStorage.getItem(PAYMENTS_KEY),
        AsyncStorage.getItem(EXPENSES_KEY),
      ]);

      const parsedPayments = paymentsData ? JSON.parse(paymentsData) : [];
      const parsedExpenses = expensesData ? JSON.parse(expensesData) : [];
      
      // Add sample data if no data exists
      if (parsedPayments.length === 0) {
        const samplePayments = [
          {
            id: 'payment-1',
            leaseId: 'lease-1',
            amount: 1200,
            date: new Date('2024-09-01'),
            method: 'Bank Transfer',
            note: 'September rent payment',
          },
          {
            id: 'payment-2',
            leaseId: 'lease-2',
            amount: 2500,
            date: new Date('2024-09-05'),
            method: 'Online Payment',
            note: 'September rent payment',
          },
          {
            id: 'payment-3',
            leaseId: 'lease-1',
            amount: 1200,
            date: new Date('2024-08-01'),
            method: 'Bank Transfer',
            note: 'August rent payment',
          },
        ];
        
        const sampleExpenses = [
          {
            id: 'expense-1',
            propertyId: 'prop-1',
            unitId: 'unit-1',
            amount: 150,
            category: 'Maintenance',
            date: new Date('2024-09-10'),
            vendor: 'ABC Plumbing',
            note: 'Fixed kitchen sink leak',
          },
          {
            id: 'expense-2',
            propertyId: 'prop-1',
            amount: 300,
            category: 'Utilities',
            date: new Date('2024-09-01'),
            vendor: 'City Electric',
            note: 'Monthly electricity bill',
          },
          {
            id: 'expense-3',
            propertyId: 'prop-2',
            amount: 75,
            category: 'Maintenance',
            date: new Date('2024-08-25'),
            vendor: 'Green Lawn Care',
            note: 'Landscaping services',
          },
        ];
        
        await AsyncStorage.setItem(PAYMENTS_KEY, JSON.stringify(samplePayments));
        await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(sampleExpenses));
        
        setPayments(samplePayments);
        setExpenses(sampleExpenses);
      } else {
        setPayments(parsedPayments);
        setExpenses(parsedExpenses);
      }
    } catch (error) {
      console.error('Error loading payments data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPayment = async (payment: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    await AsyncStorage.setItem(PAYMENTS_KEY, JSON.stringify(updatedPayments));
    return newPayment;
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
    return newExpense;
  };

  const getPaymentsForLease = (leaseId: string) => {
    return payments.filter(payment => payment.leaseId === leaseId);
  };

  const getExpensesForProperty = (propertyId: string) => {
    return expenses.filter(expense => expense.propertyId === propertyId);
  };

  return {
    payments,
    expenses,
    isLoading,
    addPayment,
    addExpense,
    getPaymentsForLease,
    getExpensesForProperty,
  };
}
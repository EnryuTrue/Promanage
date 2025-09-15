import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign } from 'lucide-react-native';
import { Card } from '@/components/Card';
import { useProperties } from '@/hooks/useProperties';
import { usePayments } from '@/hooks/usePayments';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 32) / 7;

interface CalendarEvent {
  id: string;
  date: Date;
  type: 'rent_due' | 'lease_start' | 'lease_end';
  title: string;
  amount?: number;
  unitId: string;
  tenantId: string;
  isPaid?: boolean;
}

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { leases, units, tenants, properties, getTenantById } = useProperties();
  const { payments } = usePayments();

  const events = useMemo(() => {
    const eventList: CalendarEvent[] = [];
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    leases.forEach(lease => {
      if (!lease.active) return;

      const unit = units.find(u => u.id === lease.unitId);
      const tenant = getTenantById(lease.tenantId);
      const property = properties.find(p => p.id === unit?.propertyId);
      
      if (!unit || !tenant || !property) return;

      // Add rent due events for current month
      const rentDueDate = new Date(currentYear, currentMonth, lease.rentDueDay);
      if (rentDueDate.getMonth() === currentMonth) {
        const paymentForMonth = payments.find(p => 
          p.leaseId === lease.id && 
          p.date.getMonth() === currentMonth &&
          p.date.getFullYear() === currentYear
        );

        eventList.push({
          id: `rent-${lease.id}-${currentMonth}`,
          date: rentDueDate,
          type: 'rent_due',
          title: `Rent Due - ${tenant.name}`,
          amount: lease.rentAmount,
          unitId: lease.unitId,
          tenantId: lease.tenantId,
          isPaid: !!paymentForMonth,
        });
      }

      // Add lease start/end events if in current month
      if (lease.startDate.getMonth() === currentMonth && lease.startDate.getFullYear() === currentYear) {
        eventList.push({
          id: `start-${lease.id}`,
          date: lease.startDate,
          type: 'lease_start',
          title: `Lease Start - ${tenant.name}`,
          unitId: lease.unitId,
          tenantId: lease.tenantId,
        });
      }

      if (lease.endDate.getMonth() === currentMonth && lease.endDate.getFullYear() === currentYear) {
        eventList.push({
          id: `end-${lease.id}`,
          date: lease.endDate,
          type: 'lease_end',
          title: `Lease End - ${tenant.name}`,
          unitId: lease.unitId,
          tenantId: lease.tenantId,
        });
      }
    });

    return eventList;
  }, [currentDate, leases, units, tenants, properties, payments, getTenantById]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => event.date.getDate() === day);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarCell} />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const hasRentDue = dayEvents.some(e => e.type === 'rent_due');
      const hasUnpaidRent = dayEvents.some(e => e.type === 'rent_due' && !e.isPaid);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarCell,
            hasRentDue && styles.cellWithEvent,
            hasUnpaidRent && styles.cellWithUnpaidRent,
          ]}
          onPress={() => {
            if (dayEvents.length > 0) {
              // Show events for this day
            }
          }}
        >
          <Text style={[
            styles.dayText,
            hasRentDue && styles.dayTextWithEvent,
          ]}>
            {day}
          </Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicator}>
              <Text style={styles.eventCount}>{dayEvents.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Calendar',
          headerRight: () => (
            <TouchableOpacity onPress={() => setCurrentDate(new Date())}>
              <Text style={styles.todayButton}>Today</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content}>
        {/* Month Navigation */}
        <Card style={styles.monthHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <ChevronLeft color={theme.colors.text} size={24} />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <ChevronRight color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </Card>

        {/* Calendar Grid */}
        <Card style={styles.calendarContainer}>
          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {dayNames.map(day => (
              <View key={day} style={styles.dayHeader}>
                <Text style={styles.dayHeaderText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {renderCalendarGrid()}
          </View>
        </Card>

        {/* Events List */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>This Month's Events</Text>
          
          {events.length === 0 ? (
            <Card>
              <View style={styles.emptyState}>
                <CalendarIcon color={theme.colors.textSecondary} size={48} />
                <Text style={styles.emptyTitle}>No Events</Text>
                <Text style={styles.emptySubtitle}>
                  No rent due dates or lease events this month
                </Text>
              </View>
            </Card>
          ) : (
            events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map(event => {
                const unit = units.find(u => u.id === event.unitId);
                const property = properties.find(p => p.id === unit?.propertyId);
                
                return (
                  <Card key={event.id} style={styles.eventCard}>
                    <View style={styles.eventHeader}>
                      <View style={[
                        styles.eventIcon,
                        event.type === 'rent_due' && !event.isPaid && styles.eventIconOverdue,
                        event.type === 'rent_due' && event.isPaid && styles.eventIconPaid,
                      ]}>
                        <DollarSign 
                          color={event.type === 'rent_due' && !event.isPaid ? theme.colors.error : theme.colors.success} 
                          size={16} 
                        />
                      </View>
                      
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDetails}>
                          {property?.title} - Unit {unit?.unitNumber}
                        </Text>
                        {event.amount && (
                          <Text style={styles.eventAmount}>
                            {property?.currency}{event.amount}
                            {event.type === 'rent_due' && (
                              <Text style={[
                                styles.paymentStatus,
                                event.isPaid ? styles.paidStatus : styles.unpaidStatus
                              ]}>
                                {event.isPaid ? ' • Paid' : ' • Unpaid'}
                              </Text>
                            )}
                          </Text>
                        )}
                      </View>
                      
                      <Text style={styles.eventDate}>
                        {event.date.getDate()}
                      </Text>
                    </View>
                    
                    {event.type === 'rent_due' && !event.isPaid && (
                      <TouchableOpacity 
                        style={styles.markPaidButton}
                        onPress={() => router.push(`/mark-payment?leaseId=${event.id.split('-')[1]}`)}
                      >
                        <Text style={styles.markPaidText}>Mark as Paid</Text>
                      </TouchableOpacity>
                    )}
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
  todayButton: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  calendarContainer: {
    marginBottom: theme.spacing.lg,
  },
  dayHeaders: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dayHeader: {
    width: CELL_SIZE,
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cellWithEvent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
  },
  cellWithUnpaidRent: {
    backgroundColor: theme.colors.error + '20',
  },
  dayText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  dayTextWithEvent: {
    fontWeight: '600',
  },
  eventIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCount: {
    fontSize: 10,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  eventsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  eventCard: {
    marginBottom: theme.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  eventIconOverdue: {
    backgroundColor: theme.colors.error + '20',
  },
  eventIconPaid: {
    backgroundColor: theme.colors.success + '20',
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  eventDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  eventAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  paymentStatus: {
    fontWeight: 'normal',
  },
  paidStatus: {
    color: theme.colors.success,
  },
  unpaidStatus: {
    color: theme.colors.error,
  },
  eventDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  markPaidButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  markPaidText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
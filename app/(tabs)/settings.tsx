import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  Bell,
  DollarSign,
  Download,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '@/components/Card';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          title: 'Profile',
          subtitle: user?.name || 'Update your profile',
          onPress: () => {},
        },
        {
          icon: Bell,
          title: 'Notifications',
          subtitle: 'Manage your notification preferences',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: DollarSign,
          title: 'Currency',
          subtitle: user?.currency || 'USD',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          title: 'Export Data',
          subtitle: 'Download your data as CSV',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: Shield,
          title: 'Privacy Policy',
          subtitle: 'Read our privacy policy',
          onPress: () => {},
        },
        {
          icon: HelpCircle,
          title: 'Help & Support',
          subtitle: 'Get help with the app',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User color={theme.colors.text} size={32} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        </Card>

        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Card style={styles.groupCard}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingsItem,
                    itemIndex < group.items.length - 1 && styles.settingsItemBorder,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.settingsItemIcon}>
                    <item.icon color={theme.colors.primary} size={20} />
                  </View>
                  <View style={styles.settingsItemContent}>
                    <Text style={styles.settingsItemTitle}>{item.title}</Text>
                    <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight color={theme.colors.textSecondary} size={20} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut color={theme.colors.error} size={20} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.0</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  settingsGroup: {
    marginBottom: theme.spacing.lg,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  groupCard: {
    padding: 0,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  settingsItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
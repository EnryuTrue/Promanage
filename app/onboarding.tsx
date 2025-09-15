import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Easy Manage',
    subtitle: 'one click to manage your all property\nwith customers satisfaction',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
  },
  {
    title: 'Track Rent',
    subtitle: 'Monitor payments and keep track\nof all your rental income',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  },
  {
    title: 'Stay Organized',
    subtitle: 'Manage tenants, leases, and expenses\nall in one place',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastSlide = currentIndex === onboardingData.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/auth');
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = () => {
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: onboardingData[currentIndex].image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {onboardingData[currentIndex].title}
          </Text>
          <Text style={styles.subtitle}>
            {onboardingData[currentIndex].subtitle}
          </Text>
        </View>

        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={isLastSlide ? 'GET STARTED' : 'Next'}
            onPress={handleNext}
            style={styles.nextButton}
          />
          
          {!isLastSlide && (
            <Button
              title="Skip"
              onPress={handleSkip}
              variant="outline"
              style={styles.skipButton}
            />
          )}
        </View>
      </View>
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
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  image: {
    width: width * 0.8,
    height: 250,
    borderRadius: theme.borderRadius.lg,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  nextButton: {
    width: '100%',
  },
  skipButton: {
    width: '100%',
  },
});
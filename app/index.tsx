import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Gradients } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { isDarkMode } = useAppState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Navigate to welcome screen after delay
    const timer = setTimeout(() => {
      router.replace('/auth/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      {/* Animated Background Elements */}
      <Animated.View 
        style={[
          styles.backgroundCircle,
          {
            transform: [{ rotate }],
            opacity: fadeAnim,
            borderColor: isDarkMode ? 'rgba(0, 212, 255, 0.1)' : 'rgba(37, 99, 235, 0.1)',
          }
        ]}
      />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={[currentColors.neonBlue, currentColors.neonPurple]}
            style={styles.logo}
          >
            <Text style={styles.logoText}>GF</Text>
          </LinearGradient>
        </View>

        {/* App Name */}
        <Text style={[styles.appName, { color: currentColors.text }]}>GymFit</Text>
        <Text style={[styles.tagline, { color: currentColors.textSecondary }]}>Fit Your Gym, Fit Your Life</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={[currentColors.neonBlue, currentColors.neonPurple]}
            style={styles.loadingBar}
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.1)',
    top: -width * 0.5,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.dark.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: Colors.dark.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginBottom: 48,
    textAlign: 'center',
  },
  loadingContainer: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    width: '60%',
    borderRadius: 2,
  },
});
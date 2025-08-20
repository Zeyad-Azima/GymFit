import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Target, Users, Trophy, Moon, Sun } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <BlurView intensity={20} style={styles.featureCardBlur}>
        <LinearGradient
          colors={[Colors.dark.neonBlue, Colors.dark.neonPurple]}
          style={styles.featureIcon}
        >
          <Icon size={24} color="#FFFFFF" />
        </LinearGradient>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </BlurView>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const { isDarkMode, toggleTheme } = useAppState();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  useEffect(() => {
    // Main content animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for buttons
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Theme Toggle */}
          <Animated.View
            style={[
              styles.themeToggle,
              {
                opacity: fadeAnim,
              }
            ]}
          >
            <TouchableOpacity
              style={styles.themeButton}
              onPress={toggleTheme}
            >
              <BlurView intensity={20} style={styles.themeButtonBlur}>
                {isDarkMode ? (
                  <Sun size={20} color={currentColors.neonYellow} />
                ) : (
                  <Moon size={20} color={currentColors.neonPurple} />
                )}
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.logo}
            >
              <Text style={styles.logoText}>GF</Text>
            </LinearGradient>
            <Text style={styles.welcomeTitle}>Welcome to GymFit</Text>
            <Text style={styles.welcomeSubtitle}>
              Your ultimate fitness companion{'\n'}
              designed for university students
            </Text>
          </Animated.View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <FeatureCard
              icon={Zap}
              title="Smart Workouts"
              description="AI-powered workout plans tailored to your goals"
              delay={200}
            />
            <FeatureCard
              icon={Target}
              title="Goal Tracking"
              description="Track progress with detailed analytics and insights"
              delay={400}
            />
            <FeatureCard
              icon={Users}
              title="Social Fitness"
              description="Connect with trainers and join group classes"
              delay={600}
            />
            <FeatureCard
              icon={Trophy}
              title="Achievements"
              description="Earn badges and compete with friends"
              delay={800}
            />
          </View>

          {/* Action Buttons */}
          <Animated.View
            style={[
              styles.actionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push('/auth/signup')}
              >
                <LinearGradient
                  colors={[currentColors.neonBlue, currentColors.neonPurple]}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/auth/login')}
            >
              <BlurView intensity={20} style={styles.secondaryButtonBlur}>
                <Text style={styles.secondaryButtonText}>Already have an account?</Text>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  themeToggle: {
    alignItems: 'flex-end',
    paddingTop: 20,
    paddingBottom: 20,
  },
  themeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  themeButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Shadows.neon,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: Colors.dark.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingVertical: 40,
    gap: 20,
    minHeight: 400,
  },
  featureCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  featureCardBlur: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  actionContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 8,
    gap: 20,
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Shadows.neon,
  },
  buttonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  secondaryButtonBlur: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
});
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isDarkMode } = useAppState();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleResetPassword = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Success animation
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <LinearGradient colors={currentGradients} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.successContainer,
              {
                opacity: successAnim,
                transform: [{ scale: successAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[currentColors.neonGreen, currentColors.success]}
              style={styles.successIcon}
            >
              <CheckCircle size={48} color="#FFFFFF" />
            </LinearGradient>

            <Text style={[styles.successTitle, { color: currentColors.text }]}>Check Your Email</Text>
            <Text style={[styles.successMessage, { color: currentColors.textSecondary }]}>
              We've sent a password reset link to{'\n'}
              <Text style={[styles.emailText, { color: currentColors.neonBlue }]}>{email}</Text>
            </Text>

            <TouchableOpacity
              style={styles.backToLoginButton}
              onPress={() => router.push('/auth/login')}
            >
              <LinearGradient
                colors={[currentColors.neonBlue, currentColors.neonPurple]}
                style={styles.backToLoginGradient}
              >
                <Text style={styles.backToLoginText}>Back to Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => setIsSuccess(false)}
            >
              <Text style={[styles.resendText, { color: currentColors.textMuted }]}>Didn't receive the email? Resend</Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <BlurView intensity={20} style={styles.backButtonBlur}>
                <ArrowLeft size={24} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Don't worry! Enter your email address and we'll send you a link to reset your password.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              }
            ]}
          >
            <BlurView intensity={20} style={styles.formBlur}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={20} color={Colors.dark.neonBlue} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor={Colors.dark.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Reset Button */}
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetPassword}
                disabled={isLoading || !email}
              >
                <LinearGradient
                  colors={[Colors.dark.neonBlue, Colors.dark.neonPurple]}
                  style={[
                    styles.resetButtonGradient,
                    (!email || isLoading) && styles.disabledButton
                  ]}
                >
                  <Text style={styles.resetButtonText}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>
                  Remember your password?{' '}
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={styles.helpLink}>Sign In</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: Colors.dark.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  formBlur: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
    paddingRight: 16,
  },
  resetButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    ...Shadows.neon,
  },
  resetButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  helpLink: {
    color: Colors.dark.neonBlue,
    fontWeight: '700',
  },
  // Success Screen Styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...Shadows.neon,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  emailText: {
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  backToLoginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    ...Shadows.neon,
  },
  backToLoginGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
});
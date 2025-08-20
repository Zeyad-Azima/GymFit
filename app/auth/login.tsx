import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useAppState();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  };

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

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your fitness journey</Text>
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
                  <Mail size={20} color={currentColors.neonBlue} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={currentColors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Lock size={20} color={currentColors.neonBlue} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={currentColors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={currentColors.textMuted} />
                  ) : (
                    <Eye size={20} color={currentColors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/auth/forgot-password')}
              >
                <Text style={[styles.forgotPasswordText, { color: currentColors.neonBlue }]}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[currentColors.neonBlue, currentColors.neonPurple]}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={[styles.dividerText, { color: currentColors.textMuted }]}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <TouchableOpacity style={styles.socialButton}>
                <BlurView intensity={10} style={styles.socialButtonBlur}>
                  <Text style={[styles.socialButtonText, { color: currentColors.textSecondary }]}>Continue with Google</Text>
                </BlurView>
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          {/* Sign Up Link */}
          <Animated.View
            style={[
              styles.signupContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[styles.signupText, { color: currentColors.textSecondary }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={[styles.signupLink, { color: currentColors.neonBlue }]}>Sign Up</Text>
            </TouchableOpacity>
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
    marginBottom: 8,
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
    marginBottom: 16,
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
  },
  eyeIcon: {
    padding: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    ...Shadows.neon,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    marginHorizontal: 16,
  },
  socialButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  socialButtonBlur: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  signupText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  signupLink: {
    fontSize: 16,
    color: Colors.dark.neonBlue,
    fontWeight: '700',
  },
});
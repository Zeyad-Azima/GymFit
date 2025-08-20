import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Phone } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignup = async () => {
    setIsLoading(true);
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 2000);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
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
                  <ArrowLeft size={24} color={currentColors.text} />
                </BlurView>
              </TouchableOpacity>

              <Text style={[styles.title, { color: currentColors.text }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: currentColors.textSecondary }]}>Join the fitness revolution today</Text>
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
                {/* Full Name Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <User size={20} color={Colors.dark.neonBlue} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={formData.fullName}
                    onChangeText={(value) => updateFormData('fullName', value)}
                    autoCapitalize="words"
                  />
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Mail size={20} color={Colors.dark.neonBlue} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={formData.email}
                    onChangeText={(value) => updateFormData('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Phone size={20} color={Colors.dark.neonBlue} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={formData.phone}
                    onChangeText={(value) => updateFormData('phone', value)}
                    keyboardType="phone-pad"
                  />
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={Colors.dark.neonBlue} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={formData.password}
                    onChangeText={(value) => updateFormData('password', value)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.dark.textMuted} />
                    ) : (
                      <Eye size={20} color={Colors.dark.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Confirm Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Lock size={20} color={Colors.dark.neonBlue} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateFormData('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.dark.textMuted} />
                    ) : (
                      <Eye size={20} color={Colors.dark.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Terms and Conditions */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By creating an account, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                {/* Signup Button */}
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={handleSignup}
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={[Colors.dark.neonBlue, Colors.dark.neonPurple]}
                    style={styles.signupButtonGradient}
                  >
                    <Text style={styles.signupButtonText}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Signup */}
                <TouchableOpacity style={styles.socialButton}>
                  <BlurView intensity={10} style={styles.socialButtonBlur}>
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                  </BlurView>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>

            {/* Login Link */}
            <Animated.View
              style={[
                styles.loginContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
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
    paddingBottom: 32,
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
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
  },
  formBlur: {
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
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    lineHeight: 20,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    ...Shadows.neon,
  },
  signupButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signupButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  loginText: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.dark.neonBlue,
    fontWeight: '700',
  },
});
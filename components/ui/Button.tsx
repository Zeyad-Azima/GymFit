import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  gradient = false,
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    styles[`${variant}ButtonText`],
    styles[`${size}ButtonText`],
    disabled && styles.disabledButtonText,
    textStyle,
  ];

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[style]}>
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={[styles.button, styles[`${size}Button`], disabled && styles.disabledButton]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={buttonTextStyle}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primaryButton: {
    backgroundColor: '#2563EB',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  // Sizes
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  largeButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  // Text Styles
  buttonText: {
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#374151',
  },
  outlineButtonText: {
    color: '#374151',
  },
  smallButtonText: {
    fontSize: 12,
  },
  mediumButtonText: {
    fontSize: 14,
  },
  largeButtonText: {
    fontSize: 16,
  },
  // Disabled States
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});
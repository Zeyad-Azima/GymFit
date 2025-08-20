import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ 
  children, 
  style, 
  variant = 'default' 
}: CardProps) {
  return (
    <View style={[
      styles.card,
      styles[`${variant}Card`],
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  defaultCard: {
    // Default card style
  },
  elevatedCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  outlinedCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
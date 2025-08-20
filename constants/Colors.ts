export const Colors = {
  // Modern Dark Theme with Orange/Black Neons
  dark: {
    // Backgrounds
    primary: '#0A0A0A',
    secondary: '#1A1A1A',
    tertiary: '#2A2A2A',
    card: 'rgba(26, 26, 26, 0.8)',
    glass: 'rgba(255, 165, 0, 0.05)',
    
    // Text
    text: '#FFFFFF',
    textSecondary: '#E5E5E5',
    textMuted: '#999999',
    
    // Accent Colors
    accent: '#FF8C00', // Dark Orange
    accentSecondary: '#FF4500', // Orange Red
    success: '#FF6600', // Bright Orange
    warning: '#FFA500', // Orange
    error: '#FF0000', // Red
    
    // Gradients
    gradientPrimary: ['#FF8C00', '#FF4500'],
    gradientSecondary: ['#FFA500', '#FF6600'],
    gradientAccent: ['#FF7F00', '#FF4500'],
    gradientSuccess: ['#FF6600', '#FF8C00'],
    gradientWarning: ['#FFA500', '#FFB84D'],
    
    // Neon Colors
    neonBlue: '#FF8C00', // Orange instead of blue
    neonPurple: '#FF4500', // Dark orange instead of purple
    neonGreen: '#FF6600', // Bright orange instead of green
    neonPink: '#FF7F50', // Coral orange instead of pink
    neonYellow: '#FFA500', // Orange instead of yellow
  },
  
  // Modern Light Theme with Orange/Black
  light: {
    // Backgrounds
    primary: '#FAFAFA',
    secondary: '#FFFFFF',
    tertiary: '#F5F5F5',
    card: 'rgba(255, 255, 255, 0.9)',
    glass: 'rgba(255, 165, 0, 0.1)',
    
    // Text
    text: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#6A6A6A',
    
    // Accent Colors
    accent: '#FF8C00',
    accentSecondary: '#FF4500',
    success: '#FF6600',
    warning: '#FFA500',
    error: '#FF0000',
    
    // Gradients
    gradientPrimary: ['#FF8C00', '#FF4500'],
    gradientSecondary: ['#FFA500', '#FF6600'],
    gradientAccent: ['#FF7F00', '#FF4500'],
    gradientSuccess: ['#FF6600', '#FF8C00'],
    gradientWarning: ['#FFA500', '#FFB84D'],
    
    // Bright Colors
    neonBlue: '#FF8C00',
    neonPurple: '#FF4500',
    neonGreen: '#FF6600',
    neonPink: '#FF7F50',
    neonYellow: '#FFA500',
  }
};

export const Gradients = {
  dark: ['#0A0A0A', '#1A1A1A', '#2A2A2A'],
  light: ['#FAFAFA', '#F0F0F0', '#E0E0E0'],
  primary: ['#FF8C00', '#FF4500'],
  secondary: ['#FFA500', '#FF6600'],
  accent: ['#FF7F00', '#FF4500'],
  success: ['#FF6600', '#FF8C00'],
  neon: ['#FF8C00', '#FF4500'],
};

export const Shadows = {
  neon: {
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  }
};
# GymFit - AI-Powered Fitness Companion

<div align="center">
  <img src="./assets/images/icon.png" alt="GymFit Logo" width="120" height="120">
  
  [![Expo SDK](https://img.shields.io/badge/Expo%20SDK-53.0.0-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.79.1-green.svg)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 📱 About GymFit

GymFit is a comprehensive fitness companion app designed specifically for university students. It combines AI-powered workout recommendations, social fitness features, and comprehensive progress tracking to help users achieve their fitness goals.

### 🎯 Key Features

- **🤖 AI Fitness Coach**: Personalized workout plans powered by artificial intelligence
- **📊 Progress Tracking**: Detailed analytics and goal tracking with visual insights
- **🏋️ Class Booking**: Book and manage gym classes with real-time availability
- **💬 Trainer Chat**: Direct messaging with certified fitness trainers
- **🏆 Achievements System**: Gamified experience with badges and rewards
- **📈 Smart Analytics**: AI-driven insights into your fitness journey
- **🎨 Modern UI/UX**: Beautiful glass-morphism design with smooth animations
- **🌙 Dark/Light Theme**: Adaptive theming for better user experience

## 🏗️ Architecture

### Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (File-based routing)
- **Language**: TypeScript
- **Styling**: StyleSheet with LinearGradient and BlurView
- **Icons**: Lucide React Native
- **Animations**: React Native Reanimated & Gesture Handler
- **State Management**: React Hooks (Custom useAppState)

### Project Structure

```
app/
├── (tabs)/                 # Tab-based navigation
│   ├── index.tsx          # Home screen
│   ├── classes.tsx        # Gym classes
│   ├── progress.tsx       # Progress tracking
│   ├── chat.tsx           # Trainer chat
│   └── profile.tsx        # User profile
├── auth/                  # Authentication screens
│   ├── welcome.tsx        # Welcome screen
│   ├── login.tsx          # Login screen
│   ├── signup.tsx         # Registration
│   └── forgot-password.tsx
├── ai-coach.tsx           # AI fitness coach
├── fitness-goals.tsx      # Goal management
├── privacy-security.tsx   # Privacy settings
└── _layout.tsx           # Root layout

components/
├── ui/                    # Reusable UI components
│   ├── Button.tsx
│   └── Card.tsx

constants/
└── Colors.ts             # Theme colors and gradients

hooks/
├── useAppState.ts        # Global state management
└── useFrameworkReady.ts  # Framework initialization

data/
└── mockData.ts           # Mock data for development
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gymfit-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run on device/simulator**
   - Install Expo Go app on your mobile device
   - Scan the QR code displayed in terminal
   - Or press `a` for Android emulator, `i` for iOS simulator

### Environment Setup

The app uses Expo's managed workflow, so no additional environment configuration is needed for basic development.

## 📱 Features Overview

### 🏠 Home Screen
- **Daily Challenge**: Interactive progress tracking
- **Quick Stats**: Workouts, calories, streak, and badges
- **Quick Actions**: Fast access to key features
- **Upcoming Classes**: Preview of booked sessions

### 🤖 AI Fitness Coach
- **Personalized Workouts**: AI-generated routines based on user goals
- **Real-time Chat**: Interactive AI assistant for fitness questions
- **Progress Analytics**: AI-powered insights and recommendations
- **Workout Timer**: Built-in timer with pause/resume functionality

### 📊 Progress Tracking
- **Visual Analytics**: Charts and graphs showing fitness progress
- **Achievement System**: Unlockable badges and milestones
- **Goal Management**: Set and track custom fitness goals
- **Activity History**: Detailed workout and class history

### 🏋️ Class Management
- **Real-time Booking**: Book available gym classes
- **Trainer Profiles**: View trainer specialties and ratings
- **Class Filters**: Filter by type, time, and difficulty
- **Attendance Tracking**: Automatic check-in system

### 💬 Trainer Chat
- **Direct Messaging**: Chat with certified trainers
- **Video/Voice Calls**: Integrated calling functionality
- **File Sharing**: Share workout videos and images
- **Online Status**: Real-time trainer availability

### 👤 Profile Management
- **Personal Stats**: Comprehensive fitness metrics
- **Settings**: Customizable app preferences
- **Privacy Controls**: Data management and security
- **Achievement Gallery**: Display earned badges

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build:web

# Run linting
npm run lint

# Check dependencies
npx expo doctor

# Install/update dependencies
npx expo install --check
```

### Code Style

The project follows these conventions:
- **TypeScript**: Strict typing enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (configured in .prettierrc)
- **File Naming**: PascalCase for components, camelCase for utilities

### Adding New Features

1. **Create component files** in appropriate directories
2. **Add routes** in the `app/` directory following Expo Router conventions
3. **Update navigation** in `app/(tabs)/_layout.tsx` if needed
4. **Add types** in TypeScript interfaces
5. **Test thoroughly** on both iOS and Android

## 📦 Building & Deployment

### Development Build

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Create development build
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Production Build

#### Android APK

```bash
# Build APK for distribution
eas build --profile production --platform android

# Or build locally (requires Android SDK)
npx expo run:android --variant release
```

#### iOS App Store

```bash
# Build for App Store
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios
```

### Web Deployment

```bash
# Build web version
npm run build:web

# Deploy to Netlify/Vercel
# Upload the 'dist' folder to your hosting provider
```

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_DEBUG=true

# .env.production
EXPO_PUBLIC_API_URL=https://api.gymfit.com
EXPO_PUBLIC_DEBUG=false
```

## 🎨 Customization

### Theming

Colors and gradients are defined in `constants/Colors.ts`:

```typescript
export const Colors = {
  dark: {
    primary: '#0A0A0A',
    accent: '#FF8C00',
    neonBlue: '#FF8C00',
    // ... more colors
  }
}
```

### Adding New Screens

1. Create screen file in `app/` directory
2. Add to navigation stack in `_layout.tsx`
3. Implement screen component with proper styling

### Custom Components

Create reusable components in `components/ui/`:

```typescript
// components/ui/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
}

export default function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro Cache Issues**
   ```bash
   npx expo start --clear
   rm -rf node_modules && npm install
   ```

2. **Dependency Conflicts**
   ```bash
   npx expo doctor
   npx expo install --check
   ```

3. **Build Failures**
   ```bash
   # Clear EAS build cache
   eas build --clear-cache
   
   # Check build logs
   eas build:list
   ```

4. **iOS Simulator Issues**
   ```bash
   # Reset iOS simulator
   xcrun simctl erase all
   ```

5. **Android Emulator Issues**
   ```bash
   # Cold boot Android emulator
   emulator -avd <AVD_NAME> -cold-boot
   ```

### Performance Optimization

- Use `React.memo` for expensive components
- Implement `FlatList` for large data sets
- Optimize images with appropriate sizes
- Use `InteractionManager` for heavy operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for continuous improvements
- **Lucide Icons** for beautiful icon set
- **University Fitness Centers** for inspiration and requirements

## 📞 Support

For support and questions:

- **Email**: support@gymfit.com
- **Documentation**: [docs.gymfit.com](https://docs.gymfit.com)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [GymFit Community](https://discord.gg/gymfit)

---

<div align="center">
  <p>Made with ❤️ for the fitness community</p>
  <p>© 2024 GymFit. All rights reserved.</p>
</div>
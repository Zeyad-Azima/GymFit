import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  Calendar, 
  Clock,
  TrendingUp,
  Award,
  Play,
  Pause,
  RotateCcw,
  Send,
  Bot
} from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const WorkoutCard = ({ workout, onStart, currentColors, isActive = false }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={() => onStart(workout)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={[styles.workoutCard, isActive && styles.activeWorkoutCard]}>
          <LinearGradient
            colors={isActive ? [currentColors.neonGreen, currentColors.success] : workout.gradient}
            style={styles.workoutHeader}
          >
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.workoutSubtitle}>{workout.subtitle}</Text>
            </View>
            <View style={styles.workoutIcon}>
              {isActive ? <Pause size={24} color="#FFFFFF" /> : <Play size={24} color="#FFFFFF" />}
            </View>
          </LinearGradient>
          
          <View style={styles.workoutDetails}>
            <View style={styles.workoutMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color={currentColors.neonBlue} />
                <Text style={[styles.metaText, { color: currentColors.textSecondary }]}>{workout.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Target size={16} color={currentColors.neonBlue} />
                <Text style={[styles.metaText, { color: currentColors.textSecondary }]}>{workout.difficulty}</Text>
              </View>
              <View style={styles.metaItem}>
                <TrendingUp size={16} color={currentColors.neonBlue} />
                <Text style={[styles.metaText, { color: currentColors.textSecondary }]}>{workout.calories} cal</Text>
              </View>
            </View>
            
            <Text style={[styles.workoutDescription, { color: currentColors.textSecondary }]}>
              {workout.description}
            </Text>
            
            <View style={styles.exercisesList}>
              {workout.exercises.slice(0, 3).map((exercise, index) => (
                <Text key={index} style={[styles.exerciseItem, { color: currentColors.textMuted }]}>
                  • {exercise}
                </Text>
              ))}
              {workout.exercises.length > 3 && (
                <Text style={[styles.moreExercises, { color: currentColors.neonBlue }]}>
                  +{workout.exercises.length - 3} more exercises
                </Text>
              )}
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ChatMessage = ({ message, isUser, currentColors }) => (
  <View style={[styles.chatMessage, isUser ? styles.userChatMessage : styles.aiChatMessage]}>
    {isUser ? (
      <LinearGradient
        colors={[currentColors.neonBlue, currentColors.neonPurple]}
        style={styles.userMessageBubble}
      >
        <Text style={styles.userMessageText}>{message}</Text>
      </LinearGradient>
    ) : (
      <BlurView intensity={15} style={[styles.aiMessageBubble, { backgroundColor: currentColors.glass }]}>
        <View style={styles.aiMessageHeader}>
          <LinearGradient
            colors={[currentColors.neonYellow, currentColors.warning]}
            style={styles.aiAvatar}
          >
            <Bot size={16} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.aiName, { color: currentColors.text }]}>AI Coach</Text>
        </View>
        <Text style={[styles.aiMessageText, { color: currentColors.textSecondary }]}>{message}</Text>
      </BlurView>
    )}
  </View>
);

export default function AICoachScreen() {
  const [activeTab, setActiveTab] = useState('workouts');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, message: "Hi! I'm your AI fitness coach. I've analyzed your progress and created personalized workouts for you!", isUser: false },
    { id: 2, message: "Based on your goals and current fitness level, I recommend starting with the 'Morning Energy Boost' workout.", isUser: false }
  ]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const { user, isDarkMode, startWorkout, endWorkout } = useAppState();
  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
    ]).start();
  }, []);

  // Timer effect for active workout
  useEffect(() => {
    let interval;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  const aiWorkouts = [
    {
      id: 1,
      title: 'Morning Energy Boost',
      subtitle: 'Perfect for your 7 AM schedule',
      duration: '25 min',
      difficulty: 'Beginner',
      calories: 180,
      description: 'A gentle morning routine to energize your day with light cardio and stretching.',
      gradient: [currentColors.neonBlue, currentColors.neonPurple],
      exercises: ['Jumping Jacks', 'Push-ups', 'Squats', 'Plank', 'Mountain Climbers', 'Cool Down Stretch'],
      aiReason: 'Based on your morning availability and beginner fitness level'
    },
    {
      id: 2,
      title: 'Strength Builder Pro',
      subtitle: 'Tailored for muscle growth',
      duration: '45 min',
      difficulty: 'Intermediate',
      calories: 320,
      description: 'Progressive strength training focused on your goal areas with proper rest periods.',
      gradient: [currentColors.neonGreen, currentColors.success],
      exercises: ['Deadlifts', 'Bench Press', 'Squats', 'Pull-ups', 'Overhead Press', 'Core Circuit'],
      aiReason: 'Your progress shows readiness for intermediate strength training'
    },
    {
      id: 3,
      title: 'HIIT Fat Burner',
      subtitle: 'Maximize calorie burn',
      duration: '30 min',
      difficulty: 'Advanced',
      calories: 400,
      description: 'High-intensity intervals designed to boost metabolism and burn maximum calories.',
      gradient: [currentColors.neonPink, currentColors.accentSecondary],
      exercises: ['Burpees', 'Sprint Intervals', 'Jump Squats', 'High Knees', 'Battle Ropes', 'Recovery Walk'],
      aiReason: 'Perfect for your weight loss goals and current fitness level'
    }
  ];

  const handleStartWorkout = (workout) => {
    if (currentWorkout?.id === workout.id && isWorkoutActive) {
      // Pause current workout
      setIsWorkoutActive(false);
    } else if (currentWorkout?.id === workout.id && !isWorkoutActive) {
      // Resume current workout
      setIsWorkoutActive(true);
    } else {
      // Start new workout
      setCurrentWorkout(workout);
      setWorkoutTimer(0);
      setIsWorkoutActive(true);
      startWorkout(workout.title);
    }
  };

  const handleEndWorkout = () => {
    if (currentWorkout) {
      endWorkout();
      setCurrentWorkout(null);
      setWorkoutTimer(0);
      setIsWorkoutActive(false);
    }
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        message: chatMessage.trim(),
        isUser: true
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      setChatMessage('');
      
      // AI Response
      setTimeout(() => {
        const aiResponses = [
          "Great question! Based on your current progress, I'd recommend focusing on consistency over intensity.",
          "That's an excellent goal! Let me create a customized plan that fits your schedule perfectly.",
          "I've analyzed your workout history and noticed you're making great progress! Keep it up!",
          "For optimal results, try to maintain a 3-4 workout per week schedule. Your body needs recovery time too!",
          "Your form is improving! I recommend adding some mobility work to prevent injuries.",
          "Based on your preferences, I've updated your workout recommendations. Check out the new plans!"
        ];
        
        const aiResponse = {
          id: Date.now() + 1,
          message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
          isUser: false
        };
        
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'workouts', title: 'AI Workouts', icon: Target },
    { id: 'chat', title: 'AI Assistant', icon: Bot },
    { id: 'analytics', title: 'Analytics', icon: TrendingUp }
  ];

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
            <BlurView intensity={20} style={[styles.backButtonBlur, { backgroundColor: currentColors.glass }]}>
              <ArrowLeft size={24} color={currentColors.text} />
            </BlurView>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <LinearGradient
              colors={[currentColors.neonYellow, currentColors.warning]}
              style={styles.aiLogo}
            >
              <Zap size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: currentColors.text }]}>AI Fitness Coach</Text>
            <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary }]}>
              Personalized for {user.name}
            </Text>
          </View>
        </Animated.View>

        {/* Active Workout Timer */}
        {currentWorkout && (
          <Animated.View style={[styles.activeWorkoutBanner, { opacity: fadeAnim }]}>
            <BlurView intensity={20} style={[styles.activeWorkoutBlur, { backgroundColor: currentColors.glass }]}>
              <LinearGradient
                colors={[currentColors.neonGreen, currentColors.success]}
                style={styles.activeWorkoutGradient}
              >
                <View style={styles.activeWorkoutInfo}>
                  <Text style={styles.activeWorkoutTitle}>{currentWorkout.title}</Text>
                  <Text style={styles.activeWorkoutTime}>{formatTime(workoutTimer)}</Text>
                </View>
                <View style={styles.activeWorkoutControls}>
                  <TouchableOpacity
                    style={styles.workoutControlButton}
                    onPress={() => setIsWorkoutActive(!isWorkoutActive)}
                  >
                    {isWorkoutActive ? <Pause size={20} color="#FFFFFF" /> : <Play size={20} color="#FFFFFF" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.workoutControlButton}
                    onPress={handleEndWorkout}
                  >
                    <RotateCcw size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </BlurView>
          </Animated.View>
        )}

        {/* Tab Navigation */}
        <Animated.View
          style={[
            styles.tabNavigation,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab.id)}
            >
              {activeTab === tab.id ? (
                <LinearGradient
                  colors={[currentColors.neonBlue, currentColors.neonPurple]}
                  style={styles.activeTabGradient}
                >
                  <tab.icon size={20} color="#FFFFFF" />
                  <Text style={styles.activeTabText}>{tab.title}</Text>
                </LinearGradient>
              ) : (
                <BlurView intensity={15} style={[styles.tabBlur, { backgroundColor: currentColors.glass }]}>
                  <tab.icon size={20} color={currentColors.textMuted} />
                  <Text style={[styles.tabText, { color: currentColors.textMuted }]}>{tab.title}</Text>
                </BlurView>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'workouts' && (
            <Animated.View
              style={[
                styles.workoutsTab,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Recommended for You</Text>
                <Text style={[styles.sectionSubtitle, { color: currentColors.textSecondary }]}>
                  AI-generated based on your goals and progress
                </Text>
              </View>

              {aiWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onStart={handleStartWorkout}
                  currentColors={currentColors}
                  isActive={currentWorkout?.id === workout.id}
                />
              ))}

              {/* AI Insights */}
              <BlurView intensity={20} style={[styles.insightsCard, { backgroundColor: currentColors.glass }]}>
                <LinearGradient
                  colors={[currentColors.neonYellow, currentColors.warning]}
                  style={styles.insightsHeader}
                >
                  <Award size={24} color="#FFFFFF" />
                  <Text style={styles.insightsTitle}>AI Insights</Text>
                </LinearGradient>
                <View style={styles.insightsContent}>
                  <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>
                    • You're most active in the mornings - perfect for energy boost workouts
                  </Text>
                  <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>
                    • Your strength has improved 15% this month - ready for intermediate level
                  </Text>
                  <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>
                    • Consistency is your strength - 7 day streak shows great dedication
                  </Text>
                  <Text style={[styles.insightText, { color: currentColors.textSecondary }]}>
                    • Consider adding more cardio to reach your calorie goals faster
                  </Text>
                </View>
              </BlurView>
            </Animated.View>
          )}

          {activeTab === 'chat' && (
            <Animated.View
              style={[
                styles.chatTab,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.chatHeader}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>AI Assistant</Text>
                <Text style={[styles.sectionSubtitle, { color: currentColors.textSecondary }]}>
                  Ask anything about fitness, nutrition, or your workout plan
                </Text>
              </View>

              <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
                {chatHistory.map((msg) => (
                  <ChatMessage key={msg.id} {...msg} currentColors={currentColors} />
                ))}
              </ScrollView>

              <BlurView intensity={20} style={[styles.chatInputContainer, { backgroundColor: currentColors.glass }]}>
                <BlurView intensity={15} style={[styles.chatInputBlur, { backgroundColor: currentColors.glass }]}>
                  <TextInput
                    style={[styles.chatInput, { color: currentColors.text }]}
                    placeholder="Ask your AI coach anything..."
                    placeholderTextColor={currentColors.textMuted}
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    multiline
                  />
                </BlurView>
                <TouchableOpacity 
                  style={styles.chatSendButton}
                  onPress={sendChatMessage}
                >
                  <LinearGradient
                    colors={[currentColors.neonBlue, currentColors.neonPurple]}
                    style={styles.chatSendGradient}
                  >
                    <Send size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          )}

          {activeTab === 'analytics' && (
            <Animated.View
              style={[
                styles.analyticsTab,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>AI Analytics</Text>
                <Text style={[styles.sectionSubtitle, { color: currentColors.textSecondary }]}>
                  Detailed analysis of your fitness journey
                </Text>
              </View>

              {/* Performance Metrics */}
              <BlurView intensity={20} style={[styles.analyticsCard, { backgroundColor: currentColors.glass }]}>
                <Text style={[styles.analyticsCardTitle, { color: currentColors.text }]}>Performance Trends</Text>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <LinearGradient
                      colors={[currentColors.neonBlue, currentColors.neonPurple]}
                      style={styles.metricIcon}
                    >
                      <TrendingUp size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.metricValue, { color: currentColors.text }]}>+15%</Text>
                    <Text style={[styles.metricLabel, { color: currentColors.textSecondary }]}>Strength</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <LinearGradient
                      colors={[currentColors.neonGreen, currentColors.success]}
                      style={styles.metricIcon}
                    >
                      <Target size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.metricValue, { color: currentColors.text }]}>92%</Text>
                    <Text style={[styles.metricLabel, { color: currentColors.textSecondary }]}>Goal Rate</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <LinearGradient
                      colors={[currentColors.neonYellow, currentColors.warning]}
                      style={styles.metricIcon}
                    >
                      <Calendar size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={[styles.metricValue, { color: currentColors.text }]}>7</Text>
                    <Text style={[styles.metricLabel, { color: currentColors.textSecondary }]}>Day Streak</Text>
                  </View>
                </View>
              </BlurView>

              {/* AI Recommendations */}
              <BlurView intensity={20} style={[styles.analyticsCard, { backgroundColor: currentColors.glass }]}>
                <Text style={[styles.analyticsCardTitle, { color: currentColors.text }]}>AI Recommendations</Text>
                <View style={styles.recommendationsList}>
                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationDot, { backgroundColor: currentColors.neonGreen }]} />
                    <Text style={[styles.recommendationText, { color: currentColors.textSecondary }]}>
                      Increase protein intake by 20g daily for better muscle recovery
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationDot, { backgroundColor: currentColors.neonBlue }]} />
                    <Text style={[styles.recommendationText, { color: currentColors.textSecondary }]}>
                      Add 2 rest days per week to prevent overtraining
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationDot, { backgroundColor: currentColors.neonPink }]} />
                    <Text style={[styles.recommendationText, { color: currentColors.textSecondary }]}>
                      Focus on compound movements for maximum efficiency
                    </Text>
                  </View>
                  <View style={styles.recommendationItem}>
                    <View style={[styles.recommendationDot, { backgroundColor: currentColors.neonYellow }]} />
                    <Text style={[styles.recommendationText, { color: currentColors.textSecondary }]}>
                      Your optimal workout time is 7-9 AM based on performance data
                    </Text>
                  </View>
                </View>
              </BlurView>

              {/* Progress Prediction */}
              <BlurView intensity={20} style={[styles.analyticsCard, { backgroundColor: currentColors.glass }]}>
                <Text style={[styles.analyticsCardTitle, { color: currentColors.text }]}>Progress Prediction</Text>
                <Text style={[styles.predictionText, { color: currentColors.textSecondary }]}>
                  Based on your current trajectory, you'll reach your fitness goals in approximately 8-10 weeks.
                  Keep up the excellent work!
                </Text>
                <View style={styles.progressPrediction}>
                  <View style={[styles.progressBar, { backgroundColor: currentColors.glass }]}>
                    <LinearGradient
                      colors={[currentColors.neonGreen, currentColors.success]}
                      style={[styles.progressFill, { width: '68%' }]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: currentColors.text }]}>68% to goal</Text>
                </View>
              </BlurView>
            </Animated.View>
          )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    alignItems: 'center',
  },
  aiLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Shadows.neon,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  activeWorkoutBanner: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeWorkoutBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeWorkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  activeWorkoutInfo: {
    flex: 1,
  },
  activeWorkoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activeWorkoutTime: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  activeWorkoutControls: {
    flexDirection: 'row',
    gap: 12,
  },
  workoutControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  activeTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  // Workouts Tab
  workoutsTab: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  workoutCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeWorkoutCard: {
    borderColor: 'rgba(0, 245, 160, 0.3)',
    ...Shadows.neon,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutDetails: {
    padding: 20,
    paddingTop: 0,
  },
  workoutMeta: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  exercisesList: {
    gap: 4,
  },
  exerciseItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  moreExercises: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  insightsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  insightsContent: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  insightText: {
    fontSize: 15,
    lineHeight: 22,
  },
  // Chat Tab
  chatTab: {
    flex: 1,
    minHeight: 500,
  },
  chatHeader: {
    marginBottom: 24,
  },
  chatMessages: {
    flex: 1,
    marginBottom: 20,
    maxHeight: 400,
  },
  chatMessage: {
    marginBottom: 16,
  },
  userChatMessage: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  aiChatMessage: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  userMessageBubble: {
    padding: 16,
    borderRadius: 20,
  },
  userMessageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  aiMessageBubble: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiName: {
    fontSize: 14,
    fontWeight: '600',
  },
  aiMessageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatInputBlur: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chatInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  chatSendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  chatSendGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Analytics Tab
  analyticsTab: {
    flex: 1,
  },
  analyticsCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  analyticsCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  recommendationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  recommendationText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  progressPrediction: {
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  predictionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
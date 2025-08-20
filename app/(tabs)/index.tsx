import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { 
  Flame, 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp,
  ChevronRight,
  Award,
  Zap,
  Bell
} from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const StatCard = ({ icon: Icon, title, value, color, bgColor, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={styles.statCard}>
          <LinearGradient
            colors={[color, color + '80']}
            style={styles.statIconContainer}
          >
            <Icon size={20} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const QuickActionCard = ({ icon: Icon, title, subtitle, onPress, gradient }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

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
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.quickActionContainer}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={15} style={styles.quickActionBlur}>
          <LinearGradient
            colors={gradient}
            style={styles.quickActionCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.quickActionIconContainer}>
              <Icon size={24} color="#FFFFFF" />
            </View>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>{title}</Text>
              <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
            </View>
            <ChevronRight size={18} color="rgba(255, 255, 255, 0.8)" />
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { 
    user, 
    isDarkMode, 
    completeChallenge, 
    bookClass, 
    classes,
    startWorkout,
    workoutInProgress,
    endWorkout 
  } = useAppState();

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.notificationButton}>
              <BlurView intensity={20} style={styles.notificationBlur}>
                <Bell size={20} color="#FFFFFF" />
                {user.notifications > 0 && <View style={styles.notificationBadge} />}
              </BlurView>
            </TouchableOpacity>
            <TouchableOpacity style={styles.streakBadge}>
              <BlurView intensity={20} style={styles.streakBlur}>
                <LinearGradient
                  colors={[currentColors.warning, currentColors.accentSecondary]}
                  style={styles.streakIcon}
                >
                  <Flame size={12} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.streakText}>{user.stats.streak} day streak</Text>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <StatCard
            icon={Target}
            title="Weekly Goal"
            value={`${user.stats.weeklyGoal.completed}/${user.stats.weeklyGoal.target}`}
            color={currentColors.neonBlue}
            onPress={() => startWorkout('Goal Tracking')}
          />
          <StatCard
            icon={Zap}
            title="Calories"
            value={user.stats.calories.toString()}
            color={currentColors.neonGreen}
            onPress={() => startWorkout('Cardio')}
          />
          <StatCard
            icon={Trophy}
            title="Badges"
            value={user.stats.badges.toString()}
            color={currentColors.neonPink}
            onPress={() => Alert.alert('Badges', 'View all your earned badges!', [{ text: 'Cool!' }])}
          />
        </View>

        {/* Today's Challenge */}
        <View style={styles.challengeContainer}>
          <BlurView intensity={20} style={styles.challengeBlur}>
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.challengeCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.challengeIconContainer}>
                <Award size={28} color="#FFFFFF" />
              </View>
              <View style={styles.challengeText}>
                <Text style={styles.challengeTitle}>Today's Challenge</Text>
                <Text style={styles.challengeDescription}>
                  {user.dailyChallenge.title}
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${user.dailyChallenge.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{user.dailyChallenge.description}</Text>
                <TouchableOpacity 
                  style={styles.challengeButton}
                  onPress={completeChallenge}
                >
                  <Text style={styles.challengeButtonText}>
                    {user.dailyChallenge.progress >= 100 ? 'Completed!' : 'Complete Challenge'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <QuickActionCard
            icon={Calendar}
            title="Book a Class"
            subtitle="Find and join gym classes"
            gradient={[currentColors.neonGreen, currentColors.success]}
            onPress={() => router.push('/(tabs)/classes')}
          />
          
          <QuickActionCard
            icon={TrendingUp}
            title="Log Workout"
            subtitle="Track your exercise session"
            gradient={[currentColors.neonPurple, currentColors.neonPink]}
            onPress={() => workoutInProgress ? endWorkout() : startWorkout('Custom Workout')}
          />
          
          <QuickActionCard
            icon={Zap}
            title="AI Fitness Coach"
            subtitle="Personalized workout plans"
            gradient={[currentColors.neonYellow, currentColors.warning]}
            onPress={() => router.push('/ai-coach')}
          />
        </View>

        {/* Upcoming Classes */}
        <View style={styles.upcomingContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Classes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {classes.slice(0, 2).map((classItem) => (
            <BlurView key={classItem.id} intensity={15} style={styles.classCard}>
              <View style={styles.classCardContent}>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{classItem.title}</Text>
                  <Text style={styles.classTime}>{classItem.time}</Text>
                  <Text style={styles.classTrainer}>with {classItem.trainer}</Text>
                </View>
                <TouchableOpacity 
                  style={classItem.isBooked ? styles.bookedButton : styles.joinButton}
                  onPress={() => bookClass(classItem.id)}
                >
                  {classItem.isBooked ? (
                    <BlurView intensity={10} style={styles.bookedButtonBlur}>
                      <Text style={styles.bookedButtonText}>Booked</Text>
                    </BlurView>
                  ) : (
                    <LinearGradient
                      colors={[currentColors.neonBlue, currentColors.neonPurple]}
                      style={styles.joinButtonGradient}
                    >
                      <Text style={styles.joinButtonText}>Join</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              </View>
            </BlurView>
          ))}
        </View>
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
    paddingBottom: 120, // Space for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    textShadowColor: Colors.dark.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  notificationBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.dark.accentSecondary,
    ...Shadows.neon,
  },
  streakBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  streakBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  streakIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  challengeContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  challengeBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 28,
  },
  challengeIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  challengeText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  challengeDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  challengeButton: {
    marginTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  challengeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  quickActionContainer: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickActionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  upcomingContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  seeAllText: {
    fontSize: 16,
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  classCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  classCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 16,
    color: Colors.dark.neonBlue,
    fontWeight: '500',
    marginBottom: 4,
  },
  classTrainer: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookedButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  bookedButtonBlur: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bookedButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
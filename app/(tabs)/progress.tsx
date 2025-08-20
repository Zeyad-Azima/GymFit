import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  TrendingUp, 
  Calendar, 
  Trophy,
  Target,
  Flame,
  Plus,
  Award,
  Activity
} from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const ProgressCard = ({ title, value, unit, change, gradient, icon: Icon, onPress }) => {
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
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <LinearGradient
              colors={gradient}
              style={styles.progressIcon}
            >
              <Icon size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.progressChange, { color: change > 0 ? '#10B981' : '#EF4444' }]}>
              {change > 0 ? '+' : ''}{change}%
            </Text>
          </View>
          <Text style={styles.progressValue}>{value}</Text>
          <Text style={styles.progressUnit}>{unit}</Text>
          <Text style={styles.progressTitle}>{title}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AchievementBadge = ({ achievement, onPress, currentColors }) => {
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
      onPress={() => onPress(achievement)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={achievement.isUnlocked ? 25 : 15} style={[styles.badge, !achievement.isUnlocked && styles.lockedBadge]}>
          {achievement.isUnlocked ? (
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.badgeIcon}
            >
              <achievement.icon size={20} color="#FFFFFF" />
            </LinearGradient>
          ) : (
            <View style={styles.lockedBadgeIcon}>
              <achievement.icon size={20} color={currentColors.textMuted} />
            </View>
          )}
          <Text style={[styles.badgeTitle, !achievement.isUnlocked && styles.lockedBadgeTitle]}>
            {achievement.title}
          </Text>
          <Text style={[styles.badgeDescription, !achievement.isUnlocked && styles.lockedBadgeDescription]}>
            {achievement.description}
          </Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProgressScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const { 
    user, 
    achievements, 
    activities, 
    isDarkMode, 
    viewAchievement, 
    startWorkout 
  } = useAppState();

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  const periods = ['Week', 'Month', 'Year'];

  const progressData = [
    {
      title: 'Workouts',
      value: user.stats.workouts.toString(),
      unit: 'sessions',
      change: 15,
      gradient: [currentColors.neonBlue, currentColors.neonPurple],
      icon: Activity,
    },
    {
      title: 'Calories',
      value: user.stats.calories.toLocaleString(),
      unit: 'burned',
      change: 8,
      gradient: [currentColors.neonGreen, currentColors.success],
      icon: Flame,
    },
    {
      title: 'Streak',
      value: user.stats.streak.toString(),
      unit: 'days',
      change: 0,
      gradient: [currentColors.neonYellow, currentColors.warning],
      icon: Target,
    },
  ];

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Progress</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => startWorkout('Custom Workout')}
            >
              <BlurView intensity={20} style={styles.addButtonBlur}>
                <Plus size={20} color={currentColors.neonBlue} />
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={styles.periodButton}
                onPress={() => setSelectedPeriod(period)}
              >
                {selectedPeriod === period ? (
                  <LinearGradient
                    colors={[currentColors.neonBlue, currentColors.neonPurple]}
                    style={styles.selectedPeriodGradient}
                  >
                    <Text style={styles.selectedPeriodButtonText}>{period}</Text>
                  </LinearGradient>
                ) : (
                  <BlurView intensity={15} style={styles.periodButtonBlur}>
                    <Text style={styles.periodButtonText}>{period}</Text>
                  </BlurView>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Progress Overview */}
          <View style={styles.progressOverview}>
            <Text style={styles.sectionTitle}>This {selectedPeriod}</Text>
            <View style={styles.progressGrid}>
              {progressData.map((item, index) => (
                <ProgressCard 
                  key={index} 
                  {...item} 
                  onPress={() => startWorkout(item.title)}
                />
              ))}
            </View>
          </View>

          {/* Weekly Goal */}
          <View style={styles.goalContainer}>
            <BlurView intensity={20} style={styles.goalBlur}>
              <LinearGradient
                colors={[currentColors.neonBlue, currentColors.neonPurple]}
                style={styles.goalCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.goalHeader}>
                  <Target size={24} color="#FFFFFF" />
                  <Text style={styles.goalTitle}>Weekly Goal</Text>
                </View>
                <Text style={styles.goalDescription}>
                  {user.stats.weeklyGoal.completed} out of {user.stats.weeklyGoal.target} workouts completed
                </Text>
                <View style={styles.goalProgress}>
                  <View style={styles.goalProgressBar}>
                    <View style={[styles.goalProgressFill, { width: `${(user.stats.weeklyGoal.completed / user.stats.weeklyGoal.target) * 100}%` }]} />
                  </View>
                  <Text style={styles.goalProgressText}>
                    {Math.round((user.stats.weeklyGoal.completed / user.stats.weeklyGoal.target) * 100)}%
                  </Text>
                </View>
              </LinearGradient>
            </BlurView>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <AchievementBadge 
                  key={achievement.id} 
                  achievement={achievement} 
                  onPress={viewAchievement}
                  currentColors={currentColors}
                />
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            
            {activities.slice(0, 5).map((activity) => (
              <BlurView key={activity.id} intensity={15} style={styles.activityItem}>
                <LinearGradient
                  colors={getActivityGradient(activity.type, currentColors)}
                  style={styles.activityIcon}
                >
                  <Activity size={16} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                {activity.value && (
                  <Text style={[styles.activityValue, { color: currentColors.neonGreen }]}>
                    {activity.value}
                  </Text>
                )}
              </BlurView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const getActivityGradient = (type, colors) => {
  const gradients = {
    'workout': [colors.neonBlue, colors.neonPurple],
    'achievement': [colors.neonGreen, colors.success],
    'class': [colors.neonPink, colors.accentSecondary],
    'goal': [colors.neonYellow, colors.warning],
  };
  return gradients[type] || [colors.neonBlue, colors.neonPurple];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: Colors.dark.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  addButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedPeriodGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  periodButtonBlur: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textMuted,
  },
  selectedPeriodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressOverview: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  progressGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  progressUnit: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '600',
  },
  goalContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  goalBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  goalCard: {
    padding: 24,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  goalDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  lockedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedBadgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  lockedBadgeTitle: {
    color: Colors.dark.textMuted,
  },
  badgeDescription: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  lockedBadgeDescription: {
    color: Colors.dark.textMuted,
  },
  activityContainer: {
    paddingHorizontal: 20,
    marginBottom: 120, // Space for tab bar
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activityTime: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  activityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.neonBlue,
  },
});
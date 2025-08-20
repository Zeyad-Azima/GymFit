import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Settings, CreditCard as Edit3, Trophy, Target, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Star, Calendar, Activity, X, Check } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const StatItem = ({ icon: Icon, value, label, gradient, onPress }) => {
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
        <BlurView intensity={20} style={styles.statItem}>
          <LinearGradient
            colors={gradient}
            style={styles.statIcon}
          >
            <Icon size={16} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MenuButton = ({ icon: Icon, title, subtitle, onPress, showChevron = true }) => {
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
        <BlurView intensity={15} style={styles.menuButton}>
          <LinearGradient
            colors={[Colors.dark.neonBlue, Colors.dark.neonPurple]}
            style={styles.menuIcon}
          >
            <Icon size={20} color="#FFFFFF" />
          </LinearGradient>
          <View style={styles.menuButtonContent}>
            <Text style={styles.menuButtonTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuButtonSubtitle}>{subtitle}</Text>}
          </View>
          {showChevron && <ChevronRight size={16} color={Colors.dark.textMuted} />}
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const [activeModal, setActiveModal] = React.useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  
  const { 
    user, 
    achievements, 
    activities, 
    isDarkMode, 
    signOut,
    viewAchievement 
  } = useAppState();

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const mockWorkoutHistory = [
    { id: 1, date: '2024-01-15', type: 'HIIT', duration: 45, calories: 320 },
    { id: 2, date: '2024-01-14', type: 'Strength', duration: 60, calories: 280 },
    { id: 3, date: '2024-01-13', type: 'Yoga', duration: 75, calories: 180 },
    { id: 4, date: '2024-01-12', type: 'Cardio', duration: 30, calories: 250 },
  ];

  const mockClassHistory = [
    { id: 1, name: 'Morning HIIT', trainer: 'Sarah Johnson', date: '2024-01-15', rating: 5 },
    { id: 2, name: 'Vinyasa Flow', trainer: 'Mike Chen', date: '2024-01-14', rating: 4 },
    { id: 3, name: 'Strength Training', trainer: 'David Wilson', date: '2024-01-13', rating: 5 },
  ];

  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={20} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: currentColors.text }]}>{activeModal}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={currentColors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {activeModal === 'Notifications' && (
                <View>
                  <BlurView intensity={15} style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: currentColors.text }]}>Push Notifications</Text>
                      <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
                        Receive workout reminders and updates
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setPushNotifications(!pushNotifications)}
                      style={[styles.toggle, pushNotifications && styles.toggleActive]}
                    >
                      {pushNotifications && (
                        <LinearGradient
                          colors={[currentColors.neonBlue, currentColors.neonPurple]}
                          style={styles.toggleGradient}
                        >
                          <Check size={16} color="#FFFFFF" />
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </BlurView>
                  
                  <BlurView intensity={15} style={styles.settingItem}>
                    <View style={styles.settingInfo}>
                      <Text style={[styles.settingTitle, { color: currentColors.text }]}>Email Notifications</Text>
                      <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>
                        Get weekly progress reports via email
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setEmailNotifications(!emailNotifications)}
                      style={[styles.toggle, emailNotifications && styles.toggleActive]}
                    >
                      {emailNotifications && (
                        <LinearGradient
                          colors={[currentColors.neonBlue, currentColors.neonPurple]}
                          style={styles.toggleGradient}
                        >
                          <Check size={16} color="#FFFFFF" />
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  </BlurView>
                </View>
              )}
              
              {activeModal === 'Workout History' && (
                <View>
                  {mockWorkoutHistory.map((workout) => (
                    <BlurView key={workout.id} intensity={15} style={styles.historyItem}>
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyTitle, { color: currentColors.text }]}>{workout.type} Workout</Text>
                        <Text style={[styles.historyDate, { color: currentColors.textSecondary }]}>{workout.date}</Text>
                      </View>
                      <View style={styles.historyStats}>
                        <Text style={[styles.historyStat, { color: currentColors.neonBlue }]}>{workout.duration}min</Text>
                        <Text style={[styles.historyStat, { color: currentColors.neonGreen }]}>{workout.calories}cal</Text>
                      </View>
                    </BlurView>
                  ))}
                </View>
              )}
              
              {activeModal === 'Class History' && (
                <View>
                  {mockClassHistory.map((classItem) => (
                    <BlurView key={classItem.id} intensity={15} style={styles.historyItem}>
                      <View style={styles.historyInfo}>
                        <Text style={[styles.historyTitle, { color: currentColors.text }]}>{classItem.name}</Text>
                        <Text style={[styles.historyDate, { color: currentColors.textSecondary }]}>
                          with {classItem.trainer} • {classItem.date}
                        </Text>
                      </View>
                      <View style={styles.ratingContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            color={i < classItem.rating ? currentColors.neonYellow : currentColors.textMuted}
                            fill={i < classItem.rating ? currentColors.neonYellow : 'transparent'}
                          />
                        ))}
                      </View>
                    </BlurView>
                  ))}
                </View>
              )}
              
              {activeModal === 'View Badges' && (
                <View style={styles.badgesGrid}>
                  {achievements.filter(a => a.isUnlocked).map((achievement) => (
                    <BlurView key={achievement.id} intensity={15} style={styles.badgeCard}>
                      <LinearGradient
                        colors={[currentColors.neonBlue, currentColors.neonPurple]}
                        style={styles.badgeIcon}
                      >
                        <achievement.icon size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={[styles.badgeTitle, { color: currentColors.text }]}>{achievement.title}</Text>
                      <Text style={[styles.badgeDescription, { color: currentColors.textSecondary }]}>
                        {achievement.description}
                      </Text>
                      <Text style={[styles.badgeDate, { color: currentColors.textMuted }]}>
                        Earned {achievement.earnedDate}
                      </Text>
                    </BlurView>
                  ))}
                </View>
              )}
              
              {activeModal === 'Rating Details' && (
                <View>
                  <BlurView intensity={15} style={styles.ratingOverview}>
                    <Text style={[styles.ratingTitle, { color: currentColors.text }]}>Overall Rating</Text>
                    <View style={styles.ratingDisplay}>
                      <Text style={[styles.ratingValue, { color: currentColors.text }]}>{user.stats.rating}</Text>
                      <View style={styles.starsContainer}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={20} 
                            color={i < Math.floor(user.stats.rating) ? currentColors.neonYellow : currentColors.textMuted}
                            fill={i < Math.floor(user.stats.rating) ? currentColors.neonYellow : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                  </BlurView>
                  
                  <Text style={[styles.ratingBreakdownTitle, { color: currentColors.text }]}>Rating Breakdown</Text>
                  
                  {[
                    { category: 'Workout Consistency', rating: 4.9 },
                    { category: 'Class Participation', rating: 4.8 },
                    { category: 'Goal Achievement', rating: 4.7 },
                    { category: 'Community Engagement', rating: 4.8 },
                  ].map((item, index) => (
                    <BlurView key={index} intensity={15} style={styles.ratingItem}>
                      <Text style={[styles.ratingCategory, { color: currentColors.text }]}>{item.category}</Text>
                      <View style={styles.ratingBar}>
                        <View style={styles.ratingBarBackground}>
                          <LinearGradient
                            colors={[currentColors.neonBlue, currentColors.neonPurple]}
                            style={[styles.ratingBarFill, { width: `${(item.rating / 5) * 100}%` }]}
                          />
                        </View>
                        <Text style={[styles.ratingNumber, { color: currentColors.textSecondary }]}>{item.rating}</Text>
                      </View>
                    </BlurView>
                  ))}
                </View>
              )}
              
              {activeModal === 'Help & Support' && (
                <View>
                  <BlurView intensity={15} style={styles.helpItem}>
                    <Text style={[styles.helpTitle, { color: currentColors.text }]}>Frequently Asked Questions</Text>
                    <Text style={[styles.helpDescription, { color: currentColors.textSecondary }]}>
                      Find answers to common questions about workouts, classes, and app features.
                    </Text>
                  </BlurView>
                  
                  <BlurView intensity={15} style={styles.helpItem}>
                    <Text style={[styles.helpTitle, { color: currentColors.text }]}>Contact Support</Text>
                    <Text style={[styles.helpDescription, { color: currentColors.textSecondary }]}>
                      Email: support@gymfit.com{'\n'}
                      Phone: 1-800-GYMFIT{'\n'}
                      Response time: 24 hours
                    </Text>
                  </BlurView>
                  
                  <TouchableOpacity style={styles.helpButton}>
                    <LinearGradient
                      colors={[currentColors.neonGreen, currentColors.success]}
                      style={styles.helpButtonGradient}
                    >
                      <Text style={styles.helpButtonText}>Start Live Chat</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </BlurView>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <BlurView intensity={20} style={styles.profileHeader}>
            <LinearGradient
              colors={[Colors.dark.neonBlue, Colors.dark.neonPurple]}
              style={styles.profileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileInfo}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={[currentColors.neonGreen, currentColors.success]}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>{user.name.split(' ').map(n => n[0]).join('')}</Text>
                  </LinearGradient>
                  <TouchableOpacity 
                    style={styles.editAvatarButton}
                    onPress={() => openModal('Edit Avatar')}
                  >
                    <BlurView intensity={20} style={styles.editAvatarBlur}>
                      <Edit3 size={12} color={currentColors.neonBlue} />
                    </BlurView>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={() => openModal('Edit Profile')}
              >
                <BlurView intensity={20} style={styles.editProfileBlur}>
                  <Edit3 size={16} color={currentColors.neonBlue} />
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </BlurView>
              </TouchableOpacity>
            </LinearGradient>
          </BlurView>

          {/* Stats Overview */}
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            <View style={styles.statsGrid}>
              <StatItem
                icon={Activity}
                value={user.stats.workouts.toString()}
                label="Workouts"
                gradient={[currentColors.neonBlue, currentColors.neonPurple]}
                onPress={() => openModal('Workout History')}
              />
              <StatItem
                icon={Calendar}
                value={user.stats.classesAttended.toString()}
                label="Classes"
                gradient={[currentColors.neonGreen, currentColors.success]}
                onPress={() => openModal('Class History')}
              />
              <StatItem
                icon={Trophy}
                value={user.stats.badges.toString()}
                label="Badges"
                gradient={[currentColors.neonYellow, currentColors.warning]}
                onPress={() => openModal('View Badges')}
              />
              <StatItem
                icon={Star}
                value={user.stats.rating.toString()}
                label="Rating"
                gradient={[currentColors.neonPink, currentColors.accentSecondary]}
                onPress={() => openModal('Rating Details')}
              />
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.achievementsPreview}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              <TouchableOpacity onPress={() => openModal('View Badges')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <BlurView intensity={15} style={styles.achievementsList}>
              {achievements.filter(a => a.isUnlocked).slice(0, 2).map((achievement, index) => (
                <TouchableOpacity 
                  key={achievement.id}
                  style={[styles.achievementItem, index === 0 && styles.achievementItemBorder]}
                  onPress={() => viewAchievement(achievement)}
                >
                  <LinearGradient
                    colors={[currentColors.neonBlue, currentColors.neonPurple]}
                    style={styles.achievementIcon}
                  >
                    <achievement.icon size={16} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDate}>Earned {achievement.earnedDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </BlurView>
          </View>

          {/* Menu Options */}
          <View style={styles.menuContainer}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            <MenuButton
              icon={Target}
              title="Fitness Goals"
              subtitle="Set and track your goals"
              onPress={() => router.push('/fitness-goals')}
            />
            
            <MenuButton
              icon={Bell}
              title="Notifications"
              subtitle="Manage your alerts"
              onPress={() => openModal('Notifications')}
            />
            
            <MenuButton
              icon={Shield}
              title="Privacy & Security"
              subtitle="Control your data"
              onPress={() => router.push('/privacy-security')}
            />
            
            <MenuButton
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get assistance"
              onPress={() => openModal('Help & Support')}
            />
          </View>

          {/* Sign Out */}
          <View style={styles.signOutContainer}>
            <MenuButton
              icon={LogOut}
              title="Sign Out"
              onPress={signOut}
              showChevron={false}
            />
          </View>
        </ScrollView>
        
        {renderModal()}
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
  profileHeader: {
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.neon,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  editAvatarBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editProfileButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editProfileBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.neonBlue,
  },
  statsContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  achievementsPreview: {
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
  achievementsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  achievementItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuButtonContent: {
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  menuButtonSubtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  signOutContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  // Notifications Modal
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: 'transparent',
  },
  toggleGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // History Modals
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
  },
  historyStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  historyStat: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  // Badges Modal
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDate: {
    fontSize: 11,
    textAlign: 'center',
  },
  // Rating Modal
  ratingOverview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingDisplay: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingBreakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  ratingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratingCategory: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingBarBackground: {
    width: 80,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ratingNumber: {
    fontSize: 14,
    fontWeight: '600',
    width: 30,
  },
  // Help Modal
  helpItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helpDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  helpButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  helpButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
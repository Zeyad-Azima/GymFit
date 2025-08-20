import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ArrowLeft, Target, Plus, CreditCard as Edit3, Trash2, Calendar, TrendingUp, Award, Clock, Flame, Activity, Dumbbell, Timer, X, Check } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const GoalCard = ({ goal, onEdit, onDelete, currentColors }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressPercentage = Math.min((goal.current / goal.target) * 100, 100);
  const isCompleted = goal.current >= goal.target;

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

  const getGoalIcon = (type) => {
    const icons = {
      'weight': Flame,
      'cardio': Activity,
      'strength': Dumbbell,
      'time': Timer,
      'frequency': Calendar,
      'general': Target
    };
    return icons[type] || Target;
  };

  const getGoalGradient = (type) => {
    const gradients = {
      'weight': [currentColors.neonPink, currentColors.accentSecondary],
      'cardio': [currentColors.neonGreen, currentColors.success],
      'strength': [currentColors.neonBlue, currentColors.neonPurple],
      'time': [currentColors.neonYellow, currentColors.warning],
      'frequency': [currentColors.accent, currentColors.accentSecondary],
      'general': [currentColors.neonBlue, currentColors.neonPurple]
    };
    return gradients[type] || [currentColors.neonBlue, currentColors.neonPurple];
  };

  const GoalIcon = getGoalIcon(goal.type);

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={[styles.goalCard, isCompleted && styles.completedGoalCard]}>
          <View style={styles.goalHeader}>
            <LinearGradient
              colors={getGoalGradient(goal.type)}
              style={styles.goalIcon}
            >
              <GoalIcon size={20} color="#FFFFFF" />
            </LinearGradient>
            
            <View style={styles.goalActions}>
              <TouchableOpacity style={styles.goalActionButton} onPress={() => onEdit(goal)}>
                <Edit3 size={16} color={currentColors.neonBlue} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.goalActionButton} onPress={() => onDelete(goal.id)}>
                <Trash2 size={16} color={currentColors.accentSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.goalTitle, { color: currentColors.text }]}>{goal.title}</Text>
          <Text style={[styles.goalDescription, { color: currentColors.textSecondary }]}>{goal.description}</Text>

          <View style={styles.goalProgress}>
            <View style={styles.goalProgressHeader}>
              <Text style={[styles.goalProgressText, { color: currentColors.text }]}>
                {goal.current} / {goal.target} {goal.unit}
              </Text>
              <Text style={[styles.goalProgressPercentage, { color: isCompleted ? currentColors.neonGreen : currentColors.neonBlue }]}>
                {Math.round(progressPercentage)}%
              </Text>
            </View>
            
            <View style={[styles.goalProgressBar, { backgroundColor: currentColors.glass }]}>
              <LinearGradient
                colors={isCompleted ? [currentColors.neonGreen, currentColors.success] : getGoalGradient(goal.type)}
                style={[styles.goalProgressFill, { width: `${progressPercentage}%` }]}
              />
            </View>
          </View>

          <View style={styles.goalMeta}>
            <View style={styles.goalMetaItem}>
              <Calendar size={14} color={currentColors.textMuted} />
              <Text style={[styles.goalMetaText, { color: currentColors.textMuted }]}>
                Due {goal.deadline}
              </Text>
            </View>
            <View style={styles.goalMetaItem}>
              <Clock size={14} color={currentColors.textMuted} />
              <Text style={[styles.goalMetaText, { color: currentColors.textMuted }]}>
                {goal.daysLeft} days left
              </Text>
            </View>
          </View>

          {isCompleted && (
            <View style={styles.completedBadge}>
              <LinearGradient
                colors={[currentColors.neonGreen, currentColors.success]}
                style={styles.completedBadgeGradient}
              >
                <Award size={16} color="#FFFFFF" />
                <Text style={styles.completedBadgeText}>Completed!</Text>
              </LinearGradient>
            </View>
          )}
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const AddGoalModal = ({ visible, onClose, onSave, currentColors }) => {
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    type: 'general',
    target: '',
    unit: '',
    deadline: '',
    current: 0
  });

  const goalTypes = [
    { id: 'weight', label: 'Weight Loss', icon: Flame, unit: 'lbs' },
    { id: 'cardio', label: 'Cardio', icon: Activity, unit: 'minutes' },
    { id: 'strength', label: 'Strength', icon: Dumbbell, unit: 'reps' },
    { id: 'time', label: 'Time Based', icon: Timer, unit: 'hours' },
    { id: 'frequency', label: 'Frequency', icon: Calendar, unit: 'times' },
    { id: 'general', label: 'General', icon: Target, unit: 'units' }
  ];

  const handleSave = () => {
    if (goalData.title && goalData.target && goalData.deadline) {
      const newGoal = {
        id: Date.now(),
        ...goalData,
        target: parseFloat(goalData.target),
        daysLeft: Math.ceil((new Date(goalData.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      };
      onSave(newGoal);
      setGoalData({
        title: '',
        description: '',
        type: 'general',
        target: '',
        unit: '',
        deadline: '',
        current: 0
      });
      onClose();
    }
  };

  const updateGoalData = (field, value) => {
    setGoalData(prev => ({ ...prev, [field]: value }));
  };

  const selectGoalType = (type) => {
    const selectedType = goalTypes.find(t => t.id === type);
    updateGoalData('type', type);
    updateGoalData('unit', selectedType.unit);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.addGoalModal}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Add New Goal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Goal Type Selection */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Goal Type</Text>
            <View style={styles.goalTypesGrid}>
              {goalTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={styles.goalTypeButton}
                    onPress={() => selectGoalType(type.id)}
                  >
                    {goalData.type === type.id ? (
                      <LinearGradient
                        colors={[currentColors.accent, currentColors.accentSecondary]}
                        style={styles.selectedGoalType}
                      >
                        <TypeIcon size={20} color="#FFFFFF" />
                        <Text style={styles.selectedGoalTypeText}>{type.label}</Text>
                      </LinearGradient>
                    ) : (
                      <BlurView intensity={15} style={styles.goalTypeBlur}>
                        <TypeIcon size={20} color={currentColors.textMuted} />
                        <Text style={[styles.goalTypeText, { color: currentColors.textMuted }]}>{type.label}</Text>
                      </BlurView>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Goal Title */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Goal Title</Text>
            <BlurView intensity={15} style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, { color: currentColors.text }]}
                placeholder="e.g., Lose 10 pounds"
                placeholderTextColor={currentColors.textMuted}
                value={goalData.title}
                onChangeText={(value) => updateGoalData('title', value)}
              />
            </BlurView>

            {/* Goal Description */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Description (Optional)</Text>
            <BlurView intensity={15} style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, { color: currentColors.text }]}
                placeholder="Add more details about your goal"
                placeholderTextColor={currentColors.textMuted}
                value={goalData.description}
                onChangeText={(value) => updateGoalData('description', value)}
                multiline
              />
            </BlurView>

            {/* Target Value */}
            <View style={styles.targetContainer}>
              <View style={styles.targetInputGroup}>
                <Text style={[styles.inputLabel, { color: currentColors.text }]}>Target</Text>
                <BlurView intensity={15} style={styles.targetInputContainer}>
                  <TextInput
                    style={[styles.textInput, { color: currentColors.text }]}
                    placeholder="0"
                    placeholderTextColor={currentColors.textMuted}
                    value={goalData.target}
                    onChangeText={(value) => updateGoalData('target', value)}
                    keyboardType="numeric"
                  />
                </BlurView>
              </View>
              
              <View style={styles.unitInputGroup}>
                <Text style={[styles.inputLabel, { color: currentColors.text }]}>Unit</Text>
                <BlurView intensity={15} style={styles.unitInputContainer}>
                  <TextInput
                    style={[styles.textInput, { color: currentColors.text }]}
                    placeholder="units"
                    placeholderTextColor={currentColors.textMuted}
                    value={goalData.unit}
                    onChangeText={(value) => updateGoalData('unit', value)}
                  />
                </BlurView>
              </View>
            </View>

            {/* Deadline */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Deadline</Text>
            <BlurView intensity={15} style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, { color: currentColors.text }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={currentColors.textMuted}
                value={goalData.deadline}
                onChangeText={(value) => updateGoalData('deadline', value)}
              />
            </BlurView>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveGoalButton} onPress={handleSave}>
              <LinearGradient
                colors={[currentColors.accent, currentColors.accentSecondary]}
                style={styles.saveGoalGradient}
              >
                <Text style={styles.saveGoalText}>Create Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

const EditGoalModal = ({ visible, goal, onClose, onSave, currentColors }) => {
  const [editData, setEditData] = useState({
    current: goal?.current?.toString() || '0'
  });

  useEffect(() => {
    if (goal) {
      setEditData({ current: goal.current.toString() });
    }
  }, [goal]);

  const handleSave = () => {
    if (goal && editData.current) {
      onSave(goal.id, parseFloat(editData.current));
      onClose();
    }
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.editGoalModal}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Update Progress</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.editGoalContent}>
            <Text style={[styles.editGoalTitle, { color: currentColors.text }]}>{goal.title}</Text>
            <Text style={[styles.editGoalTarget, { color: currentColors.textSecondary }]}>
              Target: {goal.target} {goal.unit}
            </Text>

            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Current Progress</Text>
            <BlurView intensity={15} style={styles.progressInputContainer}>
              <TextInput
                style={[styles.progressInput, { color: currentColors.text }]}
                placeholder="0"
                placeholderTextColor={currentColors.textMuted}
                value={editData.current}
                onChangeText={(value) => setEditData({ current: value })}
                keyboardType="numeric"
              />
              <Text style={[styles.progressUnit, { color: currentColors.textSecondary }]}>{goal.unit}</Text>
            </BlurView>

            <TouchableOpacity style={styles.updateButton} onPress={handleSave}>
              <LinearGradient
                colors={[currentColors.accent, currentColors.accentSecondary]}
                style={styles.updateButtonGradient}
              >
                <Text style={styles.updateButtonText}>Update Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default function FitnessGoalsScreen() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Lose Weight',
      description: 'Reach my target weight for summer',
      type: 'weight',
      target: 15,
      current: 8,
      unit: 'lbs',
      deadline: '2024-06-01',
      daysLeft: 120,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Run 5K Under 25 Minutes',
      description: 'Improve my cardio endurance',
      type: 'cardio',
      target: 25,
      current: 28,
      unit: 'minutes',
      deadline: '2024-04-01',
      daysLeft: 75,
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Workout Consistency',
      description: 'Maintain regular workout schedule',
      type: 'frequency',
      target: 5,
      current: 4,
      unit: 'times/week',
      deadline: '2024-12-31',
      daysLeft: 350,
      createdAt: '2024-01-01'
    },
    {
      id: 4,
      title: 'Bench Press 200lbs',
      description: 'Increase my maximum bench press',
      type: 'strength',
      target: 200,
      current: 165,
      unit: 'lbs',
      deadline: '2024-08-01',
      daysLeft: 180,
      createdAt: '2024-01-05'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { isDarkMode } = useAppState();
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

  const addGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const editGoal = (goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  };

  const updateGoalProgress = (goalId, newCurrent) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: newCurrent }
        : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const filters = [
    { id: 'all', label: 'All Goals' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'overdue', label: 'Overdue' }
  ];

  const filteredGoals = goals.filter(goal => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'active') return goal.current < goal.target && goal.daysLeft > 0;
    if (selectedFilter === 'completed') return goal.current >= goal.target;
    if (selectedFilter === 'overdue') return goal.daysLeft < 0 && goal.current < goal.target;
    return true;
  });

  const completedGoals = goals.filter(goal => goal.current >= goal.target).length;
  const totalGoals = goals.length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

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
            <Text style={[styles.headerTitle, { color: currentColors.text }]}>Fitness Goals</Text>
            <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary }]}>
              Track your progress and achieve your dreams
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <LinearGradient
              colors={[currentColors.accent, currentColors.accentSecondary]}
              style={styles.addButtonGradient}
            >
              <Plus size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Overall Progress */}
        <Animated.View
          style={[
            styles.overallProgressContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <BlurView intensity={20} style={[styles.overallProgressCard, { backgroundColor: currentColors.glass }]}>
            <LinearGradient
              colors={[currentColors.accent, currentColors.accentSecondary]}
              style={styles.overallProgressGradient}
            >
              <View style={styles.overallProgressHeader}>
                <TrendingUp size={24} color="#FFFFFF" />
                <Text style={styles.overallProgressTitle}>Overall Progress</Text>
              </View>
              
              <View style={styles.overallProgressStats}>
                <Text style={styles.overallProgressValue}>{Math.round(overallProgress)}%</Text>
                <Text style={styles.overallProgressDescription}>
                  {completedGoals} of {totalGoals} goals completed
                </Text>
              </View>

              <View style={styles.overallProgressBar}>
                <View style={styles.overallProgressBarFill}>
                  <View style={[styles.overallProgressBarActive, { width: `${overallProgress}%` }]} />
                </View>
              </View>
            </LinearGradient>
          </BlurView>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View
          style={[
            styles.filterContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={styles.filterButton}
                onPress={() => setSelectedFilter(filter.id)}
              >
                {selectedFilter === filter.id ? (
                  <LinearGradient
                    colors={[currentColors.accent, currentColors.accentSecondary]}
                    style={styles.selectedFilterGradient}
                  >
                    <Text style={styles.selectedFilterText}>{filter.label}</Text>
                  </LinearGradient>
                ) : (
                  <BlurView intensity={15} style={[styles.filterBlur, { backgroundColor: currentColors.glass }]}>
                    <Text style={[styles.filterText, { color: currentColors.textMuted }]}>{filter.label}</Text>
                  </BlurView>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Goals List */}
        <ScrollView 
          style={styles.goalsList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.goalsListContent}
        >
          <Animated.View
            style={[
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            {filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={editGoal}
                  onDelete={deleteGoal}
                  currentColors={currentColors}
                />
              ))
            ) : (
              <BlurView intensity={20} style={[styles.emptyState, { backgroundColor: currentColors.glass }]}>
                <LinearGradient
                  colors={[currentColors.textMuted + '40', currentColors.textMuted + '20']}
                  style={styles.emptyStateIcon}
                >
                  <Target size={32} color={currentColors.textMuted} />
                </LinearGradient>
                <Text style={[styles.emptyStateTitle, { color: currentColors.text }]}>No Goals Found</Text>
                <Text style={[styles.emptyStateDescription, { color: currentColors.textSecondary }]}>
                  {selectedFilter === 'all' 
                    ? 'Start by creating your first fitness goal'
                    : `No ${selectedFilter} goals to display`
                  }
                </Text>
                {selectedFilter === 'all' && (
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={() => setShowAddModal(true)}
                  >
                    <LinearGradient
                      colors={[currentColors.accent, currentColors.accentSecondary]}
                      style={styles.emptyStateButtonGradient}
                    >
                      <Plus size={16} color="#FFFFFF" />
                      <Text style={styles.emptyStateButtonText}>Add Your First Goal</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </BlurView>
            )}
          </Animated.View>
        </ScrollView>

        {/* Modals */}
        <AddGoalModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={addGoal}
          currentColors={currentColors}
        />

        <EditGoalModal
          visible={showEditModal}
          goal={editingGoal}
          onClose={() => {
            setShowEditModal(false);
            setEditingGoal(null);
          }}
          onSave={updateGoalProgress}
          currentColors={currentColors}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallProgressContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  overallProgressCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  overallProgressGradient: {
    padding: 24,
  },
  overallProgressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  overallProgressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  overallProgressStats: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallProgressValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  overallProgressDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  overallProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallProgressBarActive: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  filterScrollContent: {
    gap: 12,
  },
  filterButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedFilterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterBlur: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalsList: {
    flex: 1,
  },
  goalsListContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  completedGoalCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    ...Shadows.neon,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  goalActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  goalProgress: {
    marginBottom: 16,
  },
  goalProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgressText: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalProgressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  goalMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  goalMetaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completedBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addGoalModal: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  editGoalModal: {
    width: '90%',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 24,
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  goalTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  goalTypeButton: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  selectedGoalType: {
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  goalTypeBlur: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  selectedGoalTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  goalTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  textInput: {
    padding: 16,
    fontSize: 16,
  },
  targetContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  targetInputGroup: {
    flex: 2,
  },
  unitInputGroup: {
    flex: 1,
  },
  targetInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  unitInputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveGoalButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
  },
  saveGoalGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveGoalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Edit Goal Modal
  editGoalContent: {
    padding: 24,
  },
  editGoalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  editGoalTarget: {
    fontSize: 16,
    marginBottom: 24,
  },
  progressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  progressInput: {
    flex: 1,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  progressUnit: {
    paddingRight: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  updateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  updateButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
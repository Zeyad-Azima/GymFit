import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Calendar, Clock, MapPin, Users, Filter } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const ClassCard = ({ classItem, onBook, currentColors }) => {
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={styles.classCard}>
          <View style={styles.classHeader}>
            <LinearGradient
              colors={getTypeGradient(classItem.type, currentColors)}
              style={styles.classTypeTag}
            >
              <Text style={styles.classTypeText}>{classItem.type}</Text>
            </LinearGradient>
            <View style={styles.classSpots}>
              <Users size={14} color={currentColors.neonBlue} />
              <Text style={styles.spotsText}>{classItem.spots} spots left</Text>
            </View>
          </View>
          
          <Text style={styles.classTitle}>{classItem.title}</Text>
          <Text style={styles.classTrainer}>with {classItem.trainer}</Text>
          
          <View style={styles.classDetails}>
            <View style={styles.detailItem}>
              <Clock size={16} color={currentColors.neonBlue} />
              <Text style={styles.detailText}>{classItem.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={16} color={currentColors.neonBlue} />
              <Text style={styles.detailText}>{classItem.duration}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.bookButton, 
              classItem.isBooked && styles.bookedButton
            ]}
            onPress={() => onBook(classItem.id)}
          >
            {classItem.isBooked ? (
              <BlurView intensity={10} style={styles.bookedButtonBlur}>
                <Text style={styles.bookedButtonText}>Booked</Text>
              </BlurView>
            ) : (
              <LinearGradient
                colors={[currentColors.neonBlue, currentColors.neonPurple]}
                style={styles.bookButtonGradient}
              >
                <Text style={styles.bookButtonText}>Book Class</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const getTypeGradient = (type, colors) => {
  const gradients = {
    'HIIT': [colors.neonBlue, colors.neonPurple],
    'Yoga': [colors.neonGreen, colors.success],
    'Strength': [colors.neonPink, colors.accentSecondary],
    'Cardio': [colors.neonYellow, colors.warning],
  };
  return gradients[type] || [colors.neonBlue, colors.neonPurple];
};

export default function ClassesScreen() {
  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { classes, bookClass, isDarkMode } = useAppState();

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
  const filters = ['All', 'HIIT', 'Yoga', 'Strength', 'Cardio'];

  const filteredClasses = classes.filter(cls => 
    selectedFilter === 'All' || cls.type === selectedFilter
  );

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gym Classes</Text>
          <TouchableOpacity style={styles.filterButton}>
            <BlurView intensity={20} style={styles.filterButtonBlur}>
              <Filter size={20} color={currentColors.neonBlue} />
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daySelector}
          contentContainerStyle={styles.daySelectorContent}
        >
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDayButton
              ]}
              onPress={() => setSelectedDay(day)}
            >
              {selectedDay === day ? (
                <LinearGradient
                  colors={[currentColors.neonBlue, currentColors.neonPurple]}
                  style={styles.selectedDayGradient}
                >
                  <Text style={styles.selectedDayButtonText}>{day}</Text>
                </LinearGradient>
              ) : (
                <BlurView intensity={15} style={styles.dayButtonBlur}>
                  <Text style={styles.dayButtonText}>{day}</Text>
                </BlurView>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterSelector}
          contentContainerStyle={styles.filterSelectorContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={styles.filterTab}
              onPress={() => setSelectedFilter(filter)}
            >
              <BlurView 
                intensity={selectedFilter === filter ? 25 : 15} 
                style={[
                  styles.filterTabBlur,
                  selectedFilter === filter && styles.selectedFilterTabBlur
                ]}
              >
                <Text style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.selectedFilterTabText
                ]}>
                  {filter}
                </Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Classes List */}
        <ScrollView style={styles.classesList} showsVerticalScrollIndicator={false}>
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onBook={bookClass}
              currentColors={currentColors}
            />
          ))}
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  filterButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  daySelector: {
    marginBottom: 16,
  },
  daySelectorContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedDayButton: {
    ...Shadows.neon,
  },
  selectedDayGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dayButtonBlur: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
  },
  selectedDayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  filterSelector: {
    marginBottom: 20,
  },
  filterSelectorContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterTab: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  filterTabBlur: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedFilterTabBlur: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.dark.textMuted,
  },
  selectedFilterTabText: {
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  classesList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for tab bar
  },
  classCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Shadows.glass,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  classTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  classTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  classSpots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  spotsText: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  classTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  classTrainer: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
  },
  classDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bookedButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookedButtonBlur: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bookedButtonText: {
    color: Colors.dark.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
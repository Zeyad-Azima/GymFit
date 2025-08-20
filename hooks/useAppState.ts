import { useState, useEffect } from 'react';
import { mockData } from '@/data/mockData';

export const useAppState = () => {
  const [user, setUser] = useState(mockData.user);
  const [classes, setClasses] = useState(mockData.classes);
  const [trainers, setTrainers] = useState(mockData.trainers);
  const [messages, setMessages] = useState(mockData.messages);
  const [achievements, setAchievements] = useState(mockData.achievements);
  const [activities, setActivities] = useState(mockData.activities);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const bookClass = (classId: number) => {
    setClasses(prev => prev.map(cls => 
      cls.id === classId 
        ? { ...cls, isBooked: !cls.isBooked, spots: cls.isBooked ? cls.spots + 1 : cls.spots - 1 }
        : cls
    ));
    
    // Class booking logic without alerts
  };

  const completeChallenge = () => {
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        xp: prev.stats.xp + 50,
        challengesCompleted: prev.stats.challengesCompleted + 1,
      }
    }));
  };

  const sendMessage = (trainerId: number, message: string) => {
    const newMessage = {
      id: Date.now(),
      trainerId,
      message,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate trainer response
    setTimeout(() => {
      const responses = [
        "Thanks for reaching out! I'll get back to you soon.",
        "Great question! Let me help you with that.",
        "I appreciate your dedication to fitness!",
        "That's a fantastic goal! Let's work on it together.",
      ];
      
      const trainerResponse = {
        id: Date.now() + 1,
        trainerId,
        message: responses[Math.floor(Math.random() * responses.length)],
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, trainerResponse]);
    }, 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const viewAchievement = (achievement: any) => {
    setSelectedAchievement(achievement);
  };

  const startWorkout = (type: string) => {
    const workout = {
      type,
      startTime: new Date(),
      exercises: [],
    };
    
    setCurrentWorkout(workout);
    setWorkoutInProgress(true);
  };

  const endWorkout = () => {
    if (currentWorkout) {
      const duration = Math.floor((new Date().getTime() - currentWorkout.startTime.getTime()) / 1000 / 60);
      const calories = Math.floor(duration * 8); // Rough calculation
      
      // Add to activities
      const newActivity = {
        id: Date.now(),
        type: 'workout',
        title: `${currentWorkout.type} completed`,
        time: 'Just now',
        value: `+${calories} cal`,
        icon: 'Activity',
      };
      
      setActivities(prev => [newActivity, ...prev]);
      
      // Update user stats
      setUser(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          workouts: prev.stats.workouts + 1,
          calories: prev.stats.calories + calories,
          xp: prev.stats.xp + 25,
        }
      }));
      
      setWorkoutInProgress(false);
      setCurrentWorkout(null);
    }
  };

  const callTrainer = (trainerId: number) => {
    // Call trainer logic without alerts
  };

  const videoCallTrainer = (trainerId: number) => {
    // Video call trainer logic without alerts
  };

  const openSettings = (settingType: string) => {
    // Settings logic without alerts
  };

  const signOut = () => {
    // Sign out logic without alerts
  };

  return {
    user,
    classes,
    trainers,
    messages,
    achievements,
    activities,
    isDarkMode,
    selectedAchievement,
    workoutInProgress,
    currentWorkout,
    bookClass,
    completeChallenge,
    sendMessage,
    toggleTheme,
    viewAchievement,
    startWorkout,
    endWorkout,
    callTrainer,
    videoCallTrainer,
    openSettings,
    signOut,
  };
};
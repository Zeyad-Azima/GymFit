import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Search, MessageCircle, Send, Phone, Video, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const TrainerCard = ({ trainer, onPress, currentColors }) => {
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
      onPress={() => onPress(trainer)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={styles.trainerCard}>
          <View style={styles.trainerAvatar}>
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.trainerAvatarGradient}
            >
              <Text style={styles.trainerInitials}>{trainer.name.split(' ').map(n => n[0]).join('')}</Text>
            </LinearGradient>
            <View style={[styles.statusDot, { backgroundColor: trainer.status === 'online' ? currentColors.neonGreen : currentColors.textMuted }]} />
          </View>
          
          <View style={styles.trainerInfo}>
            <View style={styles.trainerHeader}>
              <Text style={styles.trainerName}>{trainer.name}</Text>
              <Text style={styles.messageTime}>{trainer.time}</Text>
            </View>
            <Text style={styles.trainerSpecialty}>{trainer.specialty}</Text>
            <Text style={[styles.lastMessage, trainer.unread && styles.unreadMessage]} numberOfLines={1}>
              {trainer.lastMessage}
            </Text>
          </View>
          
          {trainer.unread && (
            <View style={styles.unreadBadge}>
              <LinearGradient
                colors={[currentColors.accentSecondary, currentColors.neonPink]}
                style={styles.unreadBadgeGradient}
              />
            </View>
          )}
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const MessageBubble = ({ message, isUser, time, currentColors }) => (
  <View style={[styles.messageBubble, isUser ? styles.userMessage : styles.trainerMessage]}>
    {isUser ? (
      <LinearGradient
        colors={[currentColors.neonBlue, currentColors.neonPurple]}
        style={styles.userMessageGradient}
      >
        <Text style={styles.userMessageText}>{message}</Text>
        <Text style={styles.userMessageTime}>{time}</Text>
      </LinearGradient>
    ) : (
      <BlurView intensity={15} style={styles.trainerMessageBlur}>
        <Text style={styles.trainerMessageText}>{message}</Text>
        <Text style={styles.trainerMessageTime}>{time}</Text>
      </BlurView>
    )}
  </View>
);

export default function ChatScreen() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [messageText, setMessageText] = useState('');
  const { 
    trainers, 
    messages, 
    sendMessage, 
    callTrainer, 
    videoCallTrainer, 
    isDarkMode 
  } = useAppState();

  const currentColors = isDarkMode ? Colors.dark : Colors.light;
  const currentGradients = isDarkMode ? Gradients.dark : Gradients.light;

  const trainerMessages = messages.filter(msg => msg.trainerId === selectedTrainer?.id);

  const handleSendMessage = () => {
    if (messageText.trim() && selectedTrainer) {
      sendMessage(selectedTrainer.id, messageText.trim());
      setMessageText('');
    }
  };

  if (selectedTrainer) {
    return (
      <LinearGradient colors={currentGradients} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {/* Chat Header */}
          <BlurView intensity={20} style={styles.chatHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedTrainer(null)}
            >
              <Text style={styles.backButtonText}>‹ Back</Text>
            </TouchableOpacity>
            
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{selectedTrainer.name}</Text>
              <Text style={[
                styles.chatHeaderStatus,
                { color: selectedTrainer.status === 'online' ? currentColors.neonGreen : currentColors.textMuted }
              ]}>
                {selectedTrainer.status === 'online' ? 'Online' : 'Offline'}
              </Text>
            </View>
            
            <View style={styles.chatActions}>
              <TouchableOpacity 
                style={styles.chatActionButton}
                onPress={() => callTrainer(selectedTrainer.id)}
              >
                <BlurView intensity={15} style={styles.chatActionBlur}>
                  <Phone size={20} color={currentColors.neonBlue} />
                </BlurView>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.chatActionButton}
                onPress={() => videoCallTrainer(selectedTrainer.id)}
              >
                <BlurView intensity={15} style={styles.chatActionBlur}>
                  <Video size={20} color={currentColors.neonBlue} />
                </BlurView>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Messages */}
          <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
            {trainerMessages.map((msg) => (
              <MessageBubble key={msg.id} {...msg} currentColors={currentColors} />
            ))}
          </ScrollView>

          {/* Message Input */}
          <BlurView intensity={20} style={styles.messageInputContainer}>
            <BlurView intensity={15} style={styles.messageInputBlur}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type a message..."
                placeholderTextColor={currentColors.textMuted}
                value={messageText}
                onChangeText={setMessageText}
                multiline
              />
            </BlurView>
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <LinearGradient
                colors={[currentColors.neonBlue, currentColors.neonPurple]}
                style={styles.sendButtonGradient}
              >
                <Send size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={currentGradients} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat with Trainers</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <BlurView intensity={20} style={styles.searchBar}>
            <Search size={20} color={currentColors.neonBlue} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trainers..."
              placeholderTextColor={currentColors.textMuted}
            />
          </BlurView>
        </View>

        {/* Trainers List */}
        <ScrollView style={styles.trainersList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Available Trainers</Text>
          
          {trainers.map((trainer) => (
            <TrainerCard
              key={trainer.id}
              trainer={trainer}
              onPress={setSelectedTrainer}
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  trainersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for tab bar
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  trainerAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  trainerAvatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerInitials: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  trainerInfo: {
    flex: 1,
  },
  trainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  trainerSpecialty: {
    fontSize: 12,
    color: Colors.dark.neonBlue,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  unreadMessage: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    overflow: 'hidden',
  },
  unreadBadgeGradient: {
    flex: 1,
  },
  // Chat Screen Styles
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.dark.neonBlue,
    fontWeight: '600',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chatHeaderStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
  },
  chatActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  chatActionBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  trainerMessage: {
    alignSelf: 'flex-start',
  },
  userMessageGradient: {
    padding: 16,
  },
  trainerMessageBlur: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  trainerMessageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  userMessageTime: {
    fontSize: 11,
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  trainerMessageTime: {
    fontSize: 11,
    marginTop: 4,
    color: Colors.dark.textMuted,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  messageInputBlur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
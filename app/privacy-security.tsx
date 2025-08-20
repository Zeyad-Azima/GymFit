import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { 
  ArrowLeft, 
  Shield, 
  Download, 
  Lock, 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw,
  Check,
  X,
  FileText,
  Database,
  Settings,
  Smartphone
} from 'lucide-react-native';
import { Colors, Gradients, Shadows } from '@/constants/Colors';
import { useAppState } from '@/hooks/useAppState';

const SecurityCard = ({ icon: Icon, title, description, action, onPress, currentColors, status }) => {
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={[styles.securityCard, { backgroundColor: currentColors.glass }]}>
          <View style={styles.securityCardHeader}>
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.securityIcon}
            >
              <Icon size={20} color="#FFFFFF" />
            </LinearGradient>
            
            <View style={styles.securityInfo}>
              <Text style={[styles.securityTitle, { color: currentColors.text }]}>{title}</Text>
              <Text style={[styles.securityDescription, { color: currentColors.textSecondary }]}>{description}</Text>
            </View>

            {status && (
              <View style={[styles.statusBadge, { backgroundColor: status === 'active' ? currentColors.neonGreen : currentColors.textMuted }]}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.securityAction} onPress={onPress}>
            <LinearGradient
              colors={[currentColors.accent, currentColors.accentSecondary]}
              style={styles.securityActionGradient}
            >
              <Text style={styles.securityActionText}>{action}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const DataCard = ({ icon: Icon, title, description, size, onDownload, currentColors }) => {
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
      onPress={onDownload}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} style={[styles.dataCard, { backgroundColor: currentColors.glass }]}>
          <LinearGradient
            colors={[currentColors.neonGreen, currentColors.success]}
            style={styles.dataIcon}
          >
            <Icon size={20} color="#FFFFFF" />
          </LinearGradient>
          
          <View style={styles.dataInfo}>
            <Text style={[styles.dataTitle, { color: currentColors.text }]}>{title}</Text>
            <Text style={[styles.dataDescription, { color: currentColors.textSecondary }]}>{description}</Text>
            <Text style={[styles.dataSize, { color: currentColors.textMuted }]}>{size}</Text>
          </View>

          <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
            <LinearGradient
              colors={[currentColors.neonBlue, currentColors.neonPurple]}
              style={styles.downloadButtonGradient}
            >
              <Download size={16} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ChangePasswordModal = ({ visible, onClose, currentColors }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPasswords({ current: '', new: '', confirm: '' });
      onClose();
      Alert.alert('Success', 'Password changed successfully');
    }, 2000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={[styles.passwordModal, { backgroundColor: currentColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Change Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Current Password */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Current Password</Text>
            <BlurView intensity={15} style={[styles.passwordInputContainer, { backgroundColor: currentColors.glass }]}>
              <Lock size={20} color={currentColors.neonBlue} style={styles.inputIcon} />
              <TextInput
                style={[styles.passwordInput, { color: currentColors.text }]}
                placeholder="Enter current password"
                placeholderTextColor={currentColors.textMuted}
                value={passwords.current}
                onChangeText={(value) => setPasswords(prev => ({ ...prev, current: value }))}
                secureTextEntry={!showPasswords.current}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('current')}>
                {showPasswords.current ? (
                  <EyeOff size={20} color={currentColors.textMuted} />
                ) : (
                  <Eye size={20} color={currentColors.textMuted} />
                )}
              </TouchableOpacity>
            </BlurView>

            {/* New Password */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>New Password</Text>
            <BlurView intensity={15} style={[styles.passwordInputContainer, { backgroundColor: currentColors.glass }]}>
              <Lock size={20} color={currentColors.neonBlue} style={styles.inputIcon} />
              <TextInput
                style={[styles.passwordInput, { color: currentColors.text }]}
                placeholder="Enter new password"
                placeholderTextColor={currentColors.textMuted}
                value={passwords.new}
                onChangeText={(value) => setPasswords(prev => ({ ...prev, new: value }))}
                secureTextEntry={!showPasswords.new}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('new')}>
                {showPasswords.new ? (
                  <EyeOff size={20} color={currentColors.textMuted} />
                ) : (
                  <Eye size={20} color={currentColors.textMuted} />
                )}
              </TouchableOpacity>
            </BlurView>

            {/* Confirm Password */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Confirm New Password</Text>
            <BlurView intensity={15} style={[styles.passwordInputContainer, { backgroundColor: currentColors.glass }]}>
              <Lock size={20} color={currentColors.neonBlue} style={styles.inputIcon} />
              <TextInput
                style={[styles.passwordInput, { color: currentColors.text }]}
                placeholder="Confirm new password"
                placeholderTextColor={currentColors.textMuted}
                value={passwords.confirm}
                onChangeText={(value) => setPasswords(prev => ({ ...prev, confirm: value }))}
                secureTextEntry={!showPasswords.confirm}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility('confirm')}>
                {showPasswords.confirm ? (
                  <EyeOff size={20} color={currentColors.textMuted} />
                ) : (
                  <Eye size={20} color={currentColors.textMuted} />
                )}
              </TouchableOpacity>
            </BlurView>

            {/* Password Requirements */}
            <BlurView intensity={15} style={[styles.requirementsCard, { backgroundColor: currentColors.glass }]}>
              <Text style={[styles.requirementsTitle, { color: currentColors.text }]}>Password Requirements</Text>
              <View style={styles.requirementsList}>
                <View style={styles.requirementItem}>
                  <Check size={14} color={currentColors.neonGreen} />
                  <Text style={[styles.requirementText, { color: currentColors.textSecondary }]}>At least 8 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Check size={14} color={currentColors.neonGreen} />
                  <Text style={[styles.requirementText, { color: currentColors.textSecondary }]}>One uppercase letter</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Check size={14} color={currentColors.neonGreen} />
                  <Text style={[styles.requirementText, { color: currentColors.textSecondary }]}>One number</Text>
                </View>
              </View>
            </BlurView>

            <TouchableOpacity style={styles.savePasswordButton} onPress={handleSave}>
              <LinearGradient
                colors={[currentColors.accent, currentColors.accentSecondary]}
                style={styles.savePasswordGradient}
              >
                <Text style={styles.savePasswordText}>
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

const ChangeEmailModal = ({ visible, onClose, currentColors }) => {
  const [emailData, setEmailData] = useState({
    current: 'alex.thompson@university.edu',
    new: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEmailData({ current: emailData.new, new: '', password: '' });
      onClose();
      Alert.alert('Success', 'Email changed successfully. Please verify your new email address.');
    }, 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={[styles.emailModal, { backgroundColor: currentColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Change Email</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Current Email */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Current Email</Text>
            <BlurView intensity={15} style={[styles.emailInputContainer, { backgroundColor: currentColors.glass }]}>
              <Mail size={20} color={currentColors.textMuted} style={styles.inputIcon} />
              <Text style={[styles.currentEmailText, { color: currentColors.textMuted }]}>{emailData.current}</Text>
            </BlurView>

            {/* New Email */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>New Email</Text>
            <BlurView intensity={15} style={[styles.emailInputContainer, { backgroundColor: currentColors.glass }]}>
              <Mail size={20} color={currentColors.neonBlue} style={styles.inputIcon} />
              <TextInput
                style={[styles.emailInput, { color: currentColors.text }]}
                placeholder="Enter new email address"
                placeholderTextColor={currentColors.textMuted}
                value={emailData.new}
                onChangeText={(value) => setEmailData(prev => ({ ...prev, new: value }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </BlurView>

            {/* Password Confirmation */}
            <Text style={[styles.inputLabel, { color: currentColors.text }]}>Confirm with Password</Text>
            <BlurView intensity={15} style={[styles.emailInputContainer, { backgroundColor: currentColors.glass }]}>
              <Lock size={20} color={currentColors.neonBlue} style={styles.inputIcon} />
              <TextInput
                style={[styles.emailInput, { color: currentColors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={currentColors.textMuted}
                value={emailData.password}
                onChangeText={(value) => setEmailData(prev => ({ ...prev, password: value }))}
                secureTextEntry={true}
              />
            </BlurView>

            <TouchableOpacity style={styles.saveEmailButton} onPress={handleSave}>
              <LinearGradient
                colors={[currentColors.accent, currentColors.accentSecondary]}
                style={styles.saveEmailGradient}
              >
                <Text style={styles.saveEmailText}>
                  {isLoading ? 'Changing Email...' : 'Change Email'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

const BackupCodesModal = ({ visible, onClose, currentColors }) => {
  const [backupCodes] = useState([
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0',
    'E1F2-G3H4-I5J6',
    'K7L8-M9N0-O1P2',
    'Q3R4-S5T6-U7V8'
  ]);
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (code, index) => {
    // In a real app, this would copy to clipboard
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const regenerateCodes = () => {
    Alert.alert(
      'Regenerate Backup Codes',
      'This will invalidate all existing backup codes. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Regenerate', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'New backup codes generated successfully');
        }}
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={[styles.backupModal, { backgroundColor: currentColors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: currentColors.text }]}>Backup Codes</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentColors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <BlurView intensity={15} style={[styles.backupWarning, { backgroundColor: currentColors.glass }]}>
              <Shield size={20} color={currentColors.warning} />
              <Text style={[styles.warningText, { color: currentColors.textSecondary }]}>
                Save these codes in a secure location. Each code can only be used once to access your account if you lose your device.
              </Text>
            </BlurView>

            <View style={styles.backupCodesGrid}>
              {backupCodes.map((code, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.backupCodeItem}
                  onPress={() => copyCode(code, index)}
                >
                  <BlurView intensity={15} style={[styles.backupCodeBlur, { backgroundColor: currentColors.glass }]}>
                    <Text style={[styles.backupCodeText, { color: currentColors.text }]}>{code}</Text>
                    {copiedCode === index ? (
                      <Check size={16} color={currentColors.neonGreen} />
                    ) : (
                      <Copy size={16} color={currentColors.textMuted} />
                    )}
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.regenerateButton} onPress={regenerateCodes}>
              <LinearGradient
                colors={[currentColors.warning, currentColors.accentSecondary]}
                style={styles.regenerateGradient}
              >
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.regenerateText}>Regenerate Codes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

export default function PrivacySecurityScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});

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

  const downloadData = (dataType) => {
    setDownloadProgress(prev => ({ ...prev, [dataType]: true }));
    
    setTimeout(() => {
      setDownloadProgress(prev => ({ ...prev, [dataType]: false }));
      Alert.alert('Download Complete', `Your ${dataType.toLowerCase()} data has been downloaded successfully.`);
    }, 3000);
  };

  const dataTypes = [
    {
      id: 'profile',
      title: 'Profile Data',
      description: 'Personal information, preferences, and settings',
      size: '2.3 MB',
      icon: FileText
    },
    {
      id: 'workouts',
      title: 'Workout History',
      description: 'All your workout sessions and exercise data',
      size: '15.7 MB',
      icon: Database
    },
    {
      id: 'classes',
      title: 'Class History',
      description: 'Booked classes, attendance, and ratings',
      size: '4.1 MB',
      icon: Settings
    },
    {
      id: 'messages',
      title: 'Chat Messages',
      description: 'Conversations with trainers and support',
      size: '8.9 MB',
      icon: Smartphone
    }
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
              colors={[currentColors.accent, currentColors.accentSecondary]}
              style={styles.headerIcon}
            >
              <Shield size={28} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: currentColors.text }]}>Privacy & Security</Text>
            <Text style={[styles.headerSubtitle, { color: currentColors.textSecondary }]}>
              Manage your data and account security
            </Text>
          </View>
        </Animated.View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Data Download Section */}
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Download Your Data</Text>
            <Text style={[styles.sectionDescription, { color: currentColors.textSecondary }]}>
              Export your personal data in a portable format
            </Text>

            {dataTypes.map((dataType) => (
              <DataCard
                key={dataType.id}
                icon={dataType.icon}
                title={dataType.title}
                description={dataType.description}
                size={dataType.size}
                onDownload={() => downloadData(dataType.id)}
                currentColors={currentColors}
              />
            ))}

            {/* Download All Button */}
            <TouchableOpacity style={styles.downloadAllButton}>
              <LinearGradient
                colors={[currentColors.neonGreen, currentColors.success]}
                style={styles.downloadAllGradient}
              >
                <Download size={20} color="#FFFFFF" />
                <Text style={styles.downloadAllText}>Download All Data</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Security Settings Section */}
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Security Settings</Text>
            <Text style={[styles.sectionDescription, { color: currentColors.textSecondary }]}>
              Manage your account security and authentication
            </Text>

            <SecurityCard
              icon={Lock}
              title="Change Password"
              description="Update your account password"
              action="Change"
              onPress={() => setShowPasswordModal(true)}
              currentColors={currentColors}
              status="active"
            />

            <SecurityCard
              icon={Mail}
              title="Change Email"
              description="Update your email address"
              action="Change"
              onPress={() => setShowEmailModal(true)}
              currentColors={currentColors}
              status="verified"
            />

            <SecurityCard
              icon={Key}
              title="Backup Codes"
              description="Generate recovery codes for account access"
              action="Manage"
              onPress={() => setShowBackupModal(true)}
              currentColors={currentColors}
              status="active"
            />
          </Animated.View>

          {/* Privacy Information */}
          <Animated.View
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Privacy Information</Text>
            
            <BlurView intensity={20} style={[styles.privacyInfoCard, { backgroundColor: currentColors.glass }]}>
              <Text style={[styles.privacyInfoTitle, { color: currentColors.text }]}>How We Protect Your Data</Text>
              <View style={styles.privacyInfoList}>
                <View style={styles.privacyInfoItem}>
                  <View style={[styles.privacyInfoDot, { backgroundColor: currentColors.neonGreen }]} />
                  <Text style={[styles.privacyInfoText, { color: currentColors.textSecondary }]}>
                    End-to-end encryption for all personal data
                  </Text>
                </View>
                <View style={styles.privacyInfoItem}>
                  <View style={[styles.privacyInfoDot, { backgroundColor: currentColors.neonBlue }]} />
                  <Text style={[styles.privacyInfoText, { color: currentColors.textSecondary }]}>
                    No data sharing with third parties without consent
                  </Text>
                </View>
                <View style={styles.privacyInfoItem}>
                  <View style={[styles.privacyInfoDot, { backgroundColor: currentColors.neonPink }]} />
                  <Text style={[styles.privacyInfoText, { color: currentColors.textSecondary }]}>
                    Regular security audits and compliance checks
                  </Text>
                </View>
                <View style={styles.privacyInfoItem}>
                  <View style={[styles.privacyInfoDot, { backgroundColor: currentColors.neonYellow }]} />
                  <Text style={[styles.privacyInfoText, { color: currentColors.textSecondary }]}>
                    GDPR and CCPA compliant data handling
                  </Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>

        {/* Modals */}
        <ChangePasswordModal
          visible={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          currentColors={currentColors}
        />

        <ChangeEmailModal
          visible={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          currentColors={currentColors}
        />

        <BackupCodesModal
          visible={showBackupModal}
          onClose={() => setShowBackupModal(false)}
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
  headerIcon: {
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  // Data Cards
  dataCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dataInfo: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dataDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  dataSize: {
    fontSize: 12,
    fontWeight: '500',
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  downloadButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadAllButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  downloadAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  downloadAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Security Cards
  securityCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityInfo: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  securityDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  securityAction: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  securityActionGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  securityActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Privacy Info
  privacyInfoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  privacyInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  privacyInfoList: {
    gap: 12,
  },
  privacyInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  privacyInfoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  privacyInfoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordModal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emailModal: {
    width: '90%',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backupModal: {
    width: '90%',
    maxHeight: '80%',
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
  // Password Modal
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  requirementsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  savePasswordButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  savePasswordGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  savePasswordText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Email Modal
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  currentEmailText: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  emailInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  saveEmailButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 24,
  },
  saveEmailGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveEmailText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Backup Codes Modal
  backupWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  backupCodesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  backupCodeItem: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  backupCodeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backupCodeText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  regenerateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  regenerateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  regenerateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
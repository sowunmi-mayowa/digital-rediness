import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { UserProfile } from '@/types';
import { i18n } from '@/services/i18n';
import { StorageService } from '@/services/storage';
import { router } from 'expo-router';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onBack?: () => void;
}

export default function UserInfoScreen({ onComplete, onBack }: Props) {
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [location, setLocation] = useState('');
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [showEducationPicker, setShowEducationPicker] = useState(false);

  const ageRanges = i18n.getTranslations('userInfo.ageRanges');
  const educationLevels = i18n.getTranslations('userInfo.educationLevels');

  const handleContinue = async () => {
    if (!ageRange || !educationLevel || !location) {
      return;
    }

    const profile: UserProfile = {
      name: name || undefined,
      ageRange,
      educationLevel,
      location,
    };
    console.log(profile);

    await StorageService.saveUserProfile(profile);
    onComplete(profile);
  };

  const isValid = ageRange && educationLevel && location;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => {
            if (onBack) onBack();
            else router.back();
          }}
          style={styles.backButton}
          accessibilityRole="button"
          hitSlop={{ bottom: 10, right: 10 }}
        >
          <Text style={styles.backButtonText}>← {i18n.t('back')}</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('userInfo.title')}</Text>
          <Text style={styles.subtitle}>{i18n.t('userInfo.subtitle')}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('userInfo.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={i18n.t('userInfo.namePlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('userInfo.ageRange')}</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowAgePicker(true)}
            >
              <Text
                style={[styles.pickerText, !ageRange && styles.placeholderText]}
              >
                {ageRange
                  ? ageRanges[ageRange]
                  : i18n.t('userInfo.ageRangePlaceholder')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {i18n.t('userInfo.educationLevel')}
            </Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowEducationPicker(true)}
            >
              <Text
                style={[
                  styles.pickerText,
                  !educationLevel && styles.placeholderText,
                ]}
              >
                {educationLevel
                  ? educationLevels[educationLevel]
                  : i18n.t('userInfo.educationLevelPlaceholder')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('userInfo.location')}</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder={i18n.t('userInfo.locationPlaceholder')}
              placeholderTextColor="#999"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isValid && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isValid}
        >
          <Text style={styles.continueButtonText}>
            {i18n.t('userInfo.continue')}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showAgePicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAgePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{i18n.t('userInfo.ageRange')}</Text>
            {Object.keys(ageRanges).map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.modalOption}
                onPress={() => {
                  setAgeRange(key);
                  setShowAgePicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>{ageRanges[key]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showEducationPicker} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEducationPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {i18n.t('userInfo.educationLevel')}
            </Text>
            {Object.keys(educationLevels).map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.modalOption}
                onPress={() => {
                  setEducationLevel(key);
                  setShowEducationPicker(false);
                }}
              >
                <Text style={styles.modalOptionText}>
                  {educationLevels[key]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: 20,
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  placeholderText: {
    color: '#999',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  modalOption: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#1A1A1A',
  },
});

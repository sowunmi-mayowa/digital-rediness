import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Language } from '@/types';
import { i18n } from '@/services/i18n';
import { StorageService } from '@/services/storage';
import Entypo from '@expo/vector-icons/Entypo';

interface Props {
  onLanguageSelected: (language: Language) => void;
}

const languages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naija' },
];

export default function LanguageSelectionScreen({ onLanguageSelected }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    i18n.setLanguage(language);
  };

  const handleContinue = async () => {
    await StorageService.setLanguage(selectedLanguage);
    onLanguageSelected(selectedLanguage);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('languageSelection.title')}</Text>
          <Text style={styles.subtitle}>
            {i18n.t('languageSelection.subtitle')}
          </Text>
        </View>

        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                selectedLanguage === lang.code && styles.languageButtonSelected,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <Text
                style={[
                  styles.languageName,
                  selectedLanguage === lang.code && styles.languageNameSelected,
                ]}
              >
                {lang.nativeName}
              </Text>
              <Text
                style={[
                  styles.languageSubtext,
                  selectedLanguage === lang.code &&
                    styles.languageSubtextSelected,
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            {i18n.t('languageSelection.continue')}
            <Entypo name="arrow-right" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  languageList: {
    gap: 16,
  },
  languageButton: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  languageButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  languageName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  languageNameSelected: {
    color: '#2196F3',
  },
  languageSubtext: {
    fontSize: 16,
    color: '#666',
  },
  languageSubtextSelected: {
    color: '#1976D2',
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
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
});

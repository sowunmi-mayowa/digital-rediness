import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Smartphone, Wifi, Shield, CreditCard } from 'lucide-react-native';
import { i18n } from '@/services/i18n';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  onStartAssessment: () => void;
  onBack?: () => void;
}

export default function LandingScreen({ onStartAssessment, onBack }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.nameHeader}>
        <TouchableOpacity
          onPress={() => {
            if (onBack) onBack();
            else router.back();
          }}
          style={styles.backButton}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back-circle" size={32} color="#2196F3" />
          <Text style={styles.backButtonText}>{i18n.t('back')}</Text>
        </TouchableOpacity>

        <Text style={styles.appName}>Digital Pulse</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{i18n.t('landing.title')}</Text>
        <Text style={styles.heroSubtitle}>{i18n.t('landing.subtitle')}</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartAssessment}
        >
          <Text style={styles.startButtonText}>
            {i18n.t('landing.startButton')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {i18n.t('landing.features.title')}
        </Text>

        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Smartphone color="#2196F3" size={40} />
            </View>
            <Text style={styles.featureTitle}>
              {i18n.t('landing.features.phoneSkills')}
            </Text>
            <Text style={styles.featureDescription}>
              {i18n.t('landing.features.phoneSkillsDesc')}
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Wifi color="#4CAF50" size={40} />
            </View>
            <Text style={styles.featureTitle}>
              {i18n.t('landing.features.internetKnowledge')}
            </Text>
            <Text style={styles.featureDescription}>
              {i18n.t('landing.features.internetKnowledgeDesc')}
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <Shield color="#FF9800" size={40} />
            </View>
            <Text style={styles.featureTitle}>
              {i18n.t('landing.features.onlineSafety')}
            </Text>
            <Text style={styles.featureDescription}>
              {i18n.t('landing.features.onlineSafetyDesc')}
            </Text>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.iconContainer}>
              <CreditCard color="#9C27B0" size={40} />
            </View>
            <Text style={styles.featureTitle}>
              {i18n.t('landing.features.digitalPayments')}
            </Text>
            <Text style={styles.featureDescription}>
              {i18n.t('landing.features.digitalPaymentsDesc')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {i18n.t('landing.howItWorks.title')}
        </Text>

        <View style={styles.stepsList}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {i18n.t('landing.howItWorks.step1')}
              </Text>
              <Text style={styles.stepDescription}>
                {i18n.t('landing.howItWorks.step1Desc')}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {i18n.t('landing.howItWorks.step2')}
              </Text>
              <Text style={styles.stepDescription}>
                {i18n.t('landing.howItWorks.step2Desc')}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                {i18n.t('landing.howItWorks.step3')}
              </Text>
              <Text style={styles.stepDescription}>
                {i18n.t('landing.howItWorks.step3Desc')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomButton}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartAssessment}
        >
          <Text style={styles.startButtonText}>
            {i18n.t('landing.startButton')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nameHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    marginTop: 5,
    marginLeft: 0,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: '#2196F3',
    padding: 40,
    paddingTop: 80,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#E3F2FD',
    textAlign: 'center',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bottomButton: {
    padding: 20,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Settings,
  Wifi,
  Bluetooth,
  Monitor,
  Volume2,
  Battery,
  HardDrive,
  Shield,
  Info,
  Eye,
} from 'lucide-react-native';
import { TaskMetrics } from '@/types';
import { i18n } from '@/services/i18n';

interface Props {
  onComplete: (metrics: TaskMetrics) => void;
}

export default function Task4MultiStep({ onComplete }: Props) {
  const [startTime] = useState(Date.now());
  const [step, setStep] = useState(1);
  const [navigationMistakes, setNavigationMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Step 1: Correct = Settings
  const step1Items = [
    {
      id: 'settings',
      label: i18n.t('tasks.settings'),
      icon: Settings,
      isCorrect: true,
    },
    { id: 'wifi', label: i18n.t('tasks.wifi'), icon: Wifi, isCorrect: false },
    {
      id: 'bluetooth',
      label: i18n.t('tasks.bluetooth'),
      icon: Bluetooth,
      isCorrect: false,
    },
    {
      id: 'display',
      label: i18n.t('tasks.display'),
      icon: Monitor,
      isCorrect: false,
    },
    {
      id: 'sound',
      label: i18n.t('tasks.sound'),
      icon: Volume2,
      isCorrect: false,
    },
    {
      id: 'battery',
      label: i18n.t('tasks.battery'),
      icon: Battery,
      isCorrect: false,
    },
    {
      id: 'storage',
      label: i18n.t('tasks.storage'),
      icon: HardDrive,
      isCorrect: false,
    },
    {
      id: 'security',
      label: i18n.t('tasks.security'),
      icon: Shield,
      isCorrect: false,
    },
  ];

  // Step 2: Correct = Wifi
  const step2Items = [
    { id: 'wifi', label: i18n.t('tasks.wifi'), icon: Wifi, isCorrect: true },
    {
      id: 'bluetooth',
      label: i18n.t('tasks.bluetooth'),
      icon: Bluetooth,
      isCorrect: false,
    },
    {
      id: 'display',
      label: i18n.t('tasks.display'),
      icon: Monitor,
      isCorrect: false,
    },
    {
      id: 'sound',
      label: i18n.t('tasks.sound'),
      icon: Volume2,
      isCorrect: false,
    },
    {
      id: 'battery',
      label: i18n.t('tasks.battery'),
      icon: Battery,
      isCorrect: false,
    },
    {
      id: 'storage',
      label: i18n.t('tasks.storage'),
      icon: HardDrive,
      isCorrect: false,
    },
    { id: 'about', label: i18n.t('tasks.about'), icon: Info, isCorrect: false },
    {
      id: 'accessibility',
      label: i18n.t('tasks.accessibility'),
      icon: Eye,
      isCorrect: false,
    },
  ];

  const handleItemPress = (isCorrect: boolean) => {
    if (completed) return;

    if (isCorrect) {
      if (step === 1) {
        setStep(2);
      } else {
        const completionTime = Date.now();
        const timeTaken = completionTime - startTime;
        const metrics: TaskMetrics = {
          taskName: 'Multi-Step Test',
          taskStartTime: startTime,
          taskCompletionTime: completionTime,
          timeTaken,
          errors: navigationMistakes,
          retries: 0,
          navigationMistakes,
        };
        setCompleted(true);
        setTimeout(() => onComplete(metrics), 500);
      }
    } else {
      setNavigationMistakes(navigationMistakes + 1);
    }
  };

  const currentItems = step === 1 ? step1Items : step2Items;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('tasks.task4.title')}</Text>
        <Text style={styles.instruction}>
          {i18n.t('tasks.task4.instruction')}
        </Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>
            {i18n.t('tasks.step')} {step} {i18n.t('tasks.of')} 2
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuGrid}>
          {currentItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  completed && item.isCorrect && styles.correctMenuItem,
                ]}
                onPress={() => handleItemPress(item.isCorrect)}
                disabled={completed}
              >
                <View style={styles.iconContainer}>
                  <IconComponent
                    color={completed && item.isCorrect ? '#4CAF50' : '#2196F3'}
                    size={48}
                  />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {navigationMistakes > 0 && !completed && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>
              {step === 1
                ? i18n.t('tasks.trySettings')
                : i18n.t('tasks.tryWifi')}
            </Text>
          </View>
        )}

        {completed && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>
              {i18n.t('tasks.taskComplete')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 18,
    color: '#666',
    lineHeight: 28,
    marginBottom: 12,
  },
  stepIndicator: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E0E0E0',
    width: '48%',
    marginBottom: 16,
  },
  correctMenuItem: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  iconContainer: {
    marginBottom: 12,
  },
  menuLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  errorText: {
    color: '#C62828',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  successMessage: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
});

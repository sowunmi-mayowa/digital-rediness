import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  MessageCircle,
  Camera,
  Settings,
  Users,
  Phone,
  Image,
  Calendar,
  MapPin,
  HelpCircle,
  User,
} from 'lucide-react-native';
import { TaskMetrics } from '@/types';
import { i18n } from '@/services/i18n';

interface Props {
  onComplete: (metrics: TaskMetrics) => void;
}

export default function Task3Navigation({ onComplete }: Props) {
  const [startTime] = useState(Date.now());
  const [navigationMistakes, setNavigationMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  const menuItems = [
    {
      id: 'messages',
      label: i18n.t('tasks.messages'),
      icon: MessageCircle,
      isCorrect: true,
    },
    {
      id: 'camera',
      label: i18n.t('tasks.camera'),
      icon: Camera,
      isCorrect: false,
    },
    {
      id: 'settings',
      label: i18n.t('tasks.settings'),
      icon: Settings,
      isCorrect: false,
    },
    {
      id: 'contacts',
      label: i18n.t('tasks.contacts'),
      icon: Users,
      isCorrect: false,
    },
    {
      id: 'calls',
      label: i18n.t('tasks.calls'),
      icon: Phone,
      isCorrect: false,
    },
    {
      id: 'gallery',
      label: i18n.t('tasks.gallery'),
      icon: Image,
      isCorrect: false,
    },
    {
      id: 'calendar',
      label: i18n.t('tasks.calendar'),
      icon: Calendar,
      isCorrect: false,
    },
    { id: 'maps', label: i18n.t('tasks.maps'), icon: MapPin, isCorrect: false },
    {
      id: 'help',
      label: i18n.t('tasks.help'),
      icon: HelpCircle,
      isCorrect: false,
    },
    {
      id: 'profile',
      label: i18n.t('tasks.profile'),
      icon: User,
      isCorrect: false,
    },
  ];

  const handleMenuPress = (isCorrect: boolean) => {
    if (completed) return;

    if (isCorrect) {
      const completionTime = Date.now();
      const timeTaken = completionTime - startTime;

      const metrics: TaskMetrics = {
        taskName: 'Navigation Test',
        taskStartTime: startTime,
        taskCompletionTime: completionTime,
        timeTaken,
        errors: navigationMistakes,
        retries: 0,
        navigationMistakes,
      };

      setCompleted(true);
      setTimeout(() => onComplete(metrics), 500);
    } else {
      setNavigationMistakes(navigationMistakes + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('tasks.task3.title')}</Text>
        <Text style={styles.instruction}>
          {i18n.t('tasks.task3.instruction')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuGrid}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  completed && item.isCorrect && styles.correctMenuItem,
                ]}
                onPress={() => handleMenuPress(item.isCorrect)}
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
              Try again! Find the Messages screen.
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
    width: '48%', // two items per row
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

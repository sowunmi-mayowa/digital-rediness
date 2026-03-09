import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TaskMetrics } from '@/types';
import { i18n } from '@/services/i18n';

interface Props {
  onComplete: (metrics: TaskMetrics) => void;
}

export default function Task1ScrollTest({ onComplete }: Props) {
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);

  const handleComplete = () => {
    const completionTime = Date.now();
    const timeTaken = completionTime - startTime;

    const metrics: TaskMetrics = {
      taskName: 'Scroll Test',
      taskStartTime: startTime,
      taskCompletionTime: completionTime,
      timeTaken,
      errors,
      retries: 0,
    };

    onComplete(metrics);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('tasks.task1.title')}</Text>
        <Text style={styles.instruction}>{i18n.t('tasks.task1.instruction')}</Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleComplete}>
            <Text style={styles.continueButtonText}>{i18n.t('tasks.continue')}</Text>
          </TouchableOpacity>
        </View>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  spacer: {
    height: 400,
    marginBottom: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

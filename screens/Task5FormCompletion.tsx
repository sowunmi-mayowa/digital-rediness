import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { TaskMetrics } from '@/types';
import { i18n } from '@/services/i18n';

interface Props {
  onComplete: (metrics: TaskMetrics) => void;
}

export default function Task5FormCompletion({ onComplete }: Props) {
  const [startTime] = useState(Date.now());
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = () => {
    if (completed) return;

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setErrors(errors + 1);
      return;
    }

    const completionTime = Date.now();
    const timeTaken = completionTime - startTime;

    const metrics: TaskMetrics = {
      taskName: 'Form Completion',
      taskStartTime: startTime,
      taskCompletionTime: completionTime,
      timeTaken,
      errors,
      retries: 0,
      additionalData: { age },
    };

    setCompleted(true);
    setTimeout(() => onComplete(metrics), 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('tasks.task5.title')}</Text>
        <Text style={styles.instruction}>{i18n.t('tasks.task5.instruction')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>{i18n.t('tasks.ageLabel')}</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            placeholder={i18n.t('tasks.agePlaceholder')}
            placeholderTextColor="#999"
            keyboardType="number-pad"
            editable={!completed}
          />

          <TouchableOpacity
            style={[styles.submitButton, completed && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={completed}
          >
            <Text style={styles.submitButtonText}>{i18n.t('tasks.submit')}</Text>
          </TouchableOpacity>
        </View>

        {errors > 0 && !completed && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>
              Please enter a valid age (1-120)
            </Text>
          </View>
        )}

        {completed && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>{i18n.t('tasks.taskComplete')}</Text>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    gap: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    color: '#1A1A1A',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    marginTop: 20,
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
    marginTop: 20,
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

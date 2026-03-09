import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TaskMetrics } from '@/types';
import { i18n } from '@/services/i18n';

interface Props {
  onComplete: (metrics: TaskMetrics) => void;
}

export default function Task2TapAccuracy({ onComplete }: Props) {
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);

  const shapes = [
    { id: 1, shape: 'circle', color: '#2196F3', isCorrect: true },
    { id: 2, shape: 'square', color: '#F44336', isCorrect: false },
    { id: 3, shape: 'circle', color: '#4CAF50', isCorrect: false },
    { id: 4, shape: 'square', color: '#FF9800', isCorrect: false },
  ];

  const handleShapePress = (isCorrect: boolean) => {
    if (completed) return;

    if (isCorrect) {
      const completionTime = Date.now();
      const timeTaken = completionTime - startTime;

      const metrics: TaskMetrics = {
        taskName: 'Tap Accuracy Test',
        taskStartTime: startTime,
        taskCompletionTime: completionTime,
        timeTaken,
        errors,
        retries: 0,
        tapAccuracy: errors === 0 ? 100 : Math.max(0, 100 - (errors * 25)),
      };

      setCompleted(true);
      setTimeout(() => onComplete(metrics), 500);
    } else {
      setErrors(errors + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('tasks.task2.title')}</Text>
        <Text style={styles.instruction}>{i18n.t('tasks.task2.instruction')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.shapesGrid}>
          {shapes.map((shape) => (
            <TouchableOpacity
              key={shape.id}
              style={[
                styles.shapeContainer,
                completed && shape.isCorrect && styles.correctShape,
              ]}
              onPress={() => handleShapePress(shape.isCorrect)}
              disabled={completed}
            >
              <View
                style={[
                  shape.shape === 'circle' ? styles.circle : styles.square,
                  { backgroundColor: shape.color },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        {errors > 0 && !completed && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>
              Try again! Tap the blue circle.
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
  shapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  shapeContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#E0E0E0',
  },
  correctShape: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  square: {
    width: 100,
    height: 100,
    borderRadius: 8,
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

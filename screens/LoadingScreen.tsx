import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { i18n } from '@/services/i18n';

interface Props {
  message?: string;
}

export default function LoadingScreen({ message }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.text}>
          {message ||
            i18n.t('tasks.loadingCreatingQuestions') ||
            "Please hold — we're creating your personalized questions"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  text: {
    marginTop: 12,
    fontSize: 18,
    color: '#1A1A1A',
    textAlign: 'center',
    fontWeight: '600',
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  TaskMetrics,
  QuestionAnswer,
  AssessmentResults,
  Language,
} from '@/types';

const KEYS = {
  LANGUAGE: 'app_language',
  USER_PROFILE: 'user_profile',
  TASK_METRICS: 'task_metrics',
  QUESTION_ANSWERS: 'question_answers',
  ASSESSMENT_RESULTS: 'assessment_results',
};

// In-memory fallback storage used when native AsyncStorage is unavailable.
const inMemoryStore = new Map<string, string>();

const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const v = await AsyncStorage.getItem(key as any);
      return v;
    } catch (e) {
      return inMemoryStore.has(key) ? (inMemoryStore.get(key) as string) : null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key as any, value);
    } catch (e) {
      inMemoryStore.set(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key as any);
    } catch (e) {
      inMemoryStore.delete(key);
    }
  },
};

export const StorageService = {
  async setLanguage(language: Language): Promise<void> {
    await safeStorage.setItem(KEYS.LANGUAGE, language);
  },

  async getLanguage(): Promise<Language | null> {
    const language = await safeStorage.getItem(KEYS.LANGUAGE);
    return language as Language | null;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await safeStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const data = await safeStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  async saveTaskMetrics(metrics: TaskMetrics[]): Promise<void> {
    await safeStorage.setItem(KEYS.TASK_METRICS, JSON.stringify(metrics));
  },

  async getTaskMetrics(): Promise<TaskMetrics[]> {
    const data = await safeStorage.getItem(KEYS.TASK_METRICS);
    return data ? JSON.parse(data) : [];
  },

  async saveQuestionAnswers(answers: QuestionAnswer[]): Promise<void> {
    await safeStorage.setItem(KEYS.QUESTION_ANSWERS, JSON.stringify(answers));
  },

  async getQuestionAnswers(): Promise<QuestionAnswer[]> {
    const data = await safeStorage.getItem(KEYS.QUESTION_ANSWERS);
    return data ? JSON.parse(data) : [];
  },

  async saveAssessmentResults(results: AssessmentResults): Promise<void> {
    await safeStorage.setItem(KEYS.ASSESSMENT_RESULTS, JSON.stringify(results));
  },

  async getAssessmentResults(): Promise<AssessmentResults | null> {
    const data = await safeStorage.getItem(KEYS.ASSESSMENT_RESULTS);
    return data ? JSON.parse(data) : null;
  },

  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(KEYS.USER_PROFILE as any),
        AsyncStorage.removeItem(KEYS.TASK_METRICS as any),
        AsyncStorage.removeItem(KEYS.QUESTION_ANSWERS as any),
        AsyncStorage.removeItem(KEYS.ASSESSMENT_RESULTS as any),
      ]);
    } catch (e) {
      inMemoryStore.delete(KEYS.USER_PROFILE);
      inMemoryStore.delete(KEYS.TASK_METRICS);
      inMemoryStore.delete(KEYS.QUESTION_ANSWERS);
      inMemoryStore.delete(KEYS.ASSESSMENT_RESULTS);
    }
  },
};

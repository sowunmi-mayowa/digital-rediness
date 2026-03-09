import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, TaskMetrics, QuestionAnswer, AssessmentResults, Language } from '@/types';

const KEYS = {
  LANGUAGE: 'app_language',
  USER_PROFILE: 'user_profile',
  TASK_METRICS: 'task_metrics',
  QUESTION_ANSWERS: 'question_answers',
  ASSESSMENT_RESULTS: 'assessment_results',
};

export const StorageService = {
  async setLanguage(language: Language): Promise<void> {
    await AsyncStorage.setItem(KEYS.LANGUAGE, language);
  },

  async getLanguage(): Promise<Language | null> {
    const language = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return language as Language | null;
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  },

  async saveTaskMetrics(metrics: TaskMetrics[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.TASK_METRICS, JSON.stringify(metrics));
  },

  async getTaskMetrics(): Promise<TaskMetrics[]> {
    const data = await AsyncStorage.getItem(KEYS.TASK_METRICS);
    return data ? JSON.parse(data) : [];
  },

  async saveQuestionAnswers(answers: QuestionAnswer[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.QUESTION_ANSWERS, JSON.stringify(answers));
  },

  async getQuestionAnswers(): Promise<QuestionAnswer[]> {
    const data = await AsyncStorage.getItem(KEYS.QUESTION_ANSWERS);
    return data ? JSON.parse(data) : [];
  },

  async saveAssessmentResults(results: AssessmentResults): Promise<void> {
    await AsyncStorage.setItem(KEYS.ASSESSMENT_RESULTS, JSON.stringify(results));
  },

  async getAssessmentResults(): Promise<AssessmentResults | null> {
    const data = await AsyncStorage.getItem(KEYS.ASSESSMENT_RESULTS);
    return data ? JSON.parse(data) : null;
  },

  async clearAllData(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(KEYS.USER_PROFILE),
      AsyncStorage.removeItem(KEYS.TASK_METRICS),
      AsyncStorage.removeItem(KEYS.QUESTION_ANSWERS),
      AsyncStorage.removeItem(KEYS.ASSESSMENT_RESULTS),
    ]);
  },
};

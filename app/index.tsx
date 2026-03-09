import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Language, UserProfile, TaskMetrics, QuestionAnswer, AssessmentResults } from '@/types';
import { i18n } from '@/services/i18n';
import { StorageService } from '@/services/storage';
import { ScoringService } from '@/services/scoring';

import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import LandingScreen from '@/screens/LandingScreen';
import UserInfoScreen from '@/screens/UserInfoScreen';
import Task1ScrollTest from '@/screens/Task1ScrollTest';
import Task2TapAccuracy from '@/screens/Task2TapAccuracy';
import Task3Navigation from '@/screens/Task3Navigation';
import Task4MultiStep from '@/screens/Task4MultiStep';
import Task5FormCompletion from '@/screens/Task5FormCompletion';
import KnowledgeQuestionsScreen from '@/screens/KnowledgeQuestionsScreen';
import ResultsScreen from '@/screens/ResultsScreen';

type Screen =
  | 'language'
  | 'landing'
  | 'userInfo'
  | 'task1'
  | 'task2'
  | 'task3'
  | 'task4'
  | 'task5'
  | 'questions'
  | 'results';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('language');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    const savedLanguage = await StorageService.getLanguage();
    if (savedLanguage) {
      i18n.setLanguage(savedLanguage);
    }
  };

  const handleLanguageSelected = (language: Language) => {
    i18n.setLanguage(language);
    setCurrentScreen('landing');
  };

  const handleStartAssessment = () => {
    setCurrentScreen('userInfo');
  };

  const handleUserInfoComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentScreen('task1');
  };

  const handleTask1Complete = (metrics: TaskMetrics) => {
    setTaskMetrics([metrics]);
    setCurrentScreen('task2');
  };

  const handleTask2Complete = (metrics: TaskMetrics) => {
    setTaskMetrics((prev) => [...prev, metrics]);
    setCurrentScreen('task3');
  };

  const handleTask3Complete = (metrics: TaskMetrics) => {
    setTaskMetrics((prev) => [...prev, metrics]);
    setCurrentScreen('task4');
  };

  const handleTask4Complete = (metrics: TaskMetrics) => {
    setTaskMetrics((prev) => [...prev, metrics]);
    setCurrentScreen('task5');
  };

  const handleTask5Complete = async (metrics: TaskMetrics) => {
    const allMetrics = [...taskMetrics, metrics];
    setTaskMetrics(allMetrics);
    await StorageService.saveTaskMetrics(allMetrics);
    setCurrentScreen('questions');
  };

  const handleQuestionsComplete = (answers: QuestionAnswer[]) => {
    setQuestionAnswers(answers);

    if (userProfile) {
      const assessmentResults = ScoringService.generateResults(
        userProfile,
        taskMetrics,
        answers
      );
      setResults(assessmentResults);
      StorageService.saveAssessmentResults(assessmentResults);
      setCurrentScreen('results');
    }
  };

  const handleRestart = async () => {
    await StorageService.clearAllData();
    setCurrentScreen('language');
    setUserProfile(null);
    setTaskMetrics([]);
    setQuestionAnswers([]);
    setResults(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'language' && (
        <LanguageSelectionScreen onLanguageSelected={handleLanguageSelected} />
      )}
      {currentScreen === 'landing' && (
        <LandingScreen onStartAssessment={handleStartAssessment} />
      )}
      {currentScreen === 'userInfo' && (
        <UserInfoScreen onComplete={handleUserInfoComplete} />
      )}
      {currentScreen === 'task1' && (
        <Task1ScrollTest onComplete={handleTask1Complete} />
      )}
      {currentScreen === 'task2' && (
        <Task2TapAccuracy onComplete={handleTask2Complete} />
      )}
      {currentScreen === 'task3' && (
        <Task3Navigation onComplete={handleTask3Complete} />
      )}
      {currentScreen === 'task4' && (
        <Task4MultiStep onComplete={handleTask4Complete} />
      )}
      {currentScreen === 'task5' && (
        <Task5FormCompletion onComplete={handleTask5Complete} />
      )}
      {currentScreen === 'questions' && (
        <KnowledgeQuestionsScreen onComplete={handleQuestionsComplete} />
      )}
      {currentScreen === 'results' && results && (
        <ResultsScreen results={results} onRestart={handleRestart} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

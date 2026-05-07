import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Language,
  UserProfile,
  TaskMetrics,
  QuestionAnswer,
  AssessmentResults,
} from '@/types';
import { i18n } from '@/services/i18n';
import { StorageService } from '@/services/storage';
import { ScoringService } from '@/services/scoring';
import { createRun, startWorkflow, resumeWorkflow } from '@/services/mastraApi';

import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import LandingScreen from '@/screens/LandingScreen';
import UserInfoScreen from '@/screens/UserInfoScreen';
import Task1ScrollTest from '@/screens/Task1ScrollTest';
import Task2TapAccuracy from '@/screens/Task2TapAccuracy';
import Task3Navigation from '@/screens/Task3Navigation';
import Task4MultiStep from '@/screens/Task4MultiStep';
import Task5FormCompletion from '@/screens/Task5FormCompletion';
import KnowledgeQuestionsScreen from '@/screens/KnowledgeQuestionsScreen';
import LoadingScreen from '@/screens/LoadingScreen';
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
  | 'loading'
  | 'questions'
  | 'results';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('language');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [taskMetrics, setTaskMetrics] = useState<TaskMetrics[]>([]);
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([]);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [mastraResult, setMastraResult] = useState<any | null>(null);
  const [languageInUse, setLanguageInUse] = useState<Language | null>(null);
  const [workflowQuestions, setWorkflowQuestions] = useState<any[] | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    const savedLanguage = await StorageService.getLanguage();
    if (savedLanguage) {
      i18n.setLanguage(savedLanguage);
      setLanguageInUse(savedLanguage);
    }
  };

  const handleLanguageSelected = (language: Language) => {
    i18n.setLanguage(language);
    setLanguageInUse(language);
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

    const combinedData = {
      allMetrics,
      languageInUse,
    };

    console.log('Combined data:', combinedData);

    await StorageService.saveTaskMetrics(allMetrics);
    // Switch to a dedicated loading screen while we create/start the workflow
    setCurrentScreen('loading');

    // Create a Mastra run and start the workflow with the collected metrics
    try {
      const runId = await createRun();
      console.log('createRun returned runId in Index:', runId);
      if (runId) setRunId(runId);

      if (runId) {
        const payload = {
          inputData: {
            allMetrics,
            languageInUse: languageInUse ?? 'en',
          },
          resourceId: `mobile-run-${Date.now()}`,
        };

        const startResp = await startWorkflow(runId, payload);
        console.log('startWorkflow response:', startResp);

        // extract questions from response (suspendPayload['collect-answers'].questions)
        try {
          const extracted =
            startResp?.suspendPayload?.['collect-answers']?.questions;
          if (Array.isArray(extracted) && extracted.length > 0) {
            // map external question shape to app Question shape (best-effort)
            const mapped = extracted.map((q: any, idx: number) => {
              const id = q.id ?? q.questionId ?? idx + 1;
              const questionText = q.question ?? q.text ?? q.prompt ?? '';

              // try several possible option containers
              let rawOptions = q.options ?? q.choices ?? q.answers ?? null;
              if (!rawOptions && Array.isArray(q.items)) rawOptions = q.items;

              let options: string[] = [];
              if (Array.isArray(rawOptions)) {
                options = rawOptions.map((opt: any) => {
                  if (typeof opt === 'string') return opt;
                  return opt.text ?? opt.label ?? opt.value ?? String(opt);
                });
              }

              const correctAnswer =
                typeof q.correctAnswer === 'number'
                  ? q.correctAnswer
                  : typeof q.correctIndex === 'number'
                    ? q.correctIndex
                    : 0;

              const category = q.category ?? q.group ?? 'knowledge';

              return {
                id,
                question: questionText,
                options,
                correctAnswer,
                category,
              };
            });

            setWorkflowQuestions(mapped);
            console.log('Mapped workflow questions:', mapped);
          }
        } catch (e) {
          console.warn(
            'Failed to extract/map questions from startWorkflow response',
            e,
          );
        }
      }
    } catch (e) {
      console.error('Error creating/starting Mastra workflow:', e);
    }

    // When done (success or not) show the questions screen. `workflowQuestions` may be null
    setCurrentScreen('questions');
  };

  const handleQuestionsComplete = async (answers: QuestionAnswer[]) => {
    setQuestionAnswers(answers);

    // Show analyzing/loading screen while we compute results and resume workflow
    setLoadingMessage(
      i18n.t('results.loadingAnalyzing') ||
        'Analyzing responses — creating your results',
    );
    setCurrentScreen('loading');

    if (userProfile) {
      const assessmentResults = ScoringService.generateResults(
        userProfile,
        taskMetrics,
        answers,
      );
      setResults(assessmentResults);
      StorageService.saveAssessmentResults(assessmentResults);

      if (runId) {
        try {
          const payloadAnswers = answers.map((a) => ({
            answer: String(a.selectedAnswer),
            questionId: String(a.questionId),
          }));
          const resumeResp = await resumeWorkflow(
            runId,
            'collect-answers',
            payloadAnswers,
          );
          console.log('resumeWorkflow response in Index:', resumeResp);
          if (resumeResp?.result?.readinessResult) {
            setMastraResult(resumeResp.result.readinessResult);
          }
        } catch (e) {
          console.warn('Failed to resume workflow with answers:', e);
        }
      }

      // Clear loading message and show results
      setLoadingMessage(null);
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
        <LandingScreen
          onStartAssessment={handleStartAssessment}
          onBack={() => setCurrentScreen('language')}
        />
      )}
      {currentScreen === 'userInfo' && (
        <UserInfoScreen
          onComplete={handleUserInfoComplete}
          onBack={() => setCurrentScreen('landing')}
        />
      )}
      {currentScreen === 'task1' && (
        <Task1ScrollTest
          onComplete={handleTask1Complete}
          onBack={() => setCurrentScreen('userInfo')}
        />
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
      {currentScreen === 'loading' && (
        <LoadingScreen message={loadingMessage ?? undefined} />
      )}
      {currentScreen === 'questions' && (
        <KnowledgeQuestionsScreen
          onComplete={handleQuestionsComplete}
          questionsOverride={workflowQuestions ?? null}
        />
      )}
      {currentScreen === 'results' && results && (
        <ResultsScreen
          results={results}
          mastraResult={mastraResult}
          onRestart={handleRestart}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

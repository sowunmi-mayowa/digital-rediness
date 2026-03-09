import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { QuestionAnswer, Language } from '@/types';
import { i18n } from '@/services/i18n';
import { getQuestions } from '@/utils/questions';
import { StorageService } from '@/services/storage';

interface Props {
  onComplete: (answers: QuestionAnswer[]) => void;
}

export default function KnowledgeQuestionsScreen({ onComplete }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLanguage = await StorageService.getLanguage();
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  };

  const questions = getQuestions(language);
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) return;

    const answer: QuestionAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: selectedAnswer === currentQuestion.correctAnswer,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      await StorageService.saveQuestionAnswers(newAnswers);
      onComplete(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t('questions.title')}</Text>
        <Text style={styles.subtitle}>{i18n.t('questions.subtitle')}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {i18n.t('questions.questionOf', {
              current: currentQuestionIndex + 1,
              total: questions.length,
            })}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <View style={styles.optionNumber}>
                  <Text style={[
                    styles.optionNumberText,
                    selectedAnswer === index && styles.optionNumberTextSelected,
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.optionTextSelected,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedAnswer === null && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedAnswer === null}
        >
          <Text style={styles.nextButtonText}>
            {isLastQuestion ? i18n.t('questions.finish') : i18n.t('questions.next')}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    gap: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  optionNumberTextSelected: {
    color: '#2196F3',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AssessmentResults } from '@/types';
import { i18n } from '@/services/i18n';
import { ScoringService } from '@/services/scoring';

interface Props {
  results: AssessmentResults;
  mastraResult?: any | null;
  onRestart: () => void;
}

export default function ResultsScreen({
  results,
  mastraResult,
  onRestart,
}: Props) {
  const [strengths, setStrengths] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

  // If Mastra provided a readiness result, prefer those values for display
  const finalScore = mastraResult?.readinessScore ?? results.finalScore;
  const knowledgeScore = mastraResult?.knowledgeScore ?? results.knowledgeScore;
  const operationalScore =
    mastraResult?.behavioralScore ?? results.operationalScore;
  const level = mastraResult?.readinessLevel ?? results.level;
  const mastraSummary = mastraResult?.summary ?? null;
  const mastraRecommendations: string[] =
    mastraResult?.improvementRecommendations ??
    mastraResult?.recommendations ??
    [];

  useEffect(() => {
    // Prefer Mastra-provided strengths/weaknesses when available
    if (mastraResult?.strengths && Array.isArray(mastraResult.strengths)) {
      setStrengths(mastraResult.strengths);
    } else {
      const computedStrengths = ScoringService.getStrengths(results);
      setStrengths(computedStrengths);
    }

    if (mastraResult?.weaknesses && Array.isArray(mastraResult.weaknesses)) {
      setWeaknesses(mastraResult.weaknesses);
    } else {
      const computedWeaknesses = ScoringService.getWeaknesses(results);
      setWeaknesses(computedWeaknesses);
    }
  }, [results, mastraResult]);

  const getScoreColor = (score: number) => {
    if (score >= 81) return '#4CAF50';
    if (score >= 61) return '#8BC34A';
    if (score >= 31) return '#FF9800';
    return '#F44336';
  };

  const getRecommendation = (level: string) => {
    const levelKey = level.toLowerCase();
    return i18n.t(`results.recommendationMessages.${levelKey}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('results.title')}</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>{i18n.t('results.scoreLabel')}</Text>
          <View style={styles.scoreCircle}>
            <Text
              style={[styles.scoreValue, { color: getScoreColor(finalScore) }]}
            >
              {finalScore}%
            </Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>
              {i18n.t(`results.levels.${level}`)}
            </Text>
          </View>
        </View>

        <View style={styles.scoresBreakdown}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreItemLabel}>
              {i18n.t('results.operational')}
            </Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${operationalScore}%`,
                    backgroundColor: getScoreColor(operationalScore),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreItemValue}>{operationalScore}%</Text>
          </View>

          <View style={styles.scoreItem}>
            <Text style={styles.scoreItemLabel}>
              {i18n.t('results.knowledge')}
            </Text>
            <View style={styles.scoreBar}>
              <View
                style={[
                  styles.scoreBarFill,
                  {
                    width: `${knowledgeScore}%`,
                    backgroundColor: getScoreColor(knowledgeScore),
                  },
                ]}
              />
            </View>
            <Text style={styles.scoreItemValue}>{knowledgeScore}%</Text>
          </View>
        </View>

        {strengths.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.t('results.strengths')}
            </Text>
            <View style={styles.list}>
              {strengths.map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[styles.listBullet, { backgroundColor: '#4CAF50' }]}
                  />
                  <Text style={styles.listText}>
                    {i18n.t(`results.strengthMessages.${strength}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {weaknesses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.t('results.weaknesses')}
            </Text>
            <View style={styles.list}>
              {weaknesses.map((weakness, index) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[styles.listBullet, { backgroundColor: '#FF9800' }]}
                  />
                  <Text style={styles.listText}>
                    {i18n.t(`results.weaknessMessages.${weakness}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {i18n.t('results.recommendations')}
          </Text>
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationText}>
              {mastraSummary ?? getRecommendation(level)}
            </Text>
          </View>
        </View>

        {mastraRecommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.t('results.improvementRecommendations')}
            </Text>
            <View style={styles.list}>
              {mastraRecommendations.map((rec, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View
                    style={[styles.listBullet, { backgroundColor: '#2196F3' }]}
                  />
                  <Text style={styles.listText}>{rec}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
          <Text style={styles.restartButtonText}>
            {i18n.t('results.restart')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  levelBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  scoresBreakdown: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    gap: 20,
    marginBottom: 24,
  },
  scoreItem: {
    gap: 8,
  },
  scoreItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scoreBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  scoreItemValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  list: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  listBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  recommendationCard: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  recommendationText: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  restartButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

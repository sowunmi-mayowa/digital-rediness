import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { AssessmentResults, UserProfile } from '@/types';
import { i18n } from '@/services/i18n';
import { ScoringService } from '@/services/scoring';
import { StorageService } from '@/services/storage';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
    const loadProfile = async () => {
      const profile = await StorageService.getUserProfile();
      setUserProfile(profile);
    };
    loadProfile();

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

  const escapeHtml = (value: unknown) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const getLocalizedTexts = () => ({
    title: i18n.t('results.title'),
    userInfoTitle: i18n.t('results.userInfoTitle') || 'User Information',
    name: i18n.t('results.name') || 'Name',
    ageRange: i18n.t('results.ageRange') || 'Age Range',
    educationLevel: i18n.t('results.educationLevel') || 'Education Level',
    location: i18n.t('results.location') || 'Location',
    scoreLabel: i18n.t('results.scoreLabel'),
    operational: i18n.t('results.operational'),
    knowledge: i18n.t('results.knowledge'),
    strengths: i18n.t('results.strengths'),
    weaknesses: i18n.t('results.weaknesses'),
    recommendations: i18n.t('results.recommendations'),
    improvementRecommendations: i18n.t('results.improvementRecommendations'),
    levelText: i18n.t(`results.levels.${level}`),
  });

  const buildResultHtml = () => {
    const texts = getLocalizedTexts();
    const translatedStrengths = strengths.map((strength) =>
      i18n.t(`${strength}`),
    );
    const translatedWeaknesses = weaknesses.map((weakness) =>
      i18n.t(`${weakness}`),
    );
    const recommendation = mastraSummary ?? getRecommendation(level);

    const listItems = (items: string[]) =>
      items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

    const profileHtml = userProfile
      ? `
        <section>
          <h2>${escapeHtml(texts.userInfoTitle)}</h2>
          <div class="profile-grid">
            <div><span>${escapeHtml(texts.name)}</span><strong>${escapeHtml(userProfile.name || '-')}</strong></div>
            <div><span>${escapeHtml(texts.ageRange)}</span><strong>${escapeHtml(userProfile.ageRange || '-')}</strong></div>
            <div><span>${escapeHtml(texts.educationLevel)}</span><strong>${escapeHtml(userProfile.educationLevel || '-')}</strong></div>
            <div><span>${escapeHtml(texts.location)}</span><strong>${escapeHtml(userProfile.location || '-')}</strong></div>
          </div>
        </section>
      `
      : '';

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body {
              font-family: Arial, Helvetica, sans-serif;
              color: #1A1A1A;
              margin: 32px;
              line-height: 1.5;
            }
            h1 {
              color: #2196F3;
              font-size: 28px;
              text-align: center;
              margin: 0 0 20px;
            }
            h2 {
              font-size: 18px;
              border-left: 4px solid #2196F3;
              padding-left: 10px;
              margin: 24px 0 12px;
            }
            .score-card {
              border: 1px solid #E0E0E0;
              border-radius: 16px;
              padding: 22px;
              text-align: center;
              margin-bottom: 20px;
            }
            .score {
              color: ${getScoreColor(finalScore)};
              font-size: 46px;
              font-weight: 700;
              margin: 8px 0;
            }
            .level {
              display: inline-block;
              background: #2196F3;
              color: #FFFFFF;
              padding: 8px 18px;
              border-radius: 20px;
              font-weight: 700;
            }
            .profile-grid {
              border: 1px solid #E0E0E0;
              border-radius: 12px;
              overflow: hidden;
            }
            .profile-grid div {
              padding: 12px 14px;
              border-bottom: 1px solid #EEEEEE;
            }
            .profile-grid div:last-child {
              border-bottom: 0;
            }
            .profile-grid span {
              color: #666666;
              display: block;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 3px;
            }
            .breakdown {
              border: 1px solid #E0E0E0;
              border-radius: 12px;
              padding: 14px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .bar-bg {
              background: #E0E0E0;
              border-radius: 6px;
              height: 10px;
              overflow: hidden;
              margin-bottom: 14px;
            }
            .bar-fill {
              height: 10px;
              border-radius: 6px;
            }
            ul {
              margin-top: 8px;
              padding-left: 22px;
            }
            li {
              margin-bottom: 8px;
            }
            .recommendation {
              background: #E3F2FD;
              border-left: 4px solid #2196F3;
              border-radius: 10px;
              padding: 14px;
            }
            .generated {
              color: #777777;
              font-size: 11px;
              text-align: center;
              margin-top: 28px;
            }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(texts.title)}</h1>
          ${profileHtml}
          <section class="score-card">
            <div>${escapeHtml(texts.scoreLabel)}</div>
            <div class="score">${escapeHtml(finalScore)}%</div>
            <div class="level">${escapeHtml(texts.levelText)}</div>
          </section>
          <section>
            <h2>Score Breakdown</h2>
            <div class="breakdown">
              <div class="row"><strong>${escapeHtml(texts.operational)}</strong><strong>${escapeHtml(operationalScore)}%</strong></div>
              <div class="bar-bg"><div class="bar-fill" style="width: ${operationalScore}%; background: ${getScoreColor(operationalScore)};"></div></div>
              <div class="row"><strong>${escapeHtml(texts.knowledge)}</strong><strong>${escapeHtml(knowledgeScore)}%</strong></div>
              <div class="bar-bg"><div class="bar-fill" style="width: ${knowledgeScore}%; background: ${getScoreColor(knowledgeScore)};"></div></div>
            </div>
          </section>
          ${
            translatedStrengths.length > 0
              ? `<section><h2>${escapeHtml(texts.strengths)}</h2><ul>${listItems(translatedStrengths)}</ul></section>`
              : ''
          }
          ${
            translatedWeaknesses.length > 0
              ? `<section><h2>${escapeHtml(texts.weaknesses)}</h2><ul>${listItems(translatedWeaknesses)}</ul></section>`
              : ''
          }
          <section>
            <h2>${escapeHtml(texts.recommendations)}</h2>
            <div class="recommendation">${escapeHtml(recommendation)}</div>
          </section>
          ${
            mastraRecommendations.length > 0
              ? `<section><h2>${escapeHtml(texts.improvementRecommendations)}</h2><ul>${listItems(mastraRecommendations)}</ul></section>`
              : ''
          }
          <p class="generated">Generated on ${escapeHtml(new Date().toLocaleString())}</p>
        </body>
      </html>
    `;
  };

  const handleDownloadResult = async () => {
    setIsDownloading(true);

    try {
      const { uri } = await Print.printToFileAsync({
        html: buildResultHtml(),
        base64: false,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(
          'Download unavailable',
          'Sharing is not available on this device.',
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: i18n.t('results.downloadPdf') || 'Download result',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Result PDF download error:', error);
      Alert.alert(
        i18n.t('errors.generic') || 'Error',
        i18n.t('results.pdfGenerationFailed') ||
          'Unable to generate the result PDF.',
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('results.title')}</Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadResult}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.downloadButtonText}>
                {i18n.t('results.downloadPdf') || 'Download PDF'}
              </Text>
            )}
          </TouchableOpacity>
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
                  <Text style={styles.listText}>{i18n.t(`${strength}`)}</Text>
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
                  <Text style={styles.listText}>{i18n.t(`${weakness}`)}</Text>
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
    gap: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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

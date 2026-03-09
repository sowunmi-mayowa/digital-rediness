import { TaskMetrics, QuestionAnswer, AssessmentResults, UserProfile } from '@/types';

export class ScoringService {
  static calculateOperationalScore(metrics: TaskMetrics[]): number {
    if (metrics.length === 0) return 0;

    let totalScore = 0;
    const weights = {
      speed: 0.4,
      accuracy: 0.6,
    };

    for (const metric of metrics) {
      let taskScore = 100;

      const speedPenalty = Math.min(metric.timeTaken / 1000 / 60, 5) * 5;
      taskScore -= speedPenalty;

      const errorPenalty = metric.errors * 10;
      taskScore -= errorPenalty;

      const retryPenalty = metric.retries * 5;
      taskScore -= retryPenalty;

      if (metric.navigationMistakes !== undefined) {
        const navPenalty = metric.navigationMistakes * 8;
        taskScore -= navPenalty;
      }

      if (metric.tapAccuracy !== undefined) {
        const accuracyBonus = metric.tapAccuracy * 0.2;
        taskScore += accuracyBonus;
      }

      taskScore = Math.max(0, Math.min(100, taskScore));
      totalScore += taskScore;
    }

    const averageScore = totalScore / metrics.length;
    return Math.round(averageScore);
  }

  static calculateKnowledgeScore(answers: QuestionAnswer[]): number {
    if (answers.length === 0) return 0;

    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const percentage = (correctAnswers / answers.length) * 100;
    return Math.round(percentage);
  }

  static calculateFinalScore(operationalScore: number, knowledgeScore: number): number {
    const finalScore = (operationalScore * 0.5) + (knowledgeScore * 0.5);
    return Math.round(finalScore);
  }

  static getScoreLevel(score: number): string {
    if (score >= 81) return 'Advanced';
    if (score >= 61) return 'Intermediate';
    if (score >= 31) return 'Basic';
    return 'Beginner';
  }

  static generateResults(
    userProfile: UserProfile,
    metrics: TaskMetrics[],
    answers: QuestionAnswer[]
  ): AssessmentResults {
    const operationalScore = this.calculateOperationalScore(metrics);
    const knowledgeScore = this.calculateKnowledgeScore(answers);
    const finalScore = this.calculateFinalScore(operationalScore, knowledgeScore);
    const level = this.getScoreLevel(finalScore);

    return {
      userProfile,
      operationalMetrics: metrics,
      questionAnswers: answers,
      operationalScore,
      knowledgeScore,
      finalScore,
      level,
      completedAt: Date.now(),
    };
  }

  static getStrengths(results: AssessmentResults): string[] {
    const strengths: string[] = [];

    const avgTime = results.operationalMetrics.reduce((sum, m) => sum + m.timeTaken, 0) / results.operationalMetrics.length;
    if (avgTime < 30000) {
      strengths.push('speed');
    }

    const avgErrors = results.operationalMetrics.reduce((sum, m) => sum + m.errors, 0) / results.operationalMetrics.length;
    if (avgErrors < 2) {
      strengths.push('accuracy');
    }

    const avgNavMistakes = results.operationalMetrics
      .filter(m => m.navigationMistakes !== undefined)
      .reduce((sum, m) => sum + (m.navigationMistakes || 0), 0);
    if (avgNavMistakes < 2) {
      strengths.push('navigation');
    }

    if (results.knowledgeScore >= 70) {
      strengths.push('knowledge');
    }

    return strengths;
  }

  static getWeaknesses(results: AssessmentResults): string[] {
    const weaknesses: string[] = [];

    const avgTime = results.operationalMetrics.reduce((sum, m) => sum + m.timeTaken, 0) / results.operationalMetrics.length;
    if (avgTime > 60000) {
      weaknesses.push('speed');
    }

    const avgErrors = results.operationalMetrics.reduce((sum, m) => sum + m.errors, 0) / results.operationalMetrics.length;
    if (avgErrors >= 3) {
      weaknesses.push('accuracy');
    }

    const avgNavMistakes = results.operationalMetrics
      .filter(m => m.navigationMistakes !== undefined)
      .reduce((sum, m) => sum + (m.navigationMistakes || 0), 0);
    if (avgNavMistakes >= 3) {
      weaknesses.push('navigation');
    }

    if (results.knowledgeScore < 50) {
      weaknesses.push('knowledge');
    }

    return weaknesses;
  }
}

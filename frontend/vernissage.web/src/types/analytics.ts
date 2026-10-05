// Mirrors Vernissage.Api.Dtos.AnalyticsSummaryDto.

export interface AnalyticsSummary {
  exhibitionCount: number;
  exhibitionsWithMetrics: number;
  totalVisitors: number;
  totalArtworksSold: number;
  totalRevenue: number;
  totalCost: number;
  averageSatisfaction: number | null;
}

export interface AppConfig {
  analyticsEnabled: boolean;
  /** Whether the AI assistant for documenting shows is configured. */
  assistantEnabled?: boolean;
}

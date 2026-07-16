// Mirrors Vernissage.Api.Dtos metrics DTOs (owner-only data).

export interface CostItem {
  id: string;
  label: string;
  amount: number;
}

export interface ExhibitionMetrics {
  visitorsCount: number | null;
  satisfaction: number | null;
  artworksSold: number | null;
  totalRevenue: number | null;
  totalCost: number;
  costItems: CostItem[];
  updatedAtUtc: string | null;
}

export interface CostItemWrite {
  label: string;
  amount: number;
}

export interface MetricsWrite {
  visitorsCount: number | null;
  satisfaction: number | null;
  artworksSold: number | null;
  totalRevenue: number | null;
  costItems: CostItemWrite[];
}

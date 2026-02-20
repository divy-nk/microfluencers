export interface User {
  id: string;
  email: string;
  role: 'brand' | 'creator';
  profile?: any;
  trust_score?: number;
}

export interface Drop {
  id: string;
  brand_id: string;
  title?: string;
  description?: string;
  product_link: string;
  quantity: number;
  template_id?: string;
  campaign_type: 'barter' | 'performance' | 'boosted';
  product_value?: number;
  cpm_rate?: number;          // ₹ per 1000 unique views
  view_threshold?: number;    // Min views to trigger bonus (boosted)
  bonus_amount?: number;      // ₹ bonus payout (boosted)
  max_budget?: number;        // Total spend cap (performance)
  shipping_method?: 'direct' | 'quick_commerce' | 'self_purchase';
  status: 'draft' | 'active' | 'closed';
  created_at?: string;
}

export interface Application {
  id: string;
  drop_id: string;
  creator_id: string;
  status: 'applied' | 'purchased' | 'uploaded' | 'approved' | 'paid' | 'rejected';
  order_id?: string;
  order_screenshot?: string;
  video_url?: string;
  content_url?: string;         // Instagram post URL
  unique_views?: number;
  engagement_rate?: number;
  performance_payout?: number;
  bonus_triggered?: boolean;
  last_view_sync?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  payout_status: 'pending' | 'paid' | 'failed';
  created_at?: string;
  drop?: Drop; // Joined data
}

export interface Template {
  id: string;
  name: string;
  structure: any;
  description?: string;
}

export interface Payout {
  id: string;
  application_id: string;
  creator_id: string;
  type: 'reimbursement' | 'performance' | 'bonus';
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  upi_reference?: string;
  created_at?: string;
  paid_at?: string;
}

export interface ViewSnapshot {
  id: string;
  application_id: string;
  unique_views: number;
  engagement_rate?: number;
  source: 'instagram' | 'youtube';
  snapshot_at: string;
}

export interface TrustInfo {
  score: number;
  tier: 'STANDARD' | 'EXPRESS' | 'INSTANT';
  successful_drops: number;
  blacklisted: boolean;
  next_tier_at: number | null;
  points_to_next: number;
}

export interface UpcomingPayout {
  id: string;
  type: 'reimbursement' | 'performance' | 'bonus';
  amount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  hold_until: string | null;
  paused: boolean;
  campaign: string;
  days_remaining: number;
}

export interface TrustDashboardData {
  trust: TrustInfo;
  upcoming_payouts: UpcomingPayout[];
}


// 플레이어 타입 정의
export interface Player {
  id: string;
  name: string;
  score: number;
}

// 팀 타입 정의
export interface Team {
  id: string;
  name: string;
  players: Player[];
  totalScore: number;
  averageScore: number;
}

// 팀 배정 알고리즘 타입
export type AlgorithmType = 'greedy' | 'optimal' | 'random' | 'snake';

// 팀 배정 결과 타입
export interface TeamAssignmentResult {
  teams: Team[];
  balanceScore: number; // 0-100 점수 (100에 가까울수록 밸런스가 좋음)
  standardDeviation: number;
  scoreGap: number; // 최고점과 최저점 차이
}

// 통계 정보 타입
export interface TeamStats {
  totalPlayers: number;
  averageScore: number;
  minScore: number;
  maxScore: number;
  standardDeviation: number;
}

// Firebase 관련 타입들
export interface Match {
  id: string;
  title: string;
  date: string;
  players: Player[];
  teams: Team[];
  algorithm: AlgorithmType;
  createdAt: number;
  updatedAt: number;
  settings: {
    teamCount: number;
    algorithm: AlgorithmType;
    balanceScore: number;
  };
}

export interface PlayerRecord {
  id: string;
  name: string;
  totalMatches: number;
  averageScore: number;
  lastScore: number;
  winRate: number;
}

// UI 상태 타입
export interface AppState {
  currentStep: 'input' | 'configure' | 'result';
  players: Player[];
  teamCount: number;
  algorithm: AlgorithmType;
  result: TeamAssignmentResult | null;
  isLoading: boolean;
}
import type { Player, Team, TeamAssignmentResult, AlgorithmType } from '../types';

// 팀 이름 생성을 위한 배열들
const teamNamePrefixes = [
  '불타는', '강력한', '빠른', '용감한', '지혜로운', '전설의', '무적의', '황금의',
  '번개같은', '바람의', '태양의', '달빛의', '별의', '드래곤', '피닉스', '타이거'
];

const teamNameSuffixes = [
  '전사들', '용사들', '팀', '부대', '크루', '길드', '클랜', '그룹',
  '멤버스', '히어로즈', '파이터즈', '챔피언스', '레전드', '마스터즈', '엘리트', '포스'
];

// 랜덤 팀 이름 생성
export const generateTeamName = (): string => {
  const prefix = teamNamePrefixes[Math.floor(Math.random() * teamNamePrefixes.length)];
  const suffix = teamNameSuffixes[Math.floor(Math.random() * teamNameSuffixes.length)];
  return `${prefix} ${suffix}`;
};

// 팀 통계 계산
export const calculateTeamStats = (players: Player[]): { totalScore: number; averageScore: number } => {
  const totalScore = players.reduce((sum, player) => sum + player.score, 0);
  const averageScore = players.length > 0 ? totalScore / players.length : 0;
  return { totalScore, averageScore };
};

// 표준편차 계산
export const calculateStandardDeviation = (teams: Team[]): number => {
  if (teams.length === 0) return 0;
  
  const totalScores = teams.map(team => team.totalScore);
  const mean = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;
  const variance = totalScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / totalScores.length;
  
  return Math.sqrt(variance);
};

// 밸런스 점수 계산 (0-100)
export const calculateBalanceScore = (teams: Team[]): number => {
  if (teams.length <= 1) return 100;
  
  const standardDeviation = calculateStandardDeviation(teams);
  const totalScores = teams.map(team => team.totalScore);
  const maxScore = Math.max(...totalScores);
  const minScore = Math.min(...totalScores);
  const scoreGap = maxScore - minScore;
  const averageScore = totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length;
  
  // 표준편차와 점수 격차를 기반으로 밸런스 점수 계산
  const stdDevRatio = averageScore > 0 ? standardDeviation / averageScore : 0;
  const gapRatio = averageScore > 0 ? scoreGap / averageScore : 0;
  
  // 0에 가까울수록 좋은 밸런스
  const balanceRatio = (stdDevRatio + gapRatio) / 2;
  
  // 100점 만점으로 변환 (밸런스가 좋을수록 높은 점수)
  return Math.max(0, Math.min(100, 100 - (balanceRatio * 100)));
};

// Greedy 알고리즘: 항상 가장 점수가 낮은 팀에 다음 플레이어를 배정
export const greedyAlgorithm = (players: Player[], teamCount: number): Team[] => {
  // 점수 기준 내림차순 정렬
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  // 팀 초기화
  const teams: Team[] = Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: generateTeamName(),
    players: [],
    totalScore: 0,
    averageScore: 0,
  }));
  
  // 각 플레이어를 가장 점수가 낮은 팀에 배정
  sortedPlayers.forEach(player => {
    // 현재 총점이 가장 낮은 팀 찾기
    const targetTeam = teams.reduce((minTeam, currentTeam) => 
      currentTeam.totalScore < minTeam.totalScore ? currentTeam : minTeam
    );
    
    targetTeam.players.push(player);
    const stats = calculateTeamStats(targetTeam.players);
    targetTeam.totalScore = stats.totalScore;
    targetTeam.averageScore = stats.averageScore;
  });
  
  return teams;
};

// Snake 알고리즘: 1-2-3-3-2-1 순서로 배정
export const snakeAlgorithm = (players: Player[], teamCount: number): Team[] => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  
  const teams: Team[] = Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: generateTeamName(),
    players: [],
    totalScore: 0,
    averageScore: 0,
  }));
  
  let currentTeamIndex = 0;
  let direction = 1; // 1: 증가, -1: 감소
  
  sortedPlayers.forEach(player => {
    teams[currentTeamIndex].players.push(player);
    
    // 다음 팀 인덱스 계산
    if (direction === 1 && currentTeamIndex === teamCount - 1) {
      direction = -1;
    } else if (direction === -1 && currentTeamIndex === 0) {
      direction = 1;
    } else {
      currentTeamIndex += direction;
    }
  });
  
  // 팀 통계 업데이트
  teams.forEach(team => {
    const stats = calculateTeamStats(team.players);
    team.totalScore = stats.totalScore;
    team.averageScore = stats.averageScore;
  });
  
  return teams;
};

// 최적화 알고리즘 (Brute-force, 팀 수가 작을 때만 사용)
export const optimalAlgorithm = (players: Player[], teamCount: number): Team[] => {
  // 팀 수가 2~4일 때만 사용 (조합 폭발 방지)
  if (teamCount < 2 || teamCount > 4 || players.length > 12) {
    return greedyAlgorithm(players, teamCount);
  }
  // 모든 조합을 탐색하여 표준편차가 가장 작은 팀 배정 선택
  // (실제 서비스에서는 더 빠른 알고리즘 필요)
  // 여기서는 예시로 간단하게 구현
  // Removed unused variables: bestTeams, bestStd
  // 모든 조합 생성 (팀별로 분배)
  // ...실제 구현은 생략 (조합 폭발 방지)
  // 임시로 greedy 결과 반환
  return greedyAlgorithm(players, teamCount);
};

// 랜덤 알고리즘: 완전 랜덤 배정
export const randomAlgorithm = (players: Player[], teamCount: number): Team[] => {
  const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
  
  const teams: Team[] = Array.from({ length: teamCount }, (_, index) => ({
    id: `team-${index + 1}`,
    name: generateTeamName(),
    players: [],
    totalScore: 0,
    averageScore: 0,
  }));
  
  shuffledPlayers.forEach((player, index) => {
    const teamIndex = index % teamCount;
    teams[teamIndex].players.push(player);
  });
  
  // 팀 통계 업데이트
  teams.forEach(team => {
    const stats = calculateTeamStats(team.players);
    team.totalScore = stats.totalScore;
    team.averageScore = stats.averageScore;
  });
  
  return teams;
};

// 메인 팀 배정 함수
export const assignTeams = (
  players: Player[], 
  teamCount: number, 
  algorithm: AlgorithmType = 'greedy'
): TeamAssignmentResult => {
  let teams: Team[] = [];
  if (algorithm === 'greedy') teams = greedyAlgorithm(players, teamCount);
  else if (algorithm === 'optimal') teams = optimalAlgorithm(players, teamCount);
  else if (algorithm === 'random') teams = randomAlgorithm(players, teamCount);
  else teams = greedyAlgorithm(players, teamCount);

  const balanceScore = calculateBalanceScore(teams);
  const standardDeviation = calculateStandardDeviation(teams);
  const totalScores = teams.map(t => t.totalScore);
  const scoreGap = Math.max(...totalScores) - Math.min(...totalScores);

  return {
    teams,
    balanceScore,
    standardDeviation,
    scoreGap,
  };
};

// 플레이어 입력 텍스트 파싱
export const parsePlayersFromText = (text: string): Player[] => {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const players: Player[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // 다양한 형식 지원: "이름 점수", "이름,점수", "이름:점수", "이름 - 점수"
    const patterns = [
      /^(.+?)\s+(\d+(?:\.\d+)?)$/, // "이름 점수"
      /^(.+?),\s*(\d+(?:\.\d+)?)$/, // "이름,점수"
      /^(.+?):\s*(\d+(?:\.\d+)?)$/, // "이름:점수"
      /^(.+?)\s*-\s*(\d+(?:\.\d+)?)$/, // "이름 - 점수"
    ];
    
    let matched = false;
    for (const pattern of patterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const name = match[1].trim();
        const score = parseFloat(match[2]);
        
        if (name && !isNaN(score)) {
          players.push({
            id: `player-${index + 1}`,
            name,
            score,
          });
          matched = true;
          break;
        }
      }
    }
    
    // 점수 없이 이름만 있는 경우 기본 점수 50 할당
    if (!matched && trimmedLine) {
      players.push({
        id: `player-${index + 1}`,
        name: trimmedLine,
        score: 50,
      });
    }
  });
  
  return players;
};
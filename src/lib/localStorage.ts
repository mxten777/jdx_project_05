// localStorage를 활용한 로컬 저장 유틸리티
import type { Match, PlayerRecord } from '../types';

const STORAGE_KEYS = {
  MATCHES: 'team-balancer-matches',
  PLAYERS: 'team-balancer-players',
  SETTINGS: 'team-balancer-settings',
} as const;

// 매치 저장
export const saveMatchToLocal = (match: Match): void => {
  try {
    const existingMatches = getLocalMatches();
    const updatedMatches = [match, ...existingMatches.slice(0, 49)]; // 최대 50개 저장
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updatedMatches));
    
    // 플레이어 기록도 업데이트
    updateLocalPlayerRecords(match);
  } catch (error) {
    console.error('Error saving match to localStorage:', error);
  }
};

// 매치 목록 조회
export const getLocalMatches = (): Match[] => {
  try {
    const matches = localStorage.getItem(STORAGE_KEYS.MATCHES);
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    console.error('Error getting matches from localStorage:', error);
    return [];
  }
};

// 특정 매치 조회
export const getLocalMatch = (matchId: string): Match | null => {
  try {
    const matches = getLocalMatches();
    return matches.find(match => match.id === matchId) || null;
  } catch (error) {
    console.error('Error getting match from localStorage:', error);
    return null;
  }
};

// 매치 삭제
export const deleteLocalMatch = (matchId: string): void => {
  try {
    const matches = getLocalMatches();
    const filteredMatches = matches.filter(match => match.id !== matchId);
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(filteredMatches));
  } catch (error) {
    console.error('Error deleting match from localStorage:', error);
  }
};

// 플레이어 기록 업데이트
export const updateLocalPlayerRecords = (match: Match): void => {
  try {
    const existingRecords = getLocalPlayerRecords();
    const recordsMap = new Map(existingRecords.map(record => [record.name, record]));
    
    // 승리 팀 찾기 (가장 높은 점수)
    const maxTeamScore = Math.max(...match.teams.map(team => team.totalScore));
    const winningTeams = match.teams.filter(team => team.totalScore === maxTeamScore);
    
    match.players.forEach(player => {
      const isWinner = winningTeams.some(team => 
        team.players.some(p => p.id === player.id)
      );
      
      const existingRecord = recordsMap.get(player.name);
      
      if (existingRecord) {
        // 기존 기록 업데이트
        const newTotalMatches = existingRecord.totalMatches + 1;
        const newWinCount = (existingRecord.winRate * existingRecord.totalMatches) + (isWinner ? 1 : 0);
        
        const updatedRecord: PlayerRecord = {
          ...existingRecord,
          totalMatches: newTotalMatches,
          averageScore: (existingRecord.averageScore * existingRecord.totalMatches + player.score) / newTotalMatches,
          lastScore: player.score,
          winRate: newWinCount / newTotalMatches,
        };
        
        recordsMap.set(player.name, updatedRecord);
      } else {
        // 새 기록 생성
        const newRecord: PlayerRecord = {
          id: player.id,
          name: player.name,
          totalMatches: 1,
          averageScore: player.score,
          lastScore: player.score,
          winRate: isWinner ? 1 : 0,
        };
        
        recordsMap.set(player.name, newRecord);
      }
    });
    
    const updatedRecords = Array.from(recordsMap.values())
      .sort((a, b) => b.winRate - a.winRate || b.averageScore - a.averageScore);
    
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(updatedRecords));
  } catch (error) {
    console.error('Error updating player records:', error);
  }
};

// 플레이어 기록 조회
export const getLocalPlayerRecords = (): PlayerRecord[] => {
  try {
    const records = localStorage.getItem(STORAGE_KEYS.PLAYERS);
    return records ? JSON.parse(records) : [];
  } catch (error) {
    console.error('Error getting player records from localStorage:', error);
    return [];
  }
};

// 플레이어 검색 (자동완성용)
export const searchLocalPlayers = (searchTerm: string): PlayerRecord[] => {
  try {
    const records = getLocalPlayerRecords();
    return records
      .filter(record => 
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10);
  } catch (error) {
    console.error('Error searching players:', error);
    return [];
  }
};

// 설정 저장/조회
export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  defaultTeamCount: number;
  defaultAlgorithm: 'greedy' | 'snake' | 'random';
  autoSave: boolean;
  teamColors: string[];
}

export const getLocalSettings = (): AppSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: AppSettings = {
      theme: 'light',
      language: 'ko',
      defaultTeamCount: 2,
      defaultAlgorithm: 'greedy',
      autoSave: true,
      teamColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    };
    
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  } catch (error) {
    console.error('Error getting settings from localStorage:', error);
    return {
      theme: 'light',
      language: 'ko',
      defaultTeamCount: 2,
      defaultAlgorithm: 'greedy',
      autoSave: true,
      teamColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
    };
  }
};

export const saveLocalSettings = (settings: Partial<AppSettings>): void => {
  try {
    const currentSettings = getLocalSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
};

// 데이터 내보내기 (JSON)
export const exportData = () => {
  try {
    const data = {
      matches: getLocalMatches(),
      players: getLocalPlayerRecords(),
      settings: getLocalSettings(),
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team-balancer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

// 데이터 가져오기 (JSON)
export const importData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.matches) {
            localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(data.matches));
          }
          if (data.players) {
            localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(data.players));
          }
          if (data.settings) {
            localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
          }
          
          resolve(true);
        } catch (parseError) {
          console.error('Error parsing import data:', parseError);
          reject(false);
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        reject(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing data:', error);
      reject(false);
    }
  });
};

// 전체 데이터 삭제
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.PLAYERS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Match, PlayerRecord, Player, Team } from '../types';

// 매치 저장
export const saveMatch = async (matchData: Omit<Match, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const matchRef = doc(collection(db, 'matches'));
    const now = Date.now();
    
    const match: Match = {
      ...matchData,
      id: matchRef.id,
      createdAt: now,
      updatedAt: now,
    };
    
    await setDoc(matchRef, match);
    
    // 플레이어 기록 업데이트
    await updatePlayerRecords(matchData.players, matchData.teams);
    
    return matchRef.id;
  } catch (error) {
    console.error('Error saving match:', error);
    throw error;
  }
};

// 매치 조회
export const getMatch = async (matchId: string): Promise<Match | null> => {
  try {
    const matchDoc = await getDoc(doc(db, 'matches', matchId));
    return matchDoc.exists() ? (matchDoc.data() as Match) : null;
  } catch (error) {
    console.error('Error getting match:', error);
    throw error;
  }
};

// 최근 매치 목록 조회
export const getRecentMatches = async (limitCount: number = 10): Promise<Match[]> => {
  try {
    const q = query(
      collection(db, 'matches'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Match);
  } catch (error) {
    console.error('Error getting recent matches:', error);
    throw error;
  }
};

// 플레이어 기록 업데이트
export const updatePlayerRecords = async (players: Player[], teams: Team[]): Promise<void> => {
  try {
    const updates = players.map(async (player) => {
      const playerRef = doc(db, 'players', player.name);
      const playerDoc = await getDoc(playerRef);
      
      // 승리 여부 확인 (가장 높은 점수 팀 소속 확인)
      const playerTeam = teams.find(team => team.players.some(p => p.id === player.id));
      const maxTeamScore = Math.max(...teams.map(team => team.totalScore));
      const isWinner = playerTeam?.totalScore === maxTeamScore;
      
      if (playerDoc.exists()) {
        // 기존 플레이어 기록 업데이트
        const existingData = playerDoc.data() as PlayerRecord;
        const newTotalMatches = existingData.totalMatches + 1;
        const newWinCount = existingData.winRate * existingData.totalMatches + (isWinner ? 1 : 0);
        
        await updateDoc(playerRef, {
          totalMatches: increment(1),
          averageScore: (existingData.averageScore * existingData.totalMatches + player.score) / newTotalMatches,
          lastScore: player.score,
          winRate: newWinCount / newTotalMatches,
        });
      } else {
        // 새 플레이어 기록 생성
        const newPlayerRecord: PlayerRecord = {
          id: player.id,
          name: player.name,
          totalMatches: 1,
          averageScore: player.score,
          lastScore: player.score,
          winRate: isWinner ? 1 : 0,
        };
        
        await setDoc(playerRef, newPlayerRecord);
      }
    });
    
    await Promise.all(updates);
  } catch (error) {
    console.error('Error updating player records:', error);
    throw error;
  }
};

// 플레이어 기록 조회
export const getPlayerRecord = async (playerName: string): Promise<PlayerRecord | null> => {
  try {
    const playerDoc = await getDoc(doc(db, 'players', playerName));
    return playerDoc.exists() ? (playerDoc.data() as PlayerRecord) : null;
  } catch (error) {
    console.error('Error getting player record:', error);
    throw error;
  }
};

// 플레이어 기록 목록 조회 (승률 순)
export const getPlayerRecords = async (limitCount: number = 50): Promise<PlayerRecord[]> => {
  try {
    const q = query(
      collection(db, 'players'),
      orderBy('winRate', 'desc'),
      orderBy('averageScore', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PlayerRecord);
  } catch (error) {
    console.error('Error getting player records:', error);
    throw error;
  }
};

// 매치 삭제
export const deleteMatch = async (matchId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'matches', matchId));
  } catch (error) {
    console.error('Error deleting match:', error);
    throw error;
  }
};

// 플레이어 검색 (자동완성용)
export const searchPlayers = async (searchTerm: string): Promise<PlayerRecord[]> => {
  try {
    const q = query(
      collection(db, 'players'),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as PlayerRecord);
  } catch (error) {
    console.error('Error searching players:', error);
    throw error;
  }
};
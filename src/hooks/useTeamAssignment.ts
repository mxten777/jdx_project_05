import { useState, useCallback } from 'react';
import { assignTeams } from '../utils/algorithms';
import type { Player, AlgorithmType, TeamAssignmentResult } from '../types';

export const useTeamAssignment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TeamAssignmentResult | null>(null);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('greedy');
  const [teamCount, setTeamCount] = useState(2);

  const assignPlayersToTeams = useCallback(async (players: Player[]) => {
    if (players.length === 0) return;

    setIsLoading(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assignmentResult = assignTeams(players, teamCount, algorithm);
      setResult(assignmentResult);
    } catch (error) {
      console.error('Team assignment failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [teamCount, algorithm]);

  const resetAssignment = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isLoading,
    result,
    algorithm,
    setAlgorithm,
    teamCount,
    setTeamCount,
    assignPlayersToTeams,
    resetAssignment
  };
};
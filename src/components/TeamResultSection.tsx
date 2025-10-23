import React from 'react';
import type { TeamAssignmentResult } from '../types';

interface TeamResultSectionProps {
  matchTitle: string;
  result: TeamAssignmentResult;
  isLoading: boolean;
  onShuffle: () => void;
  onCopy: () => void;
  onShare: () => void;
  onNewGame: () => void;
}

const TeamResultSection: React.FC<TeamResultSectionProps> = ({
  matchTitle,
  result,
  isLoading,
  onShuffle,
  onCopy,
  onShare,
  onNewGame,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        팀 배정 결과
      </h2>

      <div className="text-center mb-4">
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {matchTitle}
        </div>
        <div className="text-sm text-blue-600 dark:text-blue-400">
          밸런스 점수: {result.balanceScore.toFixed(1)}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.teams.map((team, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              🏆 팀 {index + 1}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              총점: {team.totalScore} | 평균: {team.averageScore.toFixed(1)}
            </div>
            <div className="space-y-1">
              {team.players.map((player, playerIndex) => (
                <div key={playerIndex} className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white">{player.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{player.score}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onShuffle}
          disabled={isLoading}
          className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
        >
          🔄 다시 배정
        </button>
        <button
          onClick={onCopy}
          className="flex-1 bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          📋 복사
        </button>
        <button
          onClick={onShare}
          className="flex-1 bg-green-600 text-white p-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          📤 공유
        </button>
      </div>

      <button
        onClick={onNewGame}
        className="w-full bg-gray-500 text-white p-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
      >
        새로운 배정 시작
      </button>
    </div>
  );
};

export default TeamResultSection;
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
  const isGeneralMatch = matchTitle === '일반팀 배정';
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

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-8">
        {result.teams.map((team, index) => (
          <div key={index} className={`rounded-2xl shadow-xl p-6 border border-yellow-200 md:border-2 ${team.id === 'bench' ? 'bg-gradient-to-br from-green-100 via-green-200 to-green-300 border-green-200' : 'bg-gradient-to-br from-blue-50 via-white to-yellow-50'} mt-2 md:mt-4`}>
            <h3 className={`text-xl font-extrabold mb-2 flex items-center gap-2 ${team.id === 'bench' ? 'text-green-700' : 'text-blue-900 dark:text-yellow-300'}`}>
              {team.id === 'bench' ? '🥒 깍두기팀' : `🏆 ${team.name}`}
            </h3>
            {!isGeneralMatch && (
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                총점: <span className="font-bold text-yellow-700 dark:text-yellow-300">{team.totalScore}</span> | 평균: <span className="font-bold text-blue-700 dark:text-yellow-200">{team.averageScore.toFixed(1)}</span>
              </div>
            )}
            <div className="space-y-2">
              {team.players.map((player, playerIndex) => (
                <div key={playerIndex} className="flex justify-between items-center px-2 py-1 rounded-lg bg-white/60 dark:bg-gray-800/60">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{player.name}</span>
                  {!isGeneralMatch && (
                    <span className="text-base text-gray-600 dark:text-gray-400">{player.score}</span>
                  )}
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
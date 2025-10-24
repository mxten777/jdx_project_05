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
        {result.teams.map((team) => (
          <div key={team.id || team.name} className={`rounded-2xl shadow-lg p-3 sm:p-5 md:p-7 border-2 ${team.id === 'bench' ? 'bg-gradient-to-br from-green-50 via-green-100 to-green-200 border-green-300' : 'bg-gradient-to-br from-gold-50 via-white to-navy-50 border-gold-300'} mt-1 sm:mt-2 md:mt-4 font-premium`}> 
            <h3 className={`text-lg font-normal mb-2 flex items-center gap-2 ${team.id === 'bench' ? 'text-green-700' : 'text-navy-700 dark:text-gold-500'}`}>
              {team.id === 'bench' ? '🥒 깍두기팀' : `🏆 ${team.name}`}
            </h3>
            {!isGeneralMatch && (
              <div className="text-xs text-navy-700 dark:text-gold-400 mb-3 font-normal">
                총점: <span className="text-gold-600 dark:text-gold-300 font-normal">{team.totalScore}</span> | 평균: <span className="text-navy-600 dark:text-gold-200 font-normal">{team.averageScore.toFixed(1)}</span>
              </div>
            )}
            <div className="space-y-2">
              {team.players.map((player, playerIndex) => (
                <div key={playerIndex} className="flex justify-between items-center px-2 py-1 rounded-lg bg-white/60 dark:bg-navy-900/60 font-premium">
                  <span className="text-xs sm:text-sm font-normal text-black dark:text-white">{player.name}</span>
                  {!isGeneralMatch && (
                    <span className="text-xs sm:text-sm text-navy-500 dark:text-gold-300 font-normal">{player.score}</span>
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
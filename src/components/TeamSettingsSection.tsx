import React from 'react';
import type { AlgorithmType } from '../types';

interface TeamSettingsSectionProps {
  teamCount: number;
  setTeamCount: (count: number) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  onPrevious: () => void;
  onAssign: () => void;
  isLoading: boolean;
}

const TeamSettingsSection: React.FC<TeamSettingsSectionProps> = ({
  teamCount,
  setTeamCount,
  algorithm,
  setAlgorithm,
  onPrevious,
  onAssign,
  isLoading,
}) => {
  return (
  <div className="space-y-6 rounded-2xl shadow-xl p-6 border border-yellow-200 md:border-2 bg-gradient-to-br from-blue-50 via-white to-yellow-50 mt-4 md:mt-8">
      <h2 className="text-2xl font-extrabold text-center text-blue-900 dark:text-yellow-300 mb-2">
        팀 설정
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          팀 개수
        </label>
        <select
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
          className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-800 dark:border-yellow-300 dark:text-white text-lg font-semibold shadow-sm"
        >
          {[2, 3, 4].map(num => (
            <option key={num} value={num}>{num}팀</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          배정 방식
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-800 dark:border-yellow-300 dark:text-white text-lg font-semibold shadow-sm"
        >
          <option value="greedy">그리디 (균형 우선)</option>
          <option value="snake">스네이크 드래프트</option>
          <option value="random">랜덤 배정</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          className="flex-1 bg-gradient-to-r from-gray-400 via-gray-600 to-blue-700 text-white p-3 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform"
        >
          이전
        </button>
        <button
          onClick={onAssign}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-blue-700 text-white p-3 rounded-xl font-bold text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          {isLoading ? '배정 중...' : '팀 배정 시작'}
        </button>
      </div>
    </div>
  );
};

export default TeamSettingsSection;
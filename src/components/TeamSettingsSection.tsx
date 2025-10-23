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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        팀 설정
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          팀 개수
        </label>
        <select
          value={teamCount}
          onChange={(e) => setTeamCount(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {[2, 3, 4, 5, 6].map(num => (
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="greedy">그리디 (균형 우선)</option>
          <option value="snake">스네이크 드래프트</option>
          <option value="random">랜덤 배정</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          className="flex-1 bg-gray-500 text-white p-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
        >
          이전
        </button>
        <button
          onClick={onAssign}
          disabled={isLoading}
          className="flex-1 bg-green-600 text-white p-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          {isLoading ? '배정 중...' : '팀 배정 시작'}
        </button>
      </div>
    </div>
  );
};

export default TeamSettingsSection;
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
  <div className="space-y-4 sm:space-y-6 rounded-2xl shadow-lg p-3 sm:p-5 md:p-7 border-2 bg-gradient-to-br from-gold-50 via-white to-navy-50 border-gold-300 mt-2 sm:mt-4 md:mt-8 font-premium">
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
          className="w-full p-2 sm:p-3 border-2 border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white dark:bg-navy-900 dark:border-gold-300 dark:text-white text-sm sm:text-base font-normal shadow-sm font-premium"
        >
          <option value={1}>1팀(전체)</option>
          {[2, 3, 4].map(num => (
            <option key={num} value={num}>{num}팀</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          배정 방식 <span className="text-xs text-gray-400">(기본: 그리디, 인원 균등+점수 밸런스)</span>
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
          className="w-full p-2 sm:p-3 border-2 border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white dark:bg-navy-900 dark:border-gold-300 dark:text-white text-sm sm:text-base font-normal shadow-sm font-premium"
        >
          <option value="greedy">그리디 (인원 균등+점수 밸런스)</option>
          <option value="snake">스네이크 드래프트</option>
          <option value="random">랜덤 배정</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrevious}
          className="flex-1 bg-gradient-to-r from-navy-400 via-navy-600 to-gold-400 text-white p-2 sm:p-3 rounded-xl font-normal text-sm sm:text-base shadow-md hover:scale-105 transition-transform font-premium"
        >
          이전
        </button>
        <button
          onClick={onAssign}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-gold-400 via-gold-600 to-navy-700 text-white p-2 sm:p-3 rounded-xl font-normal text-sm sm:text-base shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 transition-transform font-premium"
        >
          {isLoading ? '배정 중...' : '팀 배정 시작'}
        </button>
      </div>
    </div>
  );
};

export default TeamSettingsSection;
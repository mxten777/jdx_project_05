import React from 'react';
import type { Player } from '../types';

interface PlayerInputSectionProps {
  matchTitle: string;
  setMatchTitle: (title: string) => void;
  playerInput: string;
  setPlayerInput: (input: string) => void;
  parsedPlayers: Player[];
  onNext: () => void;
}

const PlayerInputSection: React.FC<PlayerInputSectionProps> = ({
  matchTitle,
  setMatchTitle,
  playerInput,
  setPlayerInput,
  parsedPlayers,
  onNext,
}) => {
  const isValid = parsedPlayers.length >= 2 && matchTitle.trim();

  return (
  <div className="space-y-6 rounded-2xl shadow-xl p-6 border border-yellow-200 md:border-2 bg-gradient-to-br from-blue-50 via-white to-yellow-50 mt-4 md:mt-8">
      <h2 className="text-2xl font-extrabold text-center text-blue-900 dark:text-yellow-300 mb-2">
        참가자 입력
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          경기 제목
        </label>
        <select
          value={matchTitle}
          onChange={(e) => setMatchTitle(e.target.value)}
          className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-800 dark:border-yellow-300 dark:text-white text-lg font-semibold shadow-sm"
        >
          <option value="">경기 제목을 선택하세요</option>
          <option value="스크린 팀배정">스크린 팀배정</option>
          <option value="일반팀 배정">일반팀 배정</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          참가자 정보
        </label>
        <textarea
          placeholder="참가자 이름과 점수를 입력하세요 (예: 김철수 85)"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          className="w-full p-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-800 dark:border-yellow-300 dark:text-white text-lg font-semibold shadow-sm h-40"
        />
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          인식된 참가자: <span className="font-semibold">{parsedPlayers.length}명</span>
          {parsedPlayers.length > 0 && (
            <div className="mt-1 text-gray-600 dark:text-gray-400">
              {parsedPlayers.map(p => `${p.name}(${p.score})`).join(', ')}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-gradient-to-r from-yellow-400 via-yellow-600 to-blue-700 text-white p-3 rounded-xl font-bold text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 transition-transform"
      >
        다음 단계 ({parsedPlayers.length}/2명 이상)
      </button>
    </div>
  );
};

export default PlayerInputSection;
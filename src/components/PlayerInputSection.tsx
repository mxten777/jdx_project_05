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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        참가자 입력
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          경기 제목
        </label>
        <input
          type="text"
          placeholder="경기 제목을 입력하세요"
          value={matchTitle}
          onChange={(e) => setMatchTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          참가자 정보
        </label>
        <textarea
          placeholder="참가자 이름과 점수를 입력하세요 (예: 김철수 85)"
          value={playerInput}
          onChange={(e) => setPlayerInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        다음 단계 ({parsedPlayers.length}/2명 이상)
      </button>
    </div>
  );
};

export default PlayerInputSection;
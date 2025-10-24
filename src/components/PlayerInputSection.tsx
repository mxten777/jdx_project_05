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
  <div className="space-y-4 sm:space-y-6 rounded-2xl shadow-lg p-3 sm:p-5 md:p-7 border-2 bg-gradient-to-br from-gold-50 via-white to-navy-50 border-gold-300 mt-2 sm:mt-4 md:mt-8 font-premium">
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
          className="w-full p-2 sm:p-3 border-2 border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white dark:bg-navy-900 dark:border-gold-300 dark:text-white text-sm sm:text-base font-normal shadow-sm font-premium"
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
          className="w-full p-2 sm:p-3 border-2 border-gold-300 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent bg-white dark:bg-navy-900 dark:border-gold-300 dark:text-white text-sm sm:text-base font-normal shadow-sm h-32 sm:h-40 font-premium"
        />
        <div className="mt-2 text-xs font-normal text-yellow-500 dark:text-yellow-300 px-1 text-left">
          <span className="inline-block">⭐️⭐️ <span className="font-semibold text-rose-600 dark:text-rose-400">주의사항:</span> <span className="text-navy-700 dark:text-gold-400">숫자는 0~28까지</span> 입력,</span>
          <span className="inline-block ml-1">인원 구분은 <span className="text-navy-700 dark:text-gold-400">콤마(,)</span>, <span className="text-navy-700 dark:text-gold-400">슬래시(/)</span>, <span className="text-navy-700 dark:text-gold-400">줄넘김</span>으로 구분합니다.</span>
        </div>
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          인식된 참가자: <span className="font-semibold">{parsedPlayers.length}명</span>
          {parsedPlayers.length > 0 && (
            <div className="mt-1 text-gray-600 dark:text-gray-400">
              {parsedPlayers.map(p => `${p.name}(${p.score})`).join(', ')}
            </div>
          )}
        </div>
        {/* 중복 주의사항 안내 제거 */}
      </div>
      <button
        onClick={onNext}
        disabled={!isValid}
  className="w-full bg-gradient-to-r from-gold-400 via-gold-600 to-navy-700 text-white p-2 sm:p-3 rounded-xl font-normal text-sm sm:text-base shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-105 transition-transform font-premium"
      >
        다음 단계 ({parsedPlayers.length}/2명 이상)
      </button>
    </div>
  );
};

export default PlayerInputSection;
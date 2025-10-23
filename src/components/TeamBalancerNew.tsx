import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Components
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import PlayerInputSection from './PlayerInputSection';
import TeamSettingsSection from './TeamSettingsSection';
import TeamDisplaySection from './TeamDisplaySection';
import HistoryModal from './HistoryModal';
import ChartsModal from './ChartsModal';
import Toast from './Toast';
import { SpinnerOverlay } from './Spinner';

// Hooks
import { useToast, usePlayerInput, useTeamAssignment } from '../hooks';

// Types
// import type { Match } from '../types';

const TeamBalancer: React.FC = () => {
  // State
  const [currentStep, setCurrentStep] = useState<'input' | 'settings' | 'result'>('input');
  const [matchTitle, setMatchTitle] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isChartsOpen, setIsChartsOpen] = useState(false);

  // Hooks
  const { toast, showToast, hideToast } = useToast();
  const { parsedPlayers } = usePlayerInput();
  const {
    isLoading,
    result,
    algorithm,
    setAlgorithm,
    teamCount,
    setTeamCount,
    assignPlayersToTeams
  } = useTeamAssignment();

  // Handlers
  const handlePlayerInputNext = () => {
    if (parsedPlayers.length < 2) {
      showToast('최소 2명의 참가자가 필요합니다.', 'error');
      return;
    }
    if (!matchTitle.trim()) {
      showToast('경기 제목을 입력해주세요.', 'error');
      return;
    }
    setCurrentStep('settings');
  };

  const handleTeamAssignment = async () => {
    await assignPlayersToTeams(parsedPlayers);
    setCurrentStep('result');
    showToast('팀 배정이 완료되었습니다!', 'success');
  };

  const handleShuffle = async () => {
    await assignPlayersToTeams(parsedPlayers);
    showToast('팀을 다시 배정했습니다!', 'success');
  };

  // 결과 복사 핸들러
  const handleCopyResult = () => {
    if (!result) return;
    let text = `📊 ${matchTitle}\n\n`;
    result.teams.forEach((team, index) => {
      text += `🏆 팀 ${index + 1} (총점: ${team.totalScore}, 평균: ${team.averageScore.toFixed(1)})\n`;
      team.players.forEach(player => {
        text += `  • ${player.name} (${player.score})\n`;
      });
      text += '\n';
    });
    text += `⚖️ 밸런스 점수: ${result.balanceScore.toFixed(1)}%`;
    navigator.clipboard.writeText(text);
    showToast('결과를 클립보드에 복사했습니다!', 'success');
  };

  // 공유 링크 생성 함수
  const handleShareResult = async () => {
    if (!result || !('share' in navigator)) {
      showToast('공유 기능을 사용할 수 없습니다.', 'error');
      return;
    }

    try {
      await navigator.share({
        title: `팀 배정 결과 - ${matchTitle}`,
        text: `${matchTitle}의 팀 배정이 완료되었습니다. 밸런스 점수: ${result.balanceScore.toFixed(1)}%`,
        url: window.location.href
      });
    } catch {
      showToast('공유 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-2 md:px-8 py-4">
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8">
        {/* 헤더 */}
        <AppHeader />
        {/* 단계별 섹션 */}
        <div className="mt-4 md:mt-8">
          {currentStep === 'input' && (
            <PlayerInputSection
              matchTitle={matchTitle}
              setMatchTitle={setMatchTitle}
              onNext={handlePlayerInputNext}
              onOpenHistory={() => setIsHistoryOpen(true)}
            />
          )}
          {currentStep === 'settings' && (
            <TeamSettingsSection
              teamCount={teamCount}
              setTeamCount={setTeamCount}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              onAssign={handleTeamAssignment}
              isLoading={isLoading}
            />
          )}
          {currentStep === 'result' && result && (
            <TeamDisplaySection
              result={result}
              onShuffle={handleShuffle}
              onShowCharts={() => setIsChartsOpen(true)}
              onCopy={handleCopyResult}
              onShare={handleShareResult}
            />
          )}
        </div>
        {/* 푸터 */}
        <AppFooter />
      </div>
      {/* 토스트/스피너/모달 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      {isLoading && <SpinnerOverlay message="팀 배정 중..." />}
      <AnimatePresence>
        {isHistoryOpen && (
          <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        )}
        {isChartsOpen && result && (
          <ChartsModal isOpen={isChartsOpen} onClose={() => setIsChartsOpen(false)} result={result} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamBalancer;
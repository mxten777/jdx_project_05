import React, { useState } from 'react';

// Components
import PlayerInputSection from './PlayerInputSection';
import TeamSettingsSection from './TeamSettingsSection';
import TeamResultSection from './TeamResultSection';
import LoadingOverlay from './LoadingOverlay';
import Toast from './Toast';

// Types
import type { AlgorithmType, Player, TeamAssignmentResult } from '../types';

// Utils
import { parsePlayersFromText, assignTeams } from '../utils/algorithms';

const TeamBalancer: React.FC = () => {
  // State
  const [currentStep, setCurrentStep] = useState<'input' | 'settings' | 'result'>('input');
  const [matchTitle, setMatchTitle] = useState('');
  const [playerInput, setPlayerInput] = useState('');
  const [parsedPlayers, setParsedPlayers] = useState<Player[]>([]);
  const [teamCount, setTeamCount] = useState(2);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('greedy');
  const [result, setResult] = useState<TeamAssignmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Parse players whenever input changes
  React.useEffect(() => {
    const players = parsePlayersFromText(playerInput);
    setParsedPlayers(players);
  }, [playerInput]);

  // Handlers
  const handlePlayerInputNext = () => {
    console.log('handlePlayerInputNext called');
    console.log('parsedPlayers:', parsedPlayers);
    console.log('parsedPlayers.length:', parsedPlayers.length);
    if (parsedPlayers.length < 2) {
      console.log('참가자 수 부족:', parsedPlayers.length);
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
    setIsLoading(true);
    try {
      const assignmentResult = assignTeams(parsedPlayers, teamCount, algorithm);
      setResult(assignmentResult);
      setCurrentStep('result');
      showToast('팀 배정이 완료되었습니다!', 'success');
    } catch {
      showToast('팀 배정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShuffle = async () => {
    setIsLoading(true);
    try {
      const assignmentResult = assignTeams(parsedPlayers, teamCount, algorithm);
      setResult(assignmentResult);
      showToast('팀을 다시 배정했습니다!', 'success');
    } catch {
      showToast('팀 배정 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⚖️ 팀 밸런서
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            공정하고 균형잡힌 팀 배정을 위한 도구
          </p>
        </div>

        {/* 단계별 섹션 */}
        <div className="mt-4 md:mt-8">
          {currentStep === 'input' && (
            <PlayerInputSection
              matchTitle={matchTitle}
              setMatchTitle={setMatchTitle}
              playerInput={playerInput}
              setPlayerInput={setPlayerInput}
              parsedPlayers={parsedPlayers}
              onNext={handlePlayerInputNext}
            />
          )}

          {currentStep === 'settings' && (
            <TeamSettingsSection
              teamCount={teamCount}
              setTeamCount={setTeamCount}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              onPrevious={() => setCurrentStep('input')}
              onAssign={handleTeamAssignment}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'result' && result && (
            <TeamResultSection
              matchTitle={matchTitle}
              result={result}
              isLoading={isLoading}
              onShuffle={handleShuffle}
              onCopy={handleCopyResult}
              onShare={handleShareResult}
              onNewGame={() => {
                setCurrentStep('input');
                setResult(null);
                setPlayerInput('');
                setMatchTitle('');
              }}
            />
          )}
        </div>

        {/* 푸터 */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Made with ❤️ for fair team balancing
          </p>
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* 로딩 오버레이 */}
      {isLoading && <LoadingOverlay message="팀 배정 중..." />}
    </div>
  );
};

export default TeamBalancer;
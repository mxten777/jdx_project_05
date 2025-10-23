import React, { useState, useMemo, useEffect } from 'react';
import Spinner from './Spinner';
import Toast from './Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shuffle, Trophy, Copy, Share2, Settings, ArrowRight, BarChart3, Target, Zap, History
} from 'lucide-react';

import type { Player, AlgorithmType, TeamAssignmentResult, AppState, Match } from '../types';
import { 
  parsePlayersFromText, 
  assignTeams
} from '../utils/algorithms';
import { 
  saveMatchToLocal,
  getLocalSettings
} from '../lib/localStorage';
import HistoryModal from './HistoryModal';
import ChartsModal from './ChartsModal';

// 타입 정의 분리
interface PlayerInputProps {
  playerText: string;
  setPlayerText: (text: string) => void;
  matchTitle: string;
  setMatchTitle: (title: string) => void;
  onNext: () => void;
  onOpenHistory: () => void;
}

// 함수형 컴포넌트 선언
const PlayerInput: React.FC<PlayerInputProps> = ({ playerText, setPlayerText, matchTitle, setMatchTitle, onNext, onOpenHistory }) => {
  // 최근 입력된 이름 자동완성 추천
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [minScore, setMinScore] = useState<number | ''>('');
  const [maxScore, setMaxScore] = useState<number | ''>('');

  useEffect(() => {
    // 최근 경기/플레이어 기록에서 이름 추출 (localStorage 활용)
    const matchesRaw = localStorage.getItem('matches');
    const names: string[] = [];
    if (matchesRaw) {
      try {
        const matches = JSON.parse(matchesRaw);
        matches.forEach((match: Match) => {
          match.players.forEach((p: Player) => {
            if (!names.includes(p.name)) names.push(p.name);
          });
        });
      } catch {
        // ignore
      }
    }
    setSuggestions(names.slice(0, 10));
  }, []);

  // 입력창에서 이름 부분만 추출
  const handleSuggestionClick = (name: string) => {
    const lines = playerText.split('\n');
    const cursorPos = document.activeElement instanceof HTMLTextAreaElement ? document.activeElement.selectionStart : 0;
    let lineIdx = 0, charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1;
      if (charCount > cursorPos) {
        lineIdx = i;
        break;
      }
    }
    lines[lineIdx] = name + ' ';
    setPlayerText(lines.join('\n'));
    setShowSuggestions(false);
  };

  // 점수 범위 필터링된 참가자
  const parsedPlayers = useMemo(() => {
    const allPlayers = parsePlayersFromText(playerText);
    return allPlayers.filter(p => {
      if (minScore !== '' && p.score < minScore) return false;
      if (maxScore !== '' && p.score > maxScore) return false;
      return true;
    });
  }, [playerText, minScore, maxScore]);
  
  // sampleText 제거 (미사용)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <p className="text-gray-600">참가자와 점수를 입력하여 균형잡힌 팀을 만들어보세요</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            경기 제목
          </label>
          <input
            type="text"
            value={matchTitle}
            onChange={(e) => setMatchTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="경기 제목을 입력하세요"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            참가자 입력
          </label>
          <textarea
            value={playerText}
            onChange={(e) => setPlayerText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={6}
            placeholder="참가자 이름과 점수를 입력하세요 (예: 김철수 85)"
          />
        </div>
        
        {/* 자동완성 제안 목록 */}
        {showSuggestions && (
          <div className="mt-2 bg-white rounded-lg shadow-md max-h-60 overflow-auto">
            {suggestions.map((name) => (
              <button
                key={name}
                onClick={() => handleSuggestionClick(name)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-primary-100"
              >
                {name}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">최소 점수</label>
            <input
              type="number"
              value={minScore}
              onChange={e => setMinScore(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">최대 점수</label>
            <input
              type="number"
              value={maxScore}
              onChange={e => setMaxScore(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded-lg text-sm"
              min={0}
            />
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {parsedPlayers.map((player) => (
            <span
              key={player.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {player.name} ({player.score}점)
            </span>
          ))}
        </div>
        
        {parsedPlayers.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ {parsedPlayers.length}명의 참가자가 인식되었습니다.
            </p>
          </div>
        )}
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <History className="w-4 h-4" />
            기록 보기
          </button>
          <button
            onClick={onNext}
            disabled={parsedPlayers.length < 2}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            다음 단계
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TeamConfiguration: React.FC<{
  players: Player[];
  teamCount: number;
  setTeamCount: (count: number) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  onAssign: () => void;
  onBack: () => void;
}> = ({ players, teamCount, setTeamCount, algorithm, setAlgorithm, onAssign, onBack }) => {
  const maxTeams = Math.min(players.length, 6);
  const [teamColors, setTeamColors] = useState<string[]>(Array(teamCount).fill('#6366f1'));

  useEffect(() => {
    setTeamColors((prev) => {
      if (teamCount > prev.length) {
        return [...prev, ...Array(teamCount - prev.length).fill('#6366f1')];
      } else if (teamCount < prev.length) {
        return prev.slice(0, teamCount);
      }
      return prev;
    });
  }, [teamCount]);

  const algorithmOptions = [
    { value: 'greedy' as AlgorithmType, label: '그리디 (균형 우선)', icon: Target, description: '가장 공정한 배정' },
    { value: 'snake' as AlgorithmType, label: '스네이크', icon: Zap, description: '번갈아 가며 배정' },
    { value: 'random' as AlgorithmType, label: '랜덤', icon: Shuffle, description: '완전 무작위' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">팀 설정</h2>
        <p className="text-gray-600">{players.length}명의 참가자를 몇 개 팀으로 나눌까요?</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* 팀 수 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Settings className="inline w-4 h-4 mr-1" />
            팀 개수
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: maxTeams - 1 }, (_, i) => i + 2).map((count) => (
              <button
                key={count}
                onClick={() => setTeamCount(count)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  teamCount === count
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {count}팀
              </button>
            ))}
          </div>
        </div>
        
        {/* 알고리즘 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <BarChart3 className="inline w-4 h-4 mr-1" />
            배정 방식
          </label>
          <div className="space-y-2">
            {algorithmOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setAlgorithm(option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    algorithm === option.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${
                      algorithm === option.value ? 'text-primary-600' : 'text-gray-500'
                    }`} />
                    <div>
                      <div className={`font-medium ${
                        algorithm === option.value ? 'text-primary-900' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </div>
                      <div className={`text-sm ${
                        algorithm === option.value ? 'text-primary-700' : 'text-gray-500'
                      }`}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 팀 색상 설정 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {/* <ColorPalette className="inline w-4 h-4 mr-1" /> */}
            팀 색상
          </label>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {Array.from({ length: teamCount }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm font-medium">팀 {idx + 1} 색상</span>
                <input
                  type="color"
                  value={teamColors[idx]}
                  onChange={e => {
                    const newColors = [...teamColors];
                    newColors[idx] = e.target.value;
                    setTeamColors(newColors);
                  }}
                  className="w-8 h-8 p-0 border-none rounded-full cursor-pointer"
                />
                <span className="w-4 h-4 rounded-full border" style={{ background: teamColors[idx] }} />
              </div>
            ))}
          </div>
        </div>
        
        {/* 버튼 그룹 */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            이전
          </button>
          <button
            onClick={onAssign}
            className="flex-2 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            팀 배정하기
          </button>
        </div>
      </div>
    </motion.div>
  );
};

interface TeamResultProps {
  result: TeamAssignmentResult;
  onReset: () => void;
  onShuffle: () => void;
}

const TeamResult: React.FC<TeamResultProps> = ({ result, onReset, onShuffle }) => {
  const [isChartsOpen, setIsChartsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [matchNote, setMatchNote] = useState('');

  const generateShareUrl = () => {
    const params = new URLSearchParams();
    result.teams.forEach((team, idx) => {
      params.append(`team${idx + 1}`, `${team.name}:${team.players.map(p => p.name).join(',')}`);
    });
    params.append('balance', result.balanceScore.toFixed(1));
    params.append('std', result.standardDeviation.toFixed(1));
    params.append('gap', result.scoreGap.toString());
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  // setShareUrl 제거 (존재하지 않음)
    navigator.clipboard.writeText(url)
      .then(() => setToast({ message: '공유 링크가 복사되었습니다!', type: 'success' }))
      .catch(() => setToast({ message: '링크 복사에 실패했습니다.', type: 'error' }));
  };
  
  const copyToClipboard = () => {
    const text = result.teams.map(team => 
      `${team.name} (${team.totalScore}점)\n${team.players.map(p => `- ${p.name} (${p.score}점)`).join('\n')}`
    ).join('\n\n');
    navigator.clipboard.writeText(text)
      .then(() => setToast({ message: '클립보드에 복사되었습니다!', type: 'success' }))
      .catch(() => setToast({ message: '복사에 실패했습니다.', type: 'error' }));
  };

  const shareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: '팀 배정 결과',
        text: '공정한 팀 배정 결과입니다!',
        url: window.location.href,
      })
        .then(() => setToast({ message: '공유 링크를 전송했습니다!', type: 'success' }))
        .catch(() => setToast({ message: '공유에 실패했습니다.', type: 'error' }));
    } else {
      setToast({ message: '이 브라우저는 공유 기능을 지원하지 않습니다.', type: 'info' });
    }
  };

  const getBalanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };


  // 인쇄(프린트) 기능
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 relative"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 팀 배정 완료!</h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getBalanceColor(result.balanceScore)}`}>
          밸런스 점수: {result.balanceScore.toFixed(1)}점
        </div>
      </div>
      
      {/* 통계 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-primary-600">{result.balanceScore.toFixed(1)}</div>
          <div className="text-xs text-gray-600">밸런스</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{result.standardDeviation.toFixed(1)}</div>
          <div className="text-xs text-gray-600">표준편차</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{result.scoreGap}</div>
          <div className="text-xs text-gray-600">점수차</div>
        </div>
      </div>
      
      {/* 팀 카드들 */}
      <div className="grid gap-4">
        {result.teams.map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                <div className="text-sm text-gray-600">
                  총 {team.totalScore}점 • 평균 {team.averageScore.toFixed(1)}점
                </div>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                #{idx + 1}
              </div>
            </div>
            <div className="grid gap-2">
              {team.players.map((player) => (
                <div
                  key={player.id}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{player.name}</span>
                  <span className="text-sm font-medium text-gray-600">{player.score}점</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 경기 제목 및 메모 입력 */}
      {/* 경기 제목은 result에 없음. 필요시 matchTitle 사용 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">경기 메모</label>
        <textarea value={matchNote} onChange={e => setMatchNote(e.target.value)} className="w-full p-2 border rounded-lg" rows={2} />
      </div>
      
      {/* 결과 인쇄 버튼 */}
      <button onClick={handlePrint} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium mt-2">
        결과 인쇄
      </button>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onReset}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          처음부터
        </button>
        <button
          onClick={onShuffle}
          className="flex-1 bg-primary-100 text-primary-700 py-3 px-4 rounded-lg font-medium hover:bg-primary-200 transition-colors flex items-center justify-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          다시 섞기
        </button>
        <button
          onClick={() => setIsChartsOpen(true)}
          className="bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        <button
          onClick={copyToClipboard}
          className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={generateShareUrl}
          className="bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
        >
          링크 생성 및 복사
        </button>
        {'share' in navigator && (
          <button
            onClick={shareResult}
            className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 차트 모달 */}
      <ChartsModal
        isOpen={isChartsOpen}
        onClose={() => setIsChartsOpen(false)}
        result={result}
      />

      {/* 토스트 알림 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

const AppHeader: React.FC = () => (
  <header className="w-full py-6 flex flex-col items-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 mb-6 rounded-b-2xl shadow">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-3xl">🏆</span>
      <span className="text-2xl font-bold text-gray-900">공정한 팀 배정기</span>
    </div>
    <p className="text-gray-600 text-sm">팀 배정, 기록 관리, 시각화까지 한 번에!</p>
  </header>
);

const AppFooter: React.FC = () => (
  <footer className="w-full py-6 mt-10 flex flex-col items-center text-xs text-gray-500 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-2xl shadow">
    <div>© 2025 JDX Team Balancer. All rights reserved.</div>
    <div className="mt-2 flex gap-4">
      <a href="https://github.com/jdx-team" target="_blank" rel="noopener" className="hover:underline">GitHub</a>
      <a href="https://notion.so/jdx-team" target="_blank" rel="noopener" className="hover:underline">Notion</a>
    </div>
  </footer>
);

// 메인 컴포넌트
function TeamBalancer() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 'input',
    players: [],
    teamCount: 2,
    algorithm: 'greedy',
    result: null,
    isLoading: false,
  });
  
  const [playerText, setPlayerText] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [matchTitle, setMatchTitle] = useState('');

  // useEffect 제거 (불필요한 사이드 이펙트 및 JSX 반환 오류)

// ...existing code...

  const handleAssignTeams = () => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    
    // 의도적인 딜레이로 로딩 효과
    setTimeout(() => {
      const result = assignTeams(appState.players, appState.teamCount, appState.algorithm);
      setAppState(prev => ({
        ...prev,
        currentStep: 'result',
        result,
        isLoading: false,
      }));
      
      // 자동 저장
      const settings = getLocalSettings();
      if (settings.autoSave && result) {
        const match: Match = {
          id: `match-${Date.now()}`,
          title: matchTitle || `${new Date().toLocaleDateString()} 경기`,
          date: new Date().toISOString().split('T')[0],
          players: appState.players,
          teams: result.teams,
          algorithm: appState.algorithm,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          settings: {
            teamCount: appState.teamCount,
            algorithm: appState.algorithm,
            balanceScore: result.balanceScore,
          },
        };
        saveMatchToLocal(match);
      }
    }, 500);
  };

// ...existing code...

  const handleShuffle = () => {
    if (appState.result) {
      const newResult = assignTeams(appState.players, appState.teamCount, appState.algorithm);
      setAppState(prev => ({
        ...prev,
        result: newResult,
      }));
    }
  };

  const handleLoadMatch = (match: Match) => {
    setPlayerText(match.players.map(p => `${p.name} ${p.score}`).join('\n'));
    setMatchTitle(match.title);
    setAppState({
      currentStep: 'result',
      players: match.players,
      teamCount: match.teams.length,
      algorithm: match.algorithm,
      result: {
        teams: match.teams,
        balanceScore: 0, // 재계산 필요시
        standardDeviation: 0, // 재계산 필요시
        scoreGap: 0, // 재계산 필요시
      },
      isLoading: false,
    });
    setIsHistoryOpen(false);
  };

  return (
  <div className={`min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4`}>
      <AppHeader />
      <div className="flex-1 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {appState.isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <Spinner size={48} color="#6366f1" />
                <p className="text-gray-600">공정한 팀을 구성하고 있습니다...</p>
              </div>
            </motion.div>
          ) : appState.currentStep === 'input' ? (
            <PlayerInput
              key="input"
              playerText={playerText}
              setPlayerText={setPlayerText}
              matchTitle={matchTitle}
              setMatchTitle={setMatchTitle}
              onNext={() => { /* TODO: implement next step handler */ }}
              onOpenHistory={() => setIsHistoryOpen(true)}
            />
          ) : appState.currentStep === 'configure' ? (
            <TeamConfiguration
              key="configure"
              players={appState.players}
              teamCount={appState.teamCount}
              setTeamCount={(count) => setAppState(prev => ({ ...prev, teamCount: count }))}
              algorithm={appState.algorithm}
              setAlgorithm={(algorithm) => setAppState(prev => ({ ...prev, algorithm }))}
              onAssign={handleAssignTeams}
              onBack={() => setAppState(prev => ({ ...prev, currentStep: 'input' }))}
            />
          ) : appState.result ? (
            <TeamResult
              key="result"
              result={appState.result}
              onReset={() => setAppState(prev => ({ ...prev, currentStep: 'input', result: null }))}
              onShuffle={handleShuffle}
            />
          ) : null}
        </AnimatePresence>
      </div>
      <AppFooter />
      
      {/* 기록 모달 */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoadMatch={handleLoadMatch}
      />
    </div>
  );
}

export default TeamBalancer;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, Eye, Trash2, Download, Upload, X } from 'lucide-react';

import type { Match, PlayerRecord } from '../types';
import { 
  getLocalMatches, 
  getLocalPlayerRecords, 
  deleteLocalMatch,
  exportData,
  importData
} from '../lib/localStorage';
import { useToast } from '../hooks/useToast';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadMatch?: (match: Match) => void;
}

function HistoryModal({ isOpen, onClose, onLoadMatch }: HistoryModalProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerRecords, setPlayerRecords] = useState<PlayerRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'matches' | 'players'>('matches');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setMatches(getLocalMatches());
      setPlayerRecords(getLocalPlayerRecords());
    }
  }, [isOpen]);

  const handleDeleteMatch = (matchId: string) => {
    deleteLocalMatch(matchId);
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  const handleExportData = () => {
    try {
      exportData();
      showToast('기록이 JSON 파일로 내보내졌습니다!', 'info');
    } catch {
      showToast('내보내기에 실패했습니다.', 'warning');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file).then((success) => {
        if (success) {
          setMatches(getLocalMatches());
          setPlayerRecords(getLocalPlayerRecords());
          showToast('데이터를 성공적으로 가져왔습니다!', 'info');
        } else {
          showToast('데이터 가져오기에 실패했습니다.', 'warning');
        }
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold"
          aria-label="닫기"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">경기 기록 관리</h2>
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="기록 내보내기"
          >
            <Download className="w-5 h-5" /> 내보내기
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors shadow cursor-pointer focus-within:ring-2 focus-within:ring-green-400">
            <Upload className="w-5 h-5" /> 가져오기
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" aria-label="기록 가져오기" />
          </label>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center">
          내보내기는 <span className="font-semibold">JSON 파일</span>로 저장됩니다. 가져오기는 <span className="font-semibold">기존 기록을 덮어씁니다</span>.<br />
          <span className="text-blue-600 dark:text-blue-400">내보내기 후 파일을 안전하게 보관하세요.</span>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${
              activeTab === 'matches'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            경기 기록 ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('players')}
            className={`flex-1 py-3 px-6 text-sm font-medium transition-colors ${
              activeTab === 'players'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            플레이어 기록 ({playerRecords.length})
          </button>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              내보내기
            </button>
            <label className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
          <span className="text-sm text-gray-500">
            총 {activeTab === 'matches' ? matches.length : playerRecords.length}개 기록
          </span>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'matches' ? (
            <div className="h-full overflow-y-auto p-4">
              {matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Trophy className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">저장된 경기가 없습니다</p>
                  <p className="text-sm">팀 배정을 완료하면 자동으로 기록이 저장됩니다.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {matches.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">{match.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(match.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {match.players.length}명
                            </span>
                            <span className="capitalize bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-xs">
                              {match.algorithm}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedMatch(match)}
                            className="p-2 hover:bg-white rounded transition-colors"
                            title="상세 보기"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {onLoadMatch && (
                            <button
                              onClick={() => onLoadMatch(match)}
                              className="p-2 hover:bg-white rounded transition-colors text-primary-600"
                              title="불러오기"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMatch(match.id)}
                            className="p-2 hover:bg-white rounded transition-colors text-red-600"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {match.teams.map((team) => (
                          <div key={team.id} className="bg-white rounded p-2 text-xs">
                            <div className="font-medium text-gray-900 truncate">{team.name}</div>
                            <div className="text-gray-500">{team.totalScore}점 ({team.players.length}명)</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-4">
              {playerRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Users className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">플레이어 기록이 없습니다</p>
                  <p className="text-sm">경기를 진행하면 플레이어별 통계가 누적됩니다.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {playerRecords.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                            <span className="font-medium text-gray-900">{player.name}</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                            <div>
                              <span className="text-gray-500">경기 수</span>
                              <div className="font-medium">{player.totalMatches}회</div>
                            </div>
                            <div>
                              <span className="text-gray-500">승률</span>
                              <div className="font-medium">{(player.winRate * 100).toFixed(1)}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">평균 점수</span>
                              <div className="font-medium">{player.averageScore.toFixed(1)}점</div>
                            </div>
                            <div>
                              <span className="text-gray-500">최근 점수</span>
                              <div className="font-medium">{player.lastScore}점</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            player.winRate >= 0.7 ? 'bg-green-100 text-green-800' :
                            player.winRate >= 0.5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {player.winRate >= 0.7 ? '🏆 강자' :
                             player.winRate >= 0.5 ? '⚖️ 균형' : '📈 성장형'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 매치 상세 모달 */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMatch.title}</h3>
                    <p className="text-gray-500">{formatDate(selectedMatch.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedMatch.teams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900">{team.name}</h4>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">{team.totalScore}점</div>
                          <div className="text-sm text-gray-500">평균 {team.averageScore.toFixed(1)}점</div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {team.players.map((player) => (
                          <div key={player.id} className="flex justify-between py-1">
                            <span className="text-gray-700">{player.name}</span>
                            <span className="font-medium">{player.score}점</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HistoryModal;
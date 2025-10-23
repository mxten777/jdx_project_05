import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from './ui';
import { Shuffle, BarChart3, Copy, Share2, Trophy } from 'lucide-react';
import type { TeamAssignmentResult } from '../types';

interface TeamDisplaySectionProps {
  result: TeamAssignmentResult;
  onShuffle: () => void;
  onShowCharts: () => void;
  onCopy: () => void;
  onShare: () => void;
}

function TeamDisplaySection({ result, onShuffle, onShowCharts, onCopy, onShare }: TeamDisplaySectionProps) {
  const teamColors = React.useMemo(() => ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'], []);
  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <Card>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">팀 배정 결과</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{result.teams.length}</div>
              <div className="text-sm text-blue-800">팀 수</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {result.teams.reduce((sum, team) => sum + team.players.length, 0)}
              </div>
              <div className="text-sm text-green-800">총 참가자</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {result.balanceScore.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-800">밸런스 점수</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Teams Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.teams.map((team, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`border-l-4 ${teamColors[index % teamColors.length].replace('bg-', 'border-l-')}`}>
              <div className="text-center mb-4">
                <h3 className={`text-xl font-bold ${teamColors[index % teamColors.length].replace('bg-', 'text-')}`}>
                  팀 {index + 1}
                </h3>
                <div className="text-sm text-gray-600">
                  총점: {team.totalScore} | 평균: {team.averageScore.toFixed(1)}
                </div>
              </div>
              
              <div className="space-y-2">
                {team.players.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{player.name}</span>
                    <span className="text-gray-600">{player.score}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="primary"
            icon={Shuffle}
            onClick={onShuffle}
          >
            다시 배정
          </Button>
          
          <Button
            variant="secondary"
            icon={BarChart3}
            onClick={onShowCharts}
          >
            통계 보기
          </Button>
          
          <Button
            variant="success"
            icon={Copy}
            onClick={onCopy}
          >
            복사하기
          </Button>
          
          <Button
            variant="ghost"
            icon={Share2}
            onClick={onShare}
          >
            공유하기
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default TeamDisplaySection;
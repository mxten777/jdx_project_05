import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { TeamAssignmentResult } from '../types';
import { getLocalPlayerRecords } from '../lib/localStorage';

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: TeamAssignmentResult;
}

// 툴팁 타입 정의
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
}

function ChartsModal({ isOpen, onClose, result }: ChartsModalProps) {
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  const playerRecords = getLocalPlayerRecords();
  const barChartData = React.useMemo(() => result.teams.map((team, index) => ({
    name: team.name,
    totalScore: team.totalScore,
    averageScore: parseFloat(team.averageScore.toFixed(1)),
    playerCount: team.players.length,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6],
  })), [result.teams]);
  const radarData = React.useMemo(() => result.teams.map(team => {
    const maxScore = Math.max(...team.players.map(p => p.score));
    const minScore = Math.min(...team.players.map(p => p.score));
    const scoreRange = maxScore - minScore;
    return {
      team: team.name,
      총점: team.totalScore,
      평균: team.averageScore,
      최고점: maxScore,
      최저점: minScore,
      밸런스: scoreRange === 0 ? 100 : Math.max(0, 100 - (scoreRange / team.averageScore * 100)),
      인원수: team.players.length * 10,
    };
  }), [result.teams]);
  const pieData = React.useMemo(() => result.teams.map((team, index) => ({
    name: team.name,
    value: team.totalScore,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6],
  })), [result.teams]);
  const bins = React.useMemo(() => {
    const allScores = result.teams.flatMap(team => team.players.map(p => p.score));
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);
    const binSize = Math.max(1, Math.floor((maxScore - minScore) / 8));
    const bins: { range: string; count: number }[] = [];
    for (let i = minScore; i <= maxScore; i += binSize) {
      const rangeLabel = `${i}~${i + binSize - 1}`;
      const count = allScores.filter(score => score >= i && score < i + binSize).length;
      bins.push({ range: rangeLabel, count });
    }
    return bins;
  }, [result.teams]);
  if (!isOpen) return null;
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'totalScore' ? '총점' : 
               entry.dataKey === 'averageScore' ? '평균점' : entry.dataKey}: {entry.value}
              {entry.dataKey.includes('Score') ? '점' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  const CustomPieTooltip = ({ active, payload }: PieTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / result.teams.reduce((sum, team) => sum + team.totalScore, 0)) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">총점: {data.value}점</p>
          <p className="text-sm text-gray-600">비율: {percentage}%</p>
        </div>
      );
    }
    return null;
  };
  const playerChartData = playerRecords.map((player, idx) => ({
    name: player.name,
    평균점수: player.averageScore,
    승률: parseFloat((player.winRate * 100).toFixed(1)),
    최근점수: player.lastScore,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][idx % 6],
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-lg">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-4xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl font-bold"
          aria-label="닫기"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">팀 배정 통계 시각화</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 팀별 총점/평균 바 차트 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">팀별 총점/평균</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="totalScore" fill="#3B82F6" />
                <Bar dataKey="averageScore" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* 전체 점수 분포 히스토그램 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">전체 점수 분포</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" stroke="#888" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* 팀별 레이더 차트 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">팀별 능력치 레이더</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="team" />
                <PolarRadiusAxis />
                <Radar name="총점" dataKey="총점" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="평균" dataKey="평균" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Radar name="밸런스" dataKey="밸런스" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* 팀별 점수 파이 차트 */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">팀별 점수 비율</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* 플레이어별 상세 분석 버튼 및 차트 */}
        <div className="mt-6 text-center">
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => setShowPlayerStats(v => !v)}
          >
            {showPlayerStats ? '팀 통계로 돌아가기' : '플레이어별 상세 분석 보기'}
          </button>
        </div>
        {showPlayerStats && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">플레이어별 평균/승률/최근 점수</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={playerChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="평균점수" fill="#3B82F6" />
                <Bar dataKey="승률" fill="#10B981" />
                <Bar dataKey="최근점수" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {/* 밸런스 점수, 표준편차, 점수 격차 요약 */}
        <div className="mt-8 flex flex-wrap gap-6 justify-center text-center">
          <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{result.balanceScore.toFixed(1)}%</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">밸런스 점수</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/40 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">{result.standardDeviation.toFixed(2)}</div>
            <div className="text-sm text-purple-800 dark:text-purple-200">표준편차</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/40 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{result.scoreGap}</div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">점수 격차</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsModal;
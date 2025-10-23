import React from 'react';
import { Card, Button, Input } from './ui';
import { Settings, Target, Zap } from 'lucide-react';
import type { AlgorithmType } from '../types';

interface TeamSettingsSectionProps {
  teamCount: number;
  setTeamCount: (count: number) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  onAssign: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

function TeamSettingsSection({ teamCount, setTeamCount, algorithm, setAlgorithm, onAssign, isLoading, disabled = false }: TeamSettingsSectionProps) {
  const algorithms = [
    { value: 'greedy' as AlgorithmType, label: '그리디 알고리즘', icon: Zap, description: '빠르고 효율적인 배정' },
    { value: 'optimal' as AlgorithmType, label: '최적화 알고리즘', icon: Target, description: '가장 균형잡힌 배정' },
    { value: 'random' as AlgorithmType, label: '랜덤 배정', icon: Settings, description: '완전 무작위 배정' }
  ];
  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">팀 배정 설정</h2>
          <p className="text-gray-600">팀 수와 알고리즘을 선택하세요</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팀 개수
            </label>
            <Input
              type="number"
              value={teamCount.toString()}
              onChange={(value) => setTeamCount(Math.max(2, Math.min(10, parseInt(value) || 2)))}
              disabled={disabled}
            />
            <p className="text-xs text-gray-500 mt-1">2-10팀까지 설정 가능</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              배정 알고리즘
            </label>
            <div className="space-y-2">
              {algorithms.map((algo) => {
                const Icon = algo.icon;
                return (
                  <div
                    key={algo.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      algorithm === algo.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !disabled && setAlgorithm(algo.value)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${algorithm === algo.value ? 'text-blue-600' : 'text-gray-500'}`} />
                      <div className="flex-1">
                        <div className={`font-medium ${algorithm === algo.value ? 'text-blue-900' : 'text-gray-900'}`}>
                          {algo.label}
                        </div>
                        <div className={`text-sm ${algorithm === algo.value ? 'text-blue-700' : 'text-gray-600'}`}>
                          {algo.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={onAssign}
            loading={isLoading}
            disabled={disabled}
            className="w-full"
          >
            {isLoading ? '배정 중...' : '팀 배정 시작'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default TeamSettingsSection;
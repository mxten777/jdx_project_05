import { Card, Input, Textarea, Button } from './ui';
import { Users, History } from 'lucide-react';
import { usePlayerInput } from '../hooks';
import type { Player } from '../types';

interface PlayerInputSectionProps {
  matchTitle: string;
  setMatchTitle: (title: string) => void;
  onNext: () => void;
  onOpenHistory: () => void;
}

function PlayerInputSection({ matchTitle, setMatchTitle, onNext, onOpenHistory }: PlayerInputSectionProps) {
  const { playerText, setPlayerText, parsedPlayers } = usePlayerInput();
  const sampleText = '김철수 85, 이영희 90, 박민수 75, 정수연 80, 강호동 70, 유재석 95';
  const isValid = parsedPlayers.length >= 2 && matchTitle.trim();

  return (
    <Card>
      <div className="text-center mb-6">
        <p className="text-gray-600">참가자와 점수를 입력하여 균형잡힌 팀을 만들어보세요</p>
      </div>
      <div className="space-y-4">
        <Input
          label="경기 제목"
          placeholder="경기 제목을 입력하세요"
          value={matchTitle}
          onChange={setMatchTitle}
          required
        />
        <Textarea
          label="참가자 입력"
          placeholder={'참가자 이름과 점수를 입력하세요 (예시): ' + sampleText}
          value={playerText}
          onChange={setPlayerText}
          rows={8}
          required
        />
        {parsedPlayers.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">인식된 참가자: {parsedPlayers.length}명</p>
            <div className="flex flex-wrap gap-2">
              {parsedPlayers.slice(0, 10).map((player: Player, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {player.name} ({player.score})
                </span>
              ))}
              {parsedPlayers.length > 10 && (
                <span className="text-blue-600 text-sm">+{parsedPlayers.length - 10}명 더</span>
              )}
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="primary"
            icon={Users}
            onClick={onNext}
            disabled={!isValid}
            className="flex-1"
          >
            팀 배정하기
          </Button>
          <Button
            variant="ghost"
            icon={History}
            onClick={onOpenHistory}
          >
            기록
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default PlayerInputSection;
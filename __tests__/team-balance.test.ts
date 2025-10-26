import { assignTeams } from '../src/utils/algorithms';
import type { Player } from '../src/types';

describe('팀 배정 알고리즘(bench 랜덤, 인원 균등, 점수 밸런스)', () => {
  function makePlayers(scores: number[]): Player[] {
    return scores.map((score, i) => ({ id: String(i), name: `P${i+1}`, score }));
  }

  test('bench 없이 12명 3팀 → 4,4,4', () => {
    const players = makePlayers([1,2,3,4,5,6,7,8,9,10,11,12]);
    const result = assignTeams(players, 3, 'greedy');
    const teamSizes = result.teams.filter(t => t.id !== 'bench').map(t => t.players.length);
    expect(teamSizes).toEqual([4,4,4]);
    expect(result.teams.filter(t => t.id === 'bench').length).toBe(0);
  });

  test('bench 1명(13명 3팀) → 4,4,4+bench', () => {
    const players = makePlayers([1,2,3,4,5,6,7,8,9,10,11,12,13]);
    const result = assignTeams(players, 3, 'greedy');
    const teamSizes = result.teams.filter(t => t.id !== 'bench').map(t => t.players.length);
    expect(teamSizes).toEqual([4,4,4]);
    expect(result.teams.find(t => t.id === 'bench')?.players.length).toBe(1);
  });

  test('bench 2명(14명 4팀) → 3,3,3,3+bench', () => {
    const players = makePlayers([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
    const result = assignTeams(players, 4, 'greedy');
    const teamSizes = result.teams.filter(t => t.id !== 'bench').map(t => t.players.length);
    expect(teamSizes).toEqual([3,3,3,3]);
    expect(result.teams.find(t => t.id === 'bench')?.players.length).toBe(2);
  });

  test('음수/0점/고득점 혼합, bench 1명', () => {
    const players = makePlayers([-2,-1,0,5,10,12,13,15,16,18,20,22,25]);
    const result = assignTeams(players, 3, 'greedy');
    const teamSizes = result.teams.filter(t => t.id !== 'bench').map(t => t.players.length);
    expect(teamSizes).toEqual([4,4,4]);
    expect(result.teams.find(t => t.id === 'bench')?.players.length).toBe(1);
    // 팀별 점수 차이가 30 이하(근사 밸런스)
    const scores = result.teams.filter(t => t.id !== 'bench').map(t => t.totalScore);
    expect(Math.max(...scores) - Math.min(...scores)).toBeLessThanOrEqual(30);
  });
});

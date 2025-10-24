import React, { useState } from 'react';

interface Team {
  id: string;
  name: string;
  members: string[];
}

const initialTeams: Team[] = [];

const TeamDashboard: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMembers, setNewMembers] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState('');

  // Add new team
  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    setTeams([
      ...teams,
      {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        members: newMembers.split(',').map(m => m.trim()).filter(Boolean),
      },
    ]);
    setNewTeamName('');
    setNewMembers('');
  };

  // Delete team
  const handleDeleteTeam = (id: string) => {
    setTeams(teams.filter(team => team.id !== id));
  };

  // Start editing
  const handleEditTeam = (team: Team) => {
    setEditId(team.id);
    setEditName(team.name);
    setEditMembers(team.members.join(', '));
  };

  // Save edit
  const handleSaveEdit = () => {
    setTeams(teams.map(team =>
      team.id === editId
        ? { ...team, name: editName.trim(), members: editMembers.split(',').map(m => m.trim()).filter(Boolean) }
        : team
    ));
    setEditId(null);
    setEditName('');
    setEditMembers('');
  };

  // Copy team info for TeamBalancer
  const handleCopyTeam = (team: Team) => {
    const text = `${team.name}: ${team.members.join(', ')}`;
    navigator.clipboard.writeText(text);
    alert('팀 정보가 복사되었습니다!');
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">팀정보관리 대시보드</h2>
      {/* Add Team - always at top */}
      <div className="mb-4 flex flex-col md:flex-row gap-2 md:gap-4 items-stretch">
        <input
          type="text"
          placeholder="팀명"
          value={newTeamName}
          onChange={e => setNewTeamName(e.target.value)}
          className="border rounded px-2 py-1 flex-1 min-w-0"
        />
        <input
          type="text"
          placeholder="구성원 (쉼표로 구분)"
          value={newMembers}
          onChange={e => setNewMembers(e.target.value)}
          className="border rounded px-2 py-1 flex-2 min-w-0"
        />
        <button onClick={handleAddTeam} className="bg-indigo-500 text-white px-3 py-1 rounded whitespace-nowrap">등록</button>
      </div>
      {/* Team List - grid, newest first */}
      <div className="grid grid-cols-1 gap-4">
        {[...teams].reverse().map(team => (
          <div key={team.id} className="border rounded p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
            {editId === team.id ? (
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 flex-1 min-w-0"
                />
                <input
                  type="text"
                  value={editMembers}
                  onChange={e => setEditMembers(e.target.value)}
                  className="border rounded px-2 py-1 flex-2 min-w-0"
                />
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-1 rounded">저장</button>
                  <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">취소</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-lg mr-2">{team.name}</span>
                  <span className="text-gray-600 dark:text-gray-300">{team.members.join(', ')}</span>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleEditTeam(team)} className="bg-yellow-400 text-white px-2 py-1 rounded">수정</button>
                  <button onClick={() => handleDeleteTeam(team.id)} className="bg-red-500 text-white px-2 py-1 rounded">삭제</button>
                  <button onClick={() => handleCopyTeam(team)} className="bg-blue-500 text-white px-2 py-1 rounded">복사</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDashboard;

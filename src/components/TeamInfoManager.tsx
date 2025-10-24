
import React, { useState, useEffect } from 'react';
import { addTeam, getTeams, updateTeam, deleteTeam } from '../lib/teamFirestore';
import type { TeamInfo } from '../lib/teamFirestore';

const TeamInfoManager: React.FC = () => {
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMembers, setNewMembers] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState('');
  const [loading, setLoading] = useState(false);

  // Load teams from Firestore on mount
  useEffect(() => {
    setLoading(true);
    getTeams().then(fetched => {
      setTeams(fetched);
      setLoading(false);
    });
  }, []);

  // Add new team
  const handleAddTeam = async () => {
    if (!newTeamName.trim()) return;
    setLoading(true);
    await addTeam({ name: newTeamName.trim(), members: newMembers.split(',').map(m => m.trim()).filter(Boolean) });
    const updated = await getTeams();
    setTeams(updated);
    setNewTeamName('');
    setNewMembers('');
    setLoading(false);
  };

  // Delete team
  const handleDeleteTeam = async (id: string) => {
    setLoading(true);
    await deleteTeam(id);
    const updated = await getTeams();
    setTeams(updated);
    setLoading(false);
  };

  // Start editing
  const handleEditTeam = (team: TeamInfo) => {
    setEditId(team.id);
    setEditName(team.name);
    setEditMembers(team.members.join(', '));
  };

  // Save edit
  const handleSaveEdit = async () => {
    if (!editId) return;
    setLoading(true);
    await updateTeam({ id: editId, name: editName.trim(), members: editMembers.split(',').map(m => m.trim()).filter(Boolean) });
    const updated = await getTeams();
    setTeams(updated);
    setEditId(null);
    setEditName('');
    setEditMembers('');
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">팀정보 관리</h2>
      {/* Add Team - always at top */}
      <div className="mb-4 flex flex-col gap-2 items-stretch">
        <input
          type="text"
          placeholder="팀명"
          value={newTeamName}
          onChange={e => setNewTeamName(e.target.value)}
          className="border rounded px-2 py-2 text-base md:text-lg w-full"
        />
        <textarea
          placeholder="구성원 (쉼표로 구분)"
          value={newMembers}
          onChange={e => setNewMembers(e.target.value)}
          className="border rounded px-3 py-4 text-base md:text-lg w-full mt-2 resize-vertical"
          style={{ minHeight: '120px' }}
        />
        <button onClick={handleAddTeam} className="bg-indigo-500 text-white px-3 py-2 rounded whitespace-nowrap mt-2 w-full md:w-auto text-base md:text-lg" disabled={loading}>등록</button>
      </div>
      {/* Team List - grid, newest first */}
      <div className="grid grid-cols-1 gap-4">
        {[...teams].reverse().map(team => (
          <div key={team.id} className="border rounded p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                {editId === team.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="border rounded px-2 py-2 text-base md:text-lg flex-1 min-w-0"
                    />
                    <textarea
                      placeholder="구성원 (쉼표로 구분)"
                      value={editMembers}
                      onChange={e => setEditMembers(e.target.value)}
                      className="border rounded px-3 py-4 text-base md:text-lg w-full mt-2 resize-vertical"
                      style={{ minHeight: '120px' }}
                    />
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-lg mr-2">{team.name}</span>
                    <span className="text-gray-600 dark:text-gray-300">{team.members.join(', ')}</span>
                  </>
                )}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                {editId === team.id ? (
                  <>
                    <button onClick={handleSaveEdit} className="bg-green-500 text-white px-3 py-2 rounded text-base md:text-lg" disabled={loading}>저장</button>
                    <button onClick={() => setEditId(null)} className="bg-gray-400 text-white px-3 py-2 rounded text-base md:text-lg" disabled={loading}>취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditTeam(team)} className="bg-yellow-400 text-white px-2 py-2 rounded text-base md:text-lg" disabled={loading}>수정</button>
                    <button onClick={() => handleDeleteTeam(team.id)} className="bg-red-500 text-white px-2 py-2 rounded text-base md:text-lg" disabled={loading}>삭제</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="mt-4 text-center text-indigo-600">처리 중...</div>}
    </div>
  );
};

export default TeamInfoManager;

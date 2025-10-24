import React from 'react';
import TeamDashboard from '../components/TeamDashboard';

const TeamDashboardPage: React.FC = () => (
	<>
		<div className="text-2xl font-bold text-purple-600 mb-4">이곳은 팀정보관리 대시보드 페이지입니다</div>
		<TeamDashboard />
	</>
);

export default TeamDashboardPage;

import React from 'react';

const AppFooter: React.FC = () => (
  <footer className="w-full py-6 mt-10 flex flex-col items-center text-xs text-gray-500 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-t-2xl shadow">
    <div>© 2025 JDX Team Balancer. All rights reserved.</div>
    <div className="mt-2 flex gap-4">
      <a href="https://github.com/jdx-team" target="_blank" rel="noopener" className="hover:underline">GitHub</a>
      <a href="https://notion.so/jdx-team" target="_blank" rel="noopener" className="hover:underline">Notion</a>
    </div>
  </footer>
);

export default AppFooter;
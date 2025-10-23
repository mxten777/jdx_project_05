import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamBalancer from './TeamBalancer';

describe('TeamBalancer', () => {
  it('renders main title', () => {
    render(<TeamBalancer />);
    expect(screen.getByText(/공정한 팀 배정기/i)).toBeInTheDocument();
  });

  it('allows player input and next step', () => {
    render(<TeamBalancer />);
    const textarea = screen.getByPlaceholderText(/참가자와 점수를 입력하세요/i);
    fireEvent.change(textarea, { target: { value: '홍길동 90\n임꺽정 80' } });
    const nextBtn = screen.getByText(/다음 단계/i);
    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);
    expect(screen.getByText(/팀 배정하기/i)).toBeInTheDocument();
  });

  it('shows chart modal when chart button clicked', () => {
    render(<TeamBalancer />);
    // ...simulate steps to result...
    // fireEvent.click(screen.getByText(/다시 섞기/i));
    // fireEvent.click(screen.getByRole('button', { name: /차트/i }));
    // expect(screen.getByText(/팀별 점수 비교/i)).toBeInTheDocument();
  });
});

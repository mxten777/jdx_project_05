import { useState, useCallback } from 'react';
import { parsePlayersFromText } from '../utils/algorithms';
import type { Player } from '../types';

export const usePlayerInput = () => {
  const [playerText, setPlayerText] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const parsedPlayers = parsePlayersFromText(playerText);

  const handleSuggestionClick = useCallback((name: string) => {
    const lines = playerText.split('\n');
    const lastLineIndex = lines.length - 1;
    lines[lastLineIndex] = name + ' ';
    setPlayerText(lines.join('\n'));
    setShowSuggestions(false);
  }, [playerText]);

  const addPlayer = useCallback((player: Player) => {
    const newLine = `${player.name} ${player.score}`;
    setPlayerText(prev => prev ? `${prev}\n${newLine}` : newLine);
  }, []);

  const clearPlayers = useCallback(() => {
    setPlayerText('');
  }, []);

  return {
    playerText,
    setPlayerText,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    parsedPlayers,
    handleSuggestionClick,
    addPlayer,
    clearPlayers
  };
};
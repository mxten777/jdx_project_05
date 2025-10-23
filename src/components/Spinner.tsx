import React from 'react';

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#6366f1' }) => (
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-spin"
    style={{ display: 'inline-block' }}
  >
    <circle
      cx={size / 2}
      cy={size / 2}
      r={size / 2 - 4}
      stroke="#e0e7ff"
      strokeWidth="4"
      fill="none"
    />
    <path
      d={`M${size / 2},${size / 2} m0,-${size / 2 - 4} a${size / 2 - 4},${size / 2 - 4} 0 1,1 0,${size - 8}`}
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const SpinnerOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
    <Spinner size={64} color="#6366f1" />
    {message && (
      <span className="mt-6 text-lg font-semibold text-white animate-pulse drop-shadow-lg">{message}</span>
    )}
  </div>
);

export { SpinnerOverlay };
export default Spinner;

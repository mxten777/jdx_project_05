import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

// ...existing code...

const iconMap = {
  success: <CheckCircle className="w-5 h-5 mr-2 text-green-300" aria-hidden="true" />,
  error: <XCircle className="w-5 h-5 mr-2 text-red-300" aria-hidden="true" />,
  info: <Info className="w-5 h-5 mr-2 text-blue-300" aria-hidden="true" />,
  warning: <Info className="w-5 h-5 mr-2 text-yellow-300" aria-hidden="true" />,
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 2000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 font-semibold text-base flex items-center gap-2 transition-all
          ${type === 'success' ? 'bg-green-700 text-white dark:bg-green-600' : ''}
          ${type === 'error' ? 'bg-red-700 text-white dark:bg-red-600' : ''}
          ${type === 'info' ? 'bg-blue-700 text-white dark:bg-blue-600' : ''}
          ${type === 'warning' ? 'bg-yellow-500 text-white dark:bg-yellow-600' : ''}
        `}
        role="alert"
        aria-live="assertive"
      >
        {iconMap[type]}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white/70 hover:text-white focus:outline-none"
          aria-label="닫기"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let _addToast = null;
export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error:   (msg) => _addToast?.({ msg, type: 'error' }),
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback(({ msg, type }) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  _addToast = add;

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? '✓' : '✕'} {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setState({ title: 'Are you sure?', confirmText: 'Delete', danger: true, ...(typeof opts === 'string' ? { message: opts } : opts) });
      }),
    []
  );

  const close = (result) => {
    resolver.current?.(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy-900/60 p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
          <div className="card w-full max-w-sm p-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-5 w-5" /></div>
            <h2 id="confirm-title" className="text-lg font-extrabold">{state.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{state.message}</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="btn-outline" onClick={() => close(false)} autoFocus>Cancel</button>
              <button className={state.danger ? 'btn-danger' : 'btn-primary'} onClick={() => close(true)}>{state.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

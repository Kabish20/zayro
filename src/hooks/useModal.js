import { useContext } from 'react';
import { ModalContext } from '@/context/modalContextDef';

/**
 * Access the modal context from any functional component
 */
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export default useModal;

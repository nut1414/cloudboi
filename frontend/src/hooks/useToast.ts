import { useNotification } from '../contexts/NotificationContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

const useToast = () => {
  const { addNotification } = useNotification();

  const showToast = (
    message: string,
    type: ToastType = 'info',
    autoDismiss = true,
    duration = 5000
  ) => {
    addNotification(type, message, autoDismiss, duration);
  };

  const toast = {
    success: (message: string, autoDismiss = true, duration = 5000) => 
      showToast(message, 'success', autoDismiss, duration),
    
    error: (message: string, autoDismiss = true, duration = 5000) => 
      showToast(message, 'error', autoDismiss, duration),
    
    info: (message: string, autoDismiss = true, duration = 5000) => 
      showToast(message, 'info', autoDismiss, duration),
    
    warning: (message: string, autoDismiss = true, duration = 5000) => 
      showToast(message, 'warning', autoDismiss, duration),
  };

  return toast;
};

export default useToast; 
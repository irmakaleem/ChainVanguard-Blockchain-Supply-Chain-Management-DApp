import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = false, 
  onClose, 
  duration = 5000,
  position = 'top-right'
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
  };

  if (!show) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-800',
      messageColor: 'text-green-700'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
      messageColor: 'text-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-800',
      messageColor: 'text-yellow-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-800',
      messageColor: 'text-blue-700'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm w-full`}>
      <div className={`
        ${config.bgColor} ${config.borderColor} 
        border rounded-lg shadow-lg p-4 
        transform transition-all duration-300 ease-in-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex items-start space-x-3">
          <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className={`text-sm font-medium ${config.titleColor} mb-1`}>
                {title}
              </h4>
            )}
            {message && (
              <p className={`text-sm ${config.messageColor}`}>
                {message}
              </p>
            )}
          </div>
          
          <button
            onClick={handleClose}
            className={`
              ${config.iconColor} hover:opacity-75 
              flex-shrink-0 ml-2 transition-opacity duration-200
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Provider Context (optional for global toast management)
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title, message, options = {}) => 
    addToast({ type: 'success', title, message, ...options });
  
  const error = (title, message, options = {}) => 
    addToast({ type: 'error', title, message, ...options });
  
  const warning = (title, message, options = {}) => 
    addToast({ type: 'warning', title, message, ...options });
  
  const info = (title, message, options = {}) => 
    addToast({ type: 'info', title, message, ...options });

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};

// Toast Container Component
export const ToastContainer = ({ toasts = [], onRemove }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <Toast
        key={toast.id}
        {...toast}
        isVisible={true}
        onClose={() => onRemove(toast.id)}
      />
    ))}
  </div>
);

export default Toast;


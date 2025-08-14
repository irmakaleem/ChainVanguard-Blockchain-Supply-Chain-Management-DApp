import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Loading...', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-6 w-6',
    large: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      {showText && (
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ text = 'Loading...', isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};

// Inline loading state for buttons
export const ButtonSpinner = ({ className = '' }) => (
  <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
);

// Loading skeleton for cards
export const CardSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 rounded-lg p-6 space-y-4">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-300 rounded"></div>
        <div className="h-3 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

// Loading skeleton for table rows
export const TableRowSkeleton = ({ columns = 4, className = '' }) => (
  <tr className={`animate-pulse ${className}`}>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded"></div>
      </td>
    ))}
  </tr>
);

export default LoadingSpinner;


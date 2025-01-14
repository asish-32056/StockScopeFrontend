import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

export default Loading;
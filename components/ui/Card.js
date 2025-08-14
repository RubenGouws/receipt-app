import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    React.createElement('div', { className: `bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 ${className}` },
      children
    )
  );
};

export default Card;
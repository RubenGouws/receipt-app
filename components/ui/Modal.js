import React from 'react';

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    React.createElement('div', {
      className: "fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center",
      onClick: onClose
    },
      React.createElement('div', {
        className: "bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col",
        onClick: (e) => e.stopPropagation()
      },
        React.createElement('div', { className: "flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700" },
          React.createElement('h2', { className: "text-xl font-bold text-slate-800 dark:text-slate-100" }, title),
          React.createElement('button', { onClick: onClose, className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
              React.createElement('line', { x1: "18", y1: "6", x2: "6", y2: "18" }),
              React.createElement('line', { x1: "6", y1: "6", x2: "18", y2: "18" })
            )
          )
        ),
        React.createElement('div', { className: "p-6 overflow-y-auto" },
          children
        )
      )
    )
  );
};

export default Modal;
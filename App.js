import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import DashboardView from './components/DashboardView.js';
import ExpensesView from './components/ExpensesView.js';
import ExpenseModal from './components/ExpenseModal.js';
import { PlusCircle, LayoutDashboard, List } from './components/Icons.js';

const NavItem = ({ to, children }) => (
  React.createElement(NavLink, {
    to: to,
    className: ({ isActive }) =>
      `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-slate-500 hover:bg-slate-700 hover:text-white'
      }`
  },
    children
  )
);

function App() {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(undefined);

  const handleAddExpense = useCallback((expense) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  }, [setExpenses]);

  const handleUpdateExpense = useCallback((updatedExpense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  }, [setExpenses]);

  const handleDeleteExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, [setExpenses]);

  const openAddModal = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  return (
    React.createElement(HashRouter, null,
      React.createElement('div', { className: "flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200" },
        React.createElement('aside', { className: "w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col" },
          React.createElement('div', { className: "h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700" },
            React.createElement('h1', { className: "text-xl font-bold text-indigo-600 dark:text-indigo-400" }, "ExpensePro")
          ),
          React.createElement('nav', { className: "flex-1 p-4 space-y-2" },
            React.createElement(NavItem, { to: "/" }, React.createElement(LayoutDashboard, { className: "mr-3" }), " Dashboard"),
            React.createElement(NavItem, { to: "/expenses" }, React.createElement(List, { className: "mr-3" }), " All Expenses")
          ),
          React.createElement('div', { className: "p-4 border-t border-slate-200 dark:border-slate-700" },
            React.createElement('button', {
              onClick: openAddModal,
              className: "w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            },
              React.createElement(PlusCircle, { className: "mr-2" }),
              "Add Expense"
            ),
            React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500 mt-4 text-center" },
              "Data is stored locally in your browser."
            )
          )
        ),
        React.createElement('main', { className: "flex-1 overflow-y-auto p-8" },
          React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(DashboardView, { expenses: expenses, onEdit: openEditModal }) }),
            React.createElement(Route, { path: "/expenses", element: React.createElement(ExpensesView, { expenses: expenses, onEdit: openEditModal, onDelete: handleDeleteExpense }) })
          )
        )
      ),
      React.createElement(ExpenseModal, {
        isOpen: isModalOpen,
        onClose: closeModal,
        onAddExpense: handleAddExpense,
        onUpdateExpense: handleUpdateExpense,
        existingExpense: editingExpense
      })
    )
  );
}

export default App;
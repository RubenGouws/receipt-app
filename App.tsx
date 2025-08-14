import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Expense } from './types';
import DashboardView from './components/DashboardView';
import ExpensesView from './components/ExpensesView';
import ExpenseModal from './components/ExpenseModal';
import { PlusCircle, LayoutDashboard, List } from './components/Icons';

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white'
          : 'text-slate-500 hover:bg-slate-700 hover:text-white'
      }`
    }
  >
    {children}
  </NavLink>
);

function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleAddExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  }, [setExpenses]);

  const handleUpdateExpense = useCallback((updatedExpense: Expense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  }, [setExpenses]);

  const handleDeleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, [setExpenses]);

  const openAddModal = () => {
    setEditingExpense(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(undefined);
  };

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">ExpensePro</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavItem to="/"><LayoutDashboard className="mr-3" /> Dashboard</NavItem>
            <NavItem to="/expenses"><List className="mr-3" /> All Expenses</NavItem>
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={openAddModal}
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <PlusCircle className="mr-2" />
              Add Expense
            </button>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center">
                Data is stored locally in your browser.
            </p>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<DashboardView expenses={expenses} onEdit={openEditModal} />} />
            <Route path="/expenses" element={<ExpensesView expenses={expenses} onEdit={openEditModal} onDelete={handleDeleteExpense} />} />
          </Routes>
        </main>
      </div>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddExpense={handleAddExpense}
        onUpdateExpense={handleUpdateExpense}
        existingExpense={editingExpense}
      />
    </HashRouter>
  );
}

export default App;

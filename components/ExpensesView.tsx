
import React, { useState, useMemo } from 'react';
import type { Expense } from '../types';
import { CATEGORIES } from '../constants';
import { generateCSV, generatePDF } from '../services/reportingService';
import Card from './ui/Card';
import { Download, Edit2, Trash2, Filter } from './Icons';

interface ExpensesViewProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, onEdit, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [sortKey, setSortKey] = useState<keyof Expense>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedExpenses = useMemo(() => {
    return [...expenses]
      .filter(e => {
        const expenseDate = new Date(e.date);
        const start = filterStartDate ? new Date(filterStartDate) : null;
        const end = filterEndDate ? new Date(filterEndDate) : null;
        
        if (filterCategory !== 'All' && e.category !== filterCategory) return false;
        if (start && expenseDate < start) return false;
        if (end && expenseDate > end) return false;

        return true;
      })
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [expenses, filterCategory, filterStartDate, filterEndDate, sortKey, sortOrder]);

  const handleSort = (key: keyof Expense) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortableHeader = ({ tkey, label }: { tkey: keyof Expense, label: string }) => (
    <th onClick={() => handleSort(tkey)} className="p-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
      <div className="flex items-center">
        {label}
        {sortKey === tkey && <span className="ml-1">{sortOrder === 'asc' ? '▲' : '▼'}</span>}
      </div>
    </th>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">All Expenses</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => generateCSV(filteredAndSortedExpenses)} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 flex items-center gap-2 text-sm">
            <Download size={16}/> CSV
          </button>
          <button onClick={() => generatePDF(filteredAndSortedExpenses)} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 flex items-center gap-2 text-sm">
            <Download size={16}/> PDF
          </button>
        </div>
      </div>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option>All</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
            <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
            <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <SortableHeader tkey="date" label="Date" />
                <SortableHeader tkey="merchant" label="Merchant" />
                <SortableHeader tkey="category" label="Category" />
                <SortableHeader tkey="amount" label="Amount" />
                <th className="p-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredAndSortedExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{expense.date}</td>
                  <td className="p-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{expense.merchant}</td>
                  <td className="p-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{expense.category}</td>
                  <td className="p-3 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200">{expense.amount.toFixed(2)} {expense.currency}</td>
                  <td className="p-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      <button onClick={() => onEdit(expense)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"><Edit2 size={18}/></button>
                      <button onClick={() => onDelete(expense.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><Trash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAndSortedExpenses.length === 0 && (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No expenses match your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ExpensesView;

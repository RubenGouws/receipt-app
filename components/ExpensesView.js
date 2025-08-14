import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../constants.js';
import { generateCSV, generatePDF } from '../services/reportingService.js';
import Card from './ui/Card.js';
import { Download, Edit2, Trash2 } from './Icons.js';

const ExpensesView = ({ expenses, onEdit, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

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

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortableHeader = ({ tkey, label }) => (
    React.createElement('th', { onClick: () => handleSort(tkey), className: "p-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700" },
      React.createElement('div', { className: "flex items-center" },
        label,
        sortKey === tkey && React.createElement('span', { className: "ml-1" }, sortOrder === 'asc' ? '▲' : '▼')
      )
    )
  );
  
  return (
    React.createElement('div', { className: "space-y-6" },
      React.createElement('div', { className: "flex justify-between items-center" },
        React.createElement('h1', { className: "text-3xl font-bold text-slate-800 dark:text-slate-100" }, "All Expenses"),
        React.createElement('div', { className: "flex items-center gap-2" },
          React.createElement('button', { onClick: () => generateCSV(filteredAndSortedExpenses), className: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 flex items-center gap-2 text-sm" },
            React.createElement(Download, { size: 16 }), " CSV"
          ),
          React.createElement('button', { onClick: () => generatePDF(filteredAndSortedExpenses), className: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 flex items-center gap-2 text-sm" },
            React.createElement(Download, { size: 16 }), " PDF"
          )
        )
      ),
      
      React.createElement(Card, null,
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg" },
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" }, "Category"),
            React.createElement('select', { value: filterCategory, onChange: e => setFilterCategory(e.target.value), className: "w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" },
              React.createElement('option', null, "All"),
              CATEGORIES.map(c => React.createElement('option', { key: c }, c))
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" }, "Start Date"),
            React.createElement('input', { type: "date", value: filterStartDate, onChange: e => setFilterStartDate(e.target.value), className: "w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" })
          ),
          React.createElement('div', null,
            React.createElement('label', { className: "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" }, "End Date"),
            React.createElement('input', { type: "date", value: filterEndDate, onChange: e => setFilterEndDate(e.target.value), className: "w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" })
          )
        ),
        
        React.createElement('div', { className: "overflow-x-auto" },
          React.createElement('table', { className: "min-w-full divide-y divide-slate-200 dark:divide-slate-700" },
            React.createElement('thead', { className: "bg-slate-50 dark:bg-slate-700/50" },
              React.createElement('tr', null,
                React.createElement(SortableHeader, { tkey: "date", label: "Date" }),
                React.createElement(SortableHeader, { tkey: "merchant", label: "Merchant" }),
                React.createElement(SortableHeader, { tkey: "category", label: "Category" }),
                React.createElement(SortableHeader, { tkey: "amount", label: "Amount" }),
                React.createElement('th', { className: "p-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider" }, "Actions")
              )
            ),
            React.createElement('tbody', { className: "bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700" },
              filteredAndSortedExpenses.map(expense => (
                React.createElement('tr', { key: expense.id, className: "hover:bg-slate-50 dark:hover:bg-slate-700/50" },
                  React.createElement('td', { className: "p-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300" }, expense.date),
                  React.createElement('td', { className: "p-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100" }, expense.merchant),
                  React.createElement('td', { className: "p-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300" }, expense.category),
                  React.createElement('td', { className: "p-3 whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-200" }, `${expense.amount.toFixed(2)} ${expense.currency}`),
                  React.createElement('td', { className: "p-3 whitespace-nowrap text-sm font-medium" },
                    React.createElement('div', { className: "flex items-center gap-4" },
                      React.createElement('button', { onClick: () => onEdit(expense), className: "text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200" }, React.createElement(Edit2, { size: 18 })),
                      React.createElement('button', { onClick: () => onDelete(expense.id), className: "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" }, React.createElement(Trash2, { size: 18 }))
                    )
                  )
                )
              ))
            )
          ),
          filteredAndSortedExpenses.length === 0 && (
            React.createElement('div', { className: "text-center py-8 text-slate-500 dark:text-slate-400" },
              "No expenses match your filters."
            )
          )
        )
      )
    )
  );
};

export default ExpensesView;
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from './ui/Card.js';
import { Edit2 } from './Icons.js';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const DashboardView = ({ expenses, onEdit }) => {
  const { totalThisMonth, categoryData, recentExpenses } = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const expensesThisMonth = expenses.filter(e => new Date(e.date) >= firstDayOfMonth);
    
    const totalThisMonth = expensesThisMonth.length; 

    const categorySpending = expensesThisMonth.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {});

    const categoryData = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      
    return { totalThisMonth, categoryData, recentExpenses };
  }, [expenses]);

  return (
    React.createElement('div', { className: "space-y-8" },
      React.createElement('h1', { className: "text-3xl font-bold text-slate-800 dark:text-slate-100" }, "Dashboard"),
      
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6" },
        React.createElement(Card, null,
          React.createElement('h3', { className: "text-sm font-medium text-slate-500 dark:text-slate-400" }, "Total Expenses (This Month)"),
          React.createElement('p', { className: "text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100" }, totalThisMonth),
          React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500 mt-1" }, "Number of transactions")
        ),
        React.createElement(Card, null,
          React.createElement('h3', { className: "text-sm font-medium text-slate-500 dark:text-slate-400" }, "Total Expenses (All Time)"),
          React.createElement('p', { className: "text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100" }, expenses.length),
          React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500 mt-1" }, "Number of transactions")
        ),
         React.createElement(Card, null,
          React.createElement('h3', { className: "text-sm font-medium text-slate-500 dark:text-slate-400" }, "Top Category (This Month)"),
          React.createElement('p', { className: "text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100" }, categoryData.length > 0 ? categoryData[0].name : 'N/A'),
          React.createElement('p', { className: "text-xs text-slate-400 dark:text-slate-500 mt-1" }, "Based on amount spent")
        )
      ),

      React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-5 gap-6" },
        React.createElement(Card, { className: "lg:col-span-3" },
          React.createElement('h3', { className: "text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4" }, "Spending by Category (This Month)"),
          categoryData.length > 0 ? (
            React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
              React.createElement(PieChart, null,
                React.createElement(Pie, { data: categoryData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 100, fill: "#8884d8", label: true },
                  categoryData.map((entry, index) => (
                    React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length] })
                  ))
                ),
                React.createElement(Tooltip, { formatter: (value) => value.toFixed(2) }),
                React.createElement(Legend, null)
              )
            )
          ) : (
            React.createElement('div', { className: "flex items-center justify-center h-full text-slate-500 dark:text-slate-400" },
              "No data for this month."
            )
          )
        ),
        
        React.createElement(Card, { className: "lg:col-span-2" },
          React.createElement('h3', { className: "text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4" }, "Recent Expenses"),
          React.createElement('div', { className: "space-y-4" },
            recentExpenses.length > 0 ? recentExpenses.map(expense => (
              React.createElement('div', { key: expense.id, className: "flex items-center justify-between" },
                React.createElement('div', null,
                  React.createElement('p', { className: "font-medium text-slate-700 dark:text-slate-200" }, expense.merchant),
                  React.createElement('p', { className: "text-sm text-slate-500 dark:text-slate-400" }, expense.date)
                ),
                React.createElement('div', { className: "text-right" },
                  React.createElement('p', { className: "font-semibold text-indigo-600 dark:text-indigo-400" }, `${Number(expense.amount).toFixed(2)} ${expense.currency}`),
                   React.createElement('button', { onClick: () => onEdit(expense), className: "text-slate-400 hover:text-indigo-500 mt-1" },
                    React.createElement(Edit2, { size: 16 })
                  )
                )
              )
            )) : React.createElement('p', { className: "text-slate-500 dark:text-slate-400" }, "No expenses recorded yet.")
          )
        )
      )
    )
  );
};

export default DashboardView;
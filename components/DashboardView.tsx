import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Expense } from '../types';
import Card from './ui/Card';
import { Edit2 } from './Icons';

interface DashboardViewProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
}

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff'];

const DashboardView: React.FC<DashboardViewProps> = ({ expenses, onEdit }) => {
  const { totalThisMonth, categoryData, recentExpenses } = useMemo(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const expensesThisMonth = expenses.filter(e => new Date(e.date) >= firstDayOfMonth);
    
    // Note: This is a simplified total and doesn't convert currencies.
    // It's more of an activity count or sum of raw amounts.
    const totalThisMonth = expensesThisMonth.length; 

    const categorySpending = expensesThisMonth.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categorySpending)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      
    return { totalThisMonth, categoryData, recentExpenses };
  }, [expenses]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses (This Month)</h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{totalThisMonth}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Number of transactions</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses (All Time)</h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{expenses.length}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Number of transactions</p>
        </Card>
         <Card>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Top Category (This Month)</h3>
          <p className="text-3xl font-bold mt-2 text-slate-800 dark:text-slate-100">{categoryData.length > 0 ? categoryData[0].name : 'N/A'}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Based on amount spent</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Spending by Category (This Month)</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
              No data for this month.
            </div>
          )}
        </Card>
        
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent Expenses</h3>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? recentExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{expense.merchant}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{expense.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-indigo-600 dark:text-indigo-400">{Number(expense.amount).toFixed(2)} {expense.currency}</p>
                   <button onClick={() => onEdit(expense)} className="text-slate-400 hover:text-indigo-500 mt-1">
                    <Edit2 size={16}/>
                  </button>
                </div>
              </div>
            )) : <p className="text-slate-500 dark:text-slate-400">No expenses recorded yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;

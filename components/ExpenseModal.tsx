import React, { useState, useEffect } from 'react';
import type { Expense, ScannedExpenseData } from '../types';
import { CATEGORIES, CURRENCIES } from '../constants';
import Modal from './ui/Modal';
import CameraCapture from './CameraCapture';
import { extractExpenseFromImage } from '../services/geminiService';
import { Scan, Keyboard, AlertTriangle, CheckCircle, Loader, Upload } from './Icons';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  existingExpense?: Expense;
}

const emptyFormData = {
  merchant: '',
  date: new Date().toISOString().split('T')[0],
  amount: '',
  currency: 'USD',
  category: CATEGORIES[0],
  description: '',
};

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onUpdateExpense,
  existingExpense,
}) => {
  const [formData, setFormData] = useState(emptyFormData);
  const [activeTab, setActiveTab] = useState<'manual' | 'scan' | 'upload'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (existingExpense) {
      setFormData({
        ...existingExpense,
        amount: String(existingExpense.amount),
      });
      setActiveTab('manual');
    } else {
      setFormData(emptyFormData);
      setActiveTab('manual');
    }
    setError(null);
    setSuccess(null);
  }, [existingExpense, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleScan = async (base64Image: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const extractedData:ScannedExpenseData = await extractExpenseFromImage(base64Image);
      setFormData(prev => ({
        ...prev,
        merchant: extractedData.merchant || prev.merchant,
        date: extractedData.date || prev.date,
        amount: extractedData.totalAmount?.toString() || prev.amount,
        currency: CURRENCIES.includes(extractedData.currency || '') ? extractedData.currency! : prev.currency
      }));
      setSuccess("Receipt analyzed! Please review the details.");
      setActiveTab('manual');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please select a file smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64String = result.split(',')[1];
        if (base64String) {
          handleScan(base64String);
        } else {
          setError("Could not read the selected file. It might be corrupted.");
        }
      };
      reader.onerror = () => {
        setError("An error occurred while reading the file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (isNaN(expenseData.amount) || expenseData.amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    
    if (existingExpense) {
      onUpdateExpense({ ...expenseData, id: existingExpense.id });
    } else {
      onAddExpense(expenseData);
    }
    onClose();
  };
  
  const switchTab = (tab: 'manual' | 'scan' | 'upload') => {
      // Don't clear success message if we are switching to manual from another tab
      if(tab !== 'manual' || activeTab === 'manual'){
        setSuccess(null);
      }
      setError(null);
      setActiveTab(tab);
  };

  const TabButton = ({ tab, label, icon }: {tab: 'manual' | 'scan' | 'upload', label: string, icon: React.ReactNode}) => (
    <button
      type="button"
      onClick={() => switchTab(tab)}
      className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === tab 
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {icon} <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingExpense ? 'Edit Expense' : 'Add New Expense'}>
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <TabButton tab="manual" label="Manual Entry" icon={<Keyboard/>} />
        {!existingExpense && <TabButton tab="scan" label="Scan Receipt" icon={<Scan />} />}
        {!existingExpense && <TabButton tab="upload" label="Upload File" icon={<Upload />} />}
      </div>
      
      <div className="mt-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600 dark:text-slate-300">
            <Loader className="animate-spin mb-4" size={48} />
            <p className="text-lg">Analyzing your receipt...</p>
            <p className="text-sm text-slate-500">This may take a moment.</p>
          </div>
        )}

        {!isLoading && activeTab === 'upload' && (
          <div>
            {error && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center"><AlertTriangle className="mr-2"/>{error}</div>}
            <div className="flex flex-col items-center justify-center h-64">
              <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-4">
                  <span>Select a receipt file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </label>
                <p className="text-xs leading-5 text-slate-600 dark:text-slate-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'scan' && (
          <CameraCapture onCapture={handleScan} />
        )}
        
        {!isLoading && activeTab === 'manual' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center"><AlertTriangle className="mr-2"/>{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center"><CheckCircle className="mr-2"/>{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="merchant" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Merchant</label>
                <input type="text" name="merchant" value={formData.merchant} onChange={handleInputChange} required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required placeholder="0.00" step="0.01" className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div className="flex justify-end pt-4 gap-3">
              <button type="button" onClick={onClose} className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600">Cancel</button>
              <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">{existingExpense ? 'Save Changes' : 'Add Expense'}</button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ExpenseModal;
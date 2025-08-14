import React, { useState, useEffect } from 'react';
import { CATEGORIES, CURRENCIES } from '../constants.js';
import Modal from './ui/Modal.js';
import CameraCapture from './CameraCapture.js';
import { extractExpenseFromImage } from '../services/geminiService.js';
import { Scan, Keyboard, AlertTriangle, CheckCircle, Loader, Upload } from './Icons.js';

const emptyFormData = {
  merchant: '',
  date: new Date().toISOString().split('T')[0],
  amount: '',
  currency: 'USD',
  category: CATEGORIES[0],
  description: '',
};

const ExpenseModal = ({
  isOpen,
  onClose,
  onAddExpense,
  onUpdateExpense,
  existingExpense,
}) => {
  const [formData, setFormData] = useState(emptyFormData);
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleScan = async (base64Image) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const extractedData = await extractExpenseFromImage(base64Image);
      setFormData(prev => ({
        ...prev,
        merchant: extractedData.merchant || prev.merchant,
        date: extractedData.date || prev.date,
        amount: extractedData.totalAmount?.toString() || prev.amount,
        currency: CURRENCIES.includes(extractedData.currency || '') ? extractedData.currency : prev.currency
      }));
      setSuccess("Receipt analyzed! Please review the details.");
      setActiveTab('manual');
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
       if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File is too large. Please select a file smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
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

  const handleSubmit = (e) => {
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
  
  const switchTab = (tab) => {
      if(tab !== 'manual' || activeTab === 'manual'){
        setSuccess(null);
      }
      setError(null);
      setActiveTab(tab);
  };

  const TabButton = ({ tab, label, icon }) => (
    React.createElement('button', {
      type: "button",
      onClick: () => switchTab(tab),
      className: `flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === tab 
        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'
      }`
    },
      icon, React.createElement('span', { className: "ml-2" }, label)
    )
  );

  return (
    React.createElement(Modal, { isOpen: isOpen, onClose: onClose, title: existingExpense ? 'Edit Expense' : 'Add New Expense' },
      React.createElement('div', { className: "flex border-b border-slate-200 dark:border-slate-700" },
        React.createElement(TabButton, { tab: "manual", label: "Manual Entry", icon: React.createElement(Keyboard, null) }),
        !existingExpense && React.createElement(TabButton, { tab: "scan", label: "Scan Receipt", icon: React.createElement(Scan, null) }),
        !existingExpense && React.createElement(TabButton, { tab: "upload", label: "Upload File", icon: React.createElement(Upload, null) })
      ),
      
      React.createElement('div', { className: "mt-6" },
        isLoading && (
          React.createElement('div', { className: "flex flex-col items-center justify-center h-64 text-slate-600 dark:text-slate-300" },
            React.createElement(Loader, { className: "animate-spin mb-4", size: 48 }),
            React.createElement('p', { className: "text-lg" }, "Analyzing your receipt..."),
            React.createElement('p', { className: "text-sm text-slate-500" }, "This may take a moment.")
          )
        ),

        !isLoading && activeTab === 'upload' && (
          React.createElement('div', null,
            error && React.createElement('div', { className: "mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" }, React.createElement(AlertTriangle, { className: "mr-2" }), error),
            React.createElement('div', { className: "flex flex-col items-center justify-center h-64" },
              React.createElement('div', { className: "flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center" },
                React.createElement(Upload, { className: "mx-auto h-12 w-12 text-slate-400" }),
                React.createElement('label', { htmlFor: "file-upload", className: "relative cursor-pointer rounded-md font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 mt-4" },
                  React.createElement('span', null, "Select a receipt file"),
                  React.createElement('input', { id: "file-upload", name: "file-upload", type: "file", className: "sr-only", accept: "image/png, image/jpeg, image/webp", onChange: handleFileChange })
                ),
                React.createElement('p', { className: "text-xs leading-5 text-slate-600 dark:text-slate-400 mt-2" }, "PNG, JPG, WEBP up to 5MB")
              )
            )
          )
        ),

        !isLoading && activeTab === 'scan' && (
          React.createElement(CameraCapture, { onCapture: handleScan })
        ),
        
        !isLoading && activeTab === 'manual' && (
          React.createElement('form', { onSubmit: handleSubmit, className: "space-y-4" },
            error && React.createElement('div', { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center" }, React.createElement(AlertTriangle, { className: "mr-2" }), error),
            success && React.createElement('div', { className: "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center" }, React.createElement(CheckCircle, { className: "mr-2" }), success),

            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "merchant", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Merchant"),
                React.createElement('input', { type: "text", name: "merchant", value: formData.merchant, onChange: handleInputChange, required: true, className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" })
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "date", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Date"),
                React.createElement('input', { type: "date", name: "date", value: formData.date, onChange: handleInputChange, required: true, className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" })
              )
            ),
            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "amount", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Amount"),
                React.createElement('input', { type: "number", name: "amount", value: formData.amount, onChange: handleInputChange, required: true, placeholder: "0.00", step: "0.01", className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" })
              ),
              React.createElement('div', null,
                React.createElement('label', { htmlFor: "currency", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Currency"),
                React.createElement('select', { name: "currency", value: formData.currency, onChange: handleInputChange, required: true, className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" },
                  CURRENCIES.map(c => React.createElement('option', { key: c, value: c }, c))
                )
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "category", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Category"),
              React.createElement('select', { name: "category", value: formData.category, onChange: handleInputChange, required: true, className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" },
                CATEGORIES.map(c => React.createElement('option', { key: c, value: c }, c))
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { htmlFor: "description", className: "block text-sm font-medium text-slate-700 dark:text-slate-300" }, "Description (Optional)"),
              React.createElement('textarea', { name: "description", value: formData.description, onChange: handleInputChange, rows: 3, className: "mt-1 block w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" })
            ),
            React.createElement('div', { className: "flex justify-end pt-4 gap-3" },
              React.createElement('button', { type: "button", onClick: onClose, className: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600" }, "Cancel"),
              React.createElement('button', { type: "submit", className: "bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200" }, existingExpense ? 'Save Changes' : 'Add Expense')
            )
          )
        )
      )
    )
  );
};

export default ExpenseModal;
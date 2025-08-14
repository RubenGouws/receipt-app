
import type { Expense } from '../types';

declare const jspdf: any;

export const generateCSV = (expenses: Expense[]) => {
  if (expenses.length === 0) return;

  const headers = ["Date", "Merchant", "Category", "Amount", "Currency", "Description"];
  const rows = expenses.map(e => 
    [e.date, e.merchant, e.category, e.amount, e.currency, e.description].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const generatePDF = (expenses: Expense[]) => {
  if (expenses.length === 0) return;

  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("Expense Report", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableColumn = ["Date", "Merchant", "Category", "Description", "Amount"];
  const tableRows: (string|number)[][] = [];

  expenses.forEach(expense => {
    const expenseData = [
      expense.date,
      expense.merchant,
      expense.category,
      expense.description,
      `${expense.amount.toFixed(2)} ${expense.currency}`,
    ];
    tableRows.push(expenseData);
  });
  
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    headStyles: { fillColor: [74, 85, 104] }, // slate-600
    theme: 'striped',
  });

  const totalExpensesByCurrency = expenses.reduce((acc, curr) => {
    acc[curr.currency] = (acc[curr.currency] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const finalY = (doc as any).lastAutoTable.finalY || 250;
  doc.setFontSize(14);
  doc.text("Summary", 14, finalY + 15);
  doc.setFontSize(11);
  
  let currentY = finalY + 22;
  Object.entries(totalExpensesByCurrency).forEach(([currency, total]) => {
    doc.text(`Total (${currency}): ${total.toFixed(2)}`, 14, currentY);
    currentY += 7;
  });

  doc.save(`Expense-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};

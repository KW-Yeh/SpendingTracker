'use client';

import { OUTCOME_TYPE_MAP } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { BiCalendar, BiCategory, BiMoney, BiNote, BiX } from 'react-icons/bi';

interface BudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BudgetItem) => void;
  editItem?: BudgetItem | null;
}

export const BudgetForm = ({ isOpen, onClose, onSave, editItem }: BudgetFormProps) => {
  const [formData, setFormData] = useState<BudgetItem>({
    id: '',
    category: '',
    amount: 0,
    spent: 0,
    period: '每月',
    note: ''
  });
  
  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      setFormData({
        id: generateId(),
        category: '',
        amount: 0,
        spent: 0,
        period: '每月',
        note: ''
      });
    }
  }, [editItem, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'spent' ? Number(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div 
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editItem ? '編輯預算項目' : '新增預算項目'}
            </h2>
            <button 
              onClick={onClose}
              className="rounded-full bg-white bg-opacity-20 p-1.5 text-white transition-colors hover:bg-opacity-30"
            >
              <BiX className="size-5" />
            </button>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Category */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <BiCategory className="size-4 text-primary-500" />
                類別
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                <option value="">選擇類別</option>
                {OUTCOME_TYPE_MAP.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.value} {item.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Budget Amount */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <BiMoney className="size-4 text-primary-500" />
                預算金額
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                  min="0"
                />
              </div>
            </div>
            
            {/* Spent Amount */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <BiMoney className="size-4 text-green-500" />
                已使用金額
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="spent"
                  value={formData.spent}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 pl-7 pr-3 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min="0"
                />
              </div>
            </div>
            
            {/* Period */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <BiCalendar className="size-4 text-primary-500" />
                週期
              </label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="每月">每月</option>
                <option value="每季">每季</option>
                <option value="每年">每年</option>
                <option value="一次性">一次性</option>
              </select>
            </div>
            
            {/* Note */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <BiNote className="size-4 text-primary-500" />
                備註
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                rows={3}
                placeholder="輸入備註..."
              />
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 transition-colors hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-2.5 text-white transition-all hover:from-primary-600 hover:to-primary-700"
            >
              {editItem ? '更新' : '儲存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

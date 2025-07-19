'use client';

import { CATEGORY_WORDING_MAP } from '@/utils/constants';
import { useState, useEffect } from 'react';
import { BiCalendar, BiCategory, BiMoney } from 'react-icons/bi';
import { SimpleModal } from './SimpleModal';

interface SimpleBudgetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: BudgetItem) => void;
  editItem?: BudgetItem | null;
}

export const SimpleBudgetForm = ({ isOpen, onClose, onSave, editItem }: SimpleBudgetFormProps) => {
  const [formData, setFormData] = useState<BudgetItem>({
    id: '',
    category: '',
    amount: 0,
    spent: 0,
    period: '每月',
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
      });
    }
  }, [editItem, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Skip changes to the spent field as it's read-only
    if (name === 'spent') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Get unique categories from CATEGORY_WORDING_MAP
  const uniqueCategories = Array.from(new Set(Object.values(CATEGORY_WORDING_MAP)));
  
  return (
    <SimpleModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={editItem ? '編輯預算項目' : '新增預算項目'}
    >
      <form onSubmit={handleSubmit}>
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
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
          
          {/* Spent Amount - Read Only */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <BiMoney className="size-4 text-green-500" />
              已使用金額 (自動計算)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="text"
                value={formData.spent}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-7 pr-3 py-2.5 text-gray-700"
                disabled
                readOnly
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">此金額根據實際支出自動計算，無需手動輸入</p>
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
    </SimpleModal>
  );
};

// Helper function to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

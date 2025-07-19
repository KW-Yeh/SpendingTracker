'use client';

import { useEffect, useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { MonthlyBudgetChart } from './MonthlyBudgetChart';

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const CATEGORIES = ['飲食', '交通', '住宿', '娛樂', '醫療', '教育', '其他'];

export const MonthlyBudgetTemplate = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyBudgetData[]>([]);
  const [editingCell, setEditingCell] = useState<{month: string, category: string} | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  
  // Initialize monthly data
  useEffect(() => {
    const initialData = MONTHS.map(month => {
      const monthData: any = { month };
      CATEGORIES.forEach(category => {
        monthData[category] = 0;
      });
      return monthData;
    });
    
    setMonthlyData(initialData);
  }, []);
  
  const handleCellClick = (month: string, category: string, value: number) => {
    setEditingCell({ month, category });
    setInputValue(value.toString());
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    if (editingCell) {
      const { month, category } = editingCell;
      const value = Number(inputValue) || 0;
      
      setMonthlyData(prev => 
        prev.map(item => 
          item.month === month 
            ? { ...item, [category]: value } 
            : item
        )
      );
      
      setEditingCell(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };
  
  const getMonthTotal = (month: string) => {
    const monthData = monthlyData.find(item => item.month === month);
    if (!monthData) return 0;
    
    return CATEGORIES.reduce((sum, category) => sum + (monthData[category] || 0), 0);
  };
  
  const getCategoryTotal = (category: string) => {
    return monthlyData.reduce((sum, item) => sum + (item[category] || 0), 0);
  };
  
  const getGrandTotal = () => {
    return monthlyData.reduce((sum, item) => {
      return sum + CATEGORIES.reduce((catSum, category) => catSum + (item[category] || 0), 0);
    }, 0);
  };
  
  return (
    <div className="flex w-full flex-col pt-6">
      <div className="mb-8">
        <MonthlyBudgetChart data={monthlyData} />
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-800">月度預算表</h3>
        <button className="flex items-center gap-1 rounded-lg bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-200">
          <BiPlus className="size-4" />
          <span>匯出預算表</span>
        </button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-r border-gray-200 p-3 text-left text-sm font-medium text-gray-700">類別 / 月份</th>
              {MONTHS.map(month => (
                <th key={month} className="border-b border-r border-gray-200 p-3 text-center text-sm font-medium text-gray-700">
                  {month}
                </th>
              ))}
              <th className="border-b border-gray-200 p-3 text-center text-sm font-medium text-gray-700">總計</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map(category => (
              <tr key={category} className="hover:bg-gray-50">
                <td className="border-r border-gray-200 p-3 font-medium text-gray-700">{category}</td>
                {MONTHS.map(month => {
                  const value = monthlyData.find(item => item.month === month)?.[category] || 0;
                  const isEditing = editingCell?.month === month && editingCell?.category === category;
                  
                  return (
                    <td 
                      key={`${month}-${category}`} 
                      className="border-r border-gray-200 p-3 text-center"
                      onClick={() => handleCellClick(month, category, value)}
                    >
                      {isEditing ? (
                        <input
                          type="number"
                          value={inputValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyDown={handleKeyDown}
                          className="w-full rounded border border-primary-300 p-1 text-center focus:border-primary-500 focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="cursor-pointer hover:text-primary-600">
                          {value > 0 ? value.toLocaleString() : '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="border-gray-200 p-3 text-center font-medium text-gray-700">
                  {getCategoryTotal(category).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-medium">
              <td className="border-r border-t border-gray-200 p-3 text-gray-700">月度總計</td>
              {MONTHS.map(month => (
                <td key={`total-${month}`} className="border-r border-t border-gray-200 p-3 text-center text-gray-700">
                  {getMonthTotal(month).toLocaleString()}
                </td>
              ))}
              <td className="border-t border-gray-200 p-3 text-center text-gray-700">
                {getGrandTotal().toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>點擊單元格可編輯預算金額</p>
      </div>
    </div>
  );
};

'use client';

import { useGetSpendingCtx } from '@/context/SpendingProvider';
import { useUserConfigCtx } from '@/context/UserConfigProvider';
import { CATEGORY_WORDING_MAP } from '@/utils/constants';
import { getStartEndOfMonth } from '@/utils/getStartEndOfMonth';
import { useEffect, useMemo, useState } from 'react';
import { BiFilter, BiPlus, BiRefresh, BiSearch } from 'react-icons/bi';
import { BudgetCard } from './BudgetCard';
import { BudgetDistributionChart } from './BudgetDistributionChart';
import { BudgetForm } from './BudgetForm';

export const ItemBudgetTemplate = () => {
  const { data: spendingData, syncData, loading: spendingLoading } = useGetSpendingCtx();
  const { config: userData } = useUserConfigCtx();
  
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch spending data when component mounts
  useEffect(() => {
    if (userData?.email) {
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
      
      // Get data for the entire year to have a comprehensive view
      syncData(
        undefined, // groupId
        userData.email,
        firstDayOfYear.toISOString(),
        lastDayOfYear.toISOString()
      );
    }
  }, [userData?.email, syncData]);
  
  // Process spending data to create budget items
  const processedSpendingData = useMemo(() => {
    if (!spendingData || spendingData.length === 0) return [];
    
    // Group spending by category
    const categoryMap = new Map<string, { 
      total: number,      // Total budget amount
      spent: number,      // Amount spent
      count: number,      // Number of transactions
      lastDate: Date      // Date of most recent transaction
    }>();
    
    // Process all spending records
    spendingData.forEach(record => {
      const category = CATEGORY_WORDING_MAP[record.category] || record.category;
      const recordDate = new Date(record.date);
      
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { 
          total: 0, 
          spent: 0, 
          count: 0,
          lastDate: recordDate
        });
      }
      
      const categoryData = categoryMap.get(category)!;
      
      // For outcome type, add to spent amount
      if (record.type === 'Outcome') {
        categoryData.spent += record.amount;
        categoryData.count += 1;
        
        // Update last date if this record is more recent
        if (recordDate > categoryData.lastDate) {
          categoryData.lastDate = recordDate;
        }
      }
    });
    
    // Calculate monthly averages and set budgets
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const monthsElapsed = currentMonth + 1; // +1 because months are 0-indexed
    
    // Convert map to array of budget items
    return Array.from(categoryMap.entries())
      .filter(([_, data]) => data.spent > 0) // Only include categories with spending
      .map(([category, data], index) => {
        // Calculate monthly average spending
        const monthlyAverage = data.spent / monthsElapsed;
        
        // Set budget to be 20% higher than monthly average
        const budgetAmount = Math.round(monthlyAverage * 1.2);
        
        // Calculate this month's spending for this category
        const thisMonthSpending = spendingData
          .filter(record => {
            const recordDate = new Date(record.date);
            const recordCategory = CATEGORY_WORDING_MAP[record.category] || record.category;
            return (
              recordCategory === category &&
              record.type === 'Outcome' &&
              recordDate.getMonth() === currentMonth &&
              recordDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, record) => sum + record.amount, 0);
        
        // Determine period based on frequency
        let period = '每月';
        if (data.count === 1) {
          period = '一次性';
        } else if (data.count <= 4 && monthsElapsed > 3) {
          period = '每季';
        }
        
        return {
          id: `budget-${index}`,
          category,
          amount: budgetAmount,
          spent: thisMonthSpending,
          period,
          note: `基於過去${monthsElapsed}個月的平均支出 $${Math.round(monthlyAverage)}`
        };
      })
      .sort((a, b) => b.amount - a.amount); // Sort by budget amount (descending)
  }, [spendingData]);
  
  // Initialize budget items from processed spending data
  useEffect(() => {
    if (processedSpendingData.length > 0) {
      setBudgetItems(processedSpendingData);
      setIsLoading(false);
    } else if (!spendingLoading && spendingData.length > 0) {
      setIsLoading(false);
    }
  }, [processedSpendingData, spendingLoading, spendingData]);
  
  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };
  
  const handleEditItem = (item: BudgetItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    if (window.confirm('確定要刪除這個預算項目嗎？')) {
      setBudgetItems(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleSaveItem = (item: BudgetItem) => {
    if (editingItem) {
      // Update existing item
      setBudgetItems(prev => 
        prev.map(prevItem => 
          prevItem.id === item.id ? item : prevItem
        )
      );
    } else {
      // Add new item
      setBudgetItems(prev => [...prev, item]);
    }
  };
  
  const handleRefreshData = () => {
    setIsLoading(true);
    if (userData?.email) {
      const today = new Date();
      const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
      const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
      
      syncData(
        undefined,
        userData.email,
        firstDayOfYear.toISOString(),
        lastDayOfYear.toISOString()
      );
    }
  };
  
  const filteredItems = budgetItems
    .filter(item => filterPeriod === 'all' || item.period === filterPeriod)
    .filter(item => 
      searchTerm === '' || 
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  // Get current month name
  const currentMonthName = new Date().toLocaleString('zh-TW', { month: 'long' });
  
  return (
    <div className="flex w-full flex-col">
      {/* Header with month and refresh button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {currentMonthName}預算
        </h2>
        <button
          onClick={handleRefreshData}
          className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-200"
          disabled={isLoading}
        >
          <BiRefresh className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>更新資料</span>
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-primary-600">本月預算</p>
          <p className="mt-1 text-2xl font-bold text-primary-700">${totalBudget.toLocaleString()}</p>
          <div className="mt-2 h-1 w-full rounded-full bg-primary-200">
            <div className="h-full rounded-full bg-primary-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        
        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-green-600">已使用</p>
          <p className="mt-1 text-2xl font-bold text-green-700">${totalSpent.toLocaleString()}</p>
          <div className="mt-2 h-1 w-full rounded-full bg-green-200">
            <div 
              className="h-full rounded-full bg-green-500" 
              style={{ width: `${spentPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm">
          <p className="text-sm font-medium text-blue-600">剩餘預算</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">${remainingBudget.toLocaleString()}</p>
          <div className="mt-2 h-1 w-full rounded-full bg-blue-200">
            <div 
              className="h-full rounded-full bg-blue-500" 
              style={{ width: `${100 - spentPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="mb-8 flex w-full flex-col items-center justify-center rounded-lg bg-white p-12 text-center shadow-sm">
          <div className="mb-4 size-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500"></div>
          <p className="text-lg text-gray-600">正在載入預算資料...</p>
        </div>
      )}
      
      {/* Chart and Controls */}
      {!isLoading && (
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-5 shadow-sm lg:col-span-3">
            <h3 className="mb-4 text-lg font-medium text-gray-800">預算分配</h3>
            <div className="h-80">
              {budgetItems.length > 0 ? (
                <BudgetDistributionChart data={budgetItems} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-gray-500">沒有預算資料可顯示</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col justify-between rounded-lg bg-white p-5 shadow-sm lg:col-span-2">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-800">預算使用狀況</h3>
              {budgetItems.length > 0 ? (
                <>
                  <div className="mb-6">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">使用進度</span>
                      <span className="font-medium text-gray-800">{Math.round(spentPercentage)}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all"
                        style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {budgetItems.slice(0, 4).map(item => {
                      const itemPercentage = item.amount > 0 ? (item.spent / item.amount) * 100 : 0;
                      return (
                        <div key={item.id} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="size-2.5 rounded-full bg-primary-500"></div>
                              <span className="text-sm font-medium text-gray-700">{item.category}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-800">
                              {Math.round(itemPercentage)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div 
                              className={`h-full ${
                                itemPercentage < 50 ? 'bg-green-500' : 
                                itemPercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(itemPercentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                    {budgetItems.length > 4 && (
                      <div className="pt-2 text-center text-sm text-primary-600 hover:text-primary-700">
                        +{budgetItems.length - 4} 個其他項目
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex h-40 items-center justify-center text-center">
                  <p className="text-gray-500">沒有預算資料可顯示</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleAddItem}
              className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-white transition-colors hover:bg-primary-700"
            >
              <BiPlus className="size-5" />
              <span>新增預算項目</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-gray-800">預算項目</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜尋預算項目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          </div>
          
          <div className="relative flex items-center">
            <BiFilter className="absolute left-3 size-4 text-gray-500" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-8 py-2 text-sm focus:border-primary-500 focus:outline-none"
            >
              <option value="all">全部週期</option>
              <option value="每月">每月</option>
              <option value="每季">每季</option>
              <option value="每年">每年</option>
              <option value="一次性">一次性</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="size-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-3.5 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-200"
          >
            <BiPlus className="size-4" />
            <span>新增項目</span>
          </button>
        </div>
      </div>
      
      {/* Budget Items Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map(item => (
          <BudgetCard
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
        
        {filteredItems.length === 0 && !isLoading && (
          <div className="col-span-full flex h-48 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <p className="mb-3 text-gray-500">
              {searchTerm || filterPeriod !== 'all' 
                ? '沒有符合條件的預算項目' 
                : '還沒有任何預算項目'}
            </p>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-3.5 py-2 text-sm font-medium text-primary-700 hover:bg-primary-200"
            >
              <BiPlus className="size-4" />
              <span>新增項目</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Budget Form Modal */}
      <BudgetForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveItem}
        editItem={editingItem}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

const QuickBudgetCalculator: React.FC = () => {
  const [budget, setBudget] = useState<string>('');
  const [totalSpent, setTotalSpent] = useState<string>('');
  const [currentSpent, setCurrentSpent] = useState<string>('');
  const [remaining, setRemaining] = useState<number>(0);
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const savedBudget = localStorage.getItem('budget') || '';
    const savedTotalSpent = localStorage.getItem('totalSpent') || '';
    const savedCurrentSpent = localStorage.getItem('currentSpent') || '';
    const savedCurrency = localStorage.getItem('currency');
    
    setBudget(savedBudget);
    setTotalSpent(savedTotalSpent);
    setCurrentSpent(savedCurrentSpent);
    if (savedCurrency) {
      setCurrency(JSON.parse(savedCurrency));
    }
  }, []);

  useEffect(() => {
    const budgetNum = parseFloat(budget) || 0;
    const totalSpentNum = parseFloat(totalSpent) || 0;
    const remainingNum = budgetNum - totalSpentNum;
    setRemaining(remainingNum);

    localStorage.setItem('budget', budget);
    localStorage.setItem('totalSpent', totalSpent);
    localStorage.setItem('currentSpent', currentSpent);
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [budget, totalSpent, currentSpent, currency]);

  const percentRemaining = budget ? Math.max(0, Math.min(100, (remaining / parseFloat(budget)) * 100)) : 0;

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleAddSpent = () => {
    if (currentSpent) {
      const newTotalSpent = (parseFloat(totalSpent) || 0) + (parseFloat(currentSpent) || 0);
      setTotalSpent(newTotalSpent.toFixed(2));
      setCurrentSpent('');
      localStorage.setItem('currentSpent', '');
    }
  };

  const handleReset = () => {
    setBudget('');
    setTotalSpent('');
    setCurrentSpent('');
    setRemaining(0);
    localStorage.removeItem('budget');
    localStorage.removeItem('totalSpent');
    localStorage.removeItem('currentSpent');
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = currencies.find(cur => cur.code === e.target.value);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };

  return (
    <div className="font-sans max-w-md mx-auto p-5">
      <div className="bg-green-600 p-4 text-center rounded-t-lg">
        <h2 className="text-2xl font-bold text-white">Quick Budget Calculator</h2>
      </div>
      
      <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select
            value={currency.code}
            onChange={handleCurrencyChange}
            className="w-full p-2 border rounded-md"
          >
            {currencies.map(cur => (
              <option key={cur.code} value={cur.code}>
                {cur.name} ({cur.symbol})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">{currency.symbol}</span>
            <input 
              type="text" 
              value={budget} 
              onChange={handleInputChange(setBudget)}
              className="w-full p-2 pl-7 border rounded-md"
              placeholder="Enter budget"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Spent so far</label>
          <div className="flex items-center">
            <div className="relative flex-grow">
              <span className="absolute left-3 top-2 text-gray-500">{currency.symbol}</span>
              <input 
                type="text" 
                value={currentSpent} 
                onChange={handleInputChange(setCurrentSpent)}
                className="w-full p-2 pl-7 border rounded-l-md"
                placeholder="Enter new expense"
              />
            </div>
            <button 
              onClick={handleAddSpent}
              className="p-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              +
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">{currency.symbol}</span>
            <input 
              type="text" 
              value={totalSpent} 
              readOnly
              className="w-full p-2 pl-7 border rounded-md bg-gray-100"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <div className="w-full h-10 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full" 
              style={{ width: `${percentRemaining}%` }}
            ></div>
          </div>
        </div>
        
        <p className="mt-2 text-center text-lg font-semibold text-gray-800">
          Remaining: {currency.symbol}{remaining.toFixed(2)} ({percentRemaining.toFixed(1)}%)
        </p>

        <div className="mt-6 text-center">
          <button 
            onClick={handleReset}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 inline-flex items-center"
          >
            <span className="mr-1">↻</span> Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBudgetCalculator;
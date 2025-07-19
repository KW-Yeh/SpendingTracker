'use client';

import { ReactNode, useState } from 'react';

interface Props {
  config: {
    tabName: string;
    template: ReactNode;
    icon?: ReactNode;
  }[];
}

export const TabSwitch = (props: Props) => {
  const { config } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  return (
    <div className="flex w-full flex-col items-center rounded-lg bg-white p-6 shadow-md sm:p-8">
      <div className="mb-6 flex w-full max-w-md items-center justify-center gap-2 rounded-lg bg-gray-100 p-1">
        {config.map((item, index) => (
          <button
            key={item.tabName}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              selectedIndex === index 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            }`}
          >
            {item.icon}
            {item.tabName}
          </button>
        ))}
      </div>
      
      <div className="w-full">
        {config[selectedIndex].template}
      </div>
    </div>
  );
};

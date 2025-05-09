'use client';

import { ReactNode, useState } from 'react';

interface Props {
  config: {
    tabName: string;
    template: ReactNode;
  }[];
}

export const TabSwitch = (props: Props) => {
  const { config } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="bg-background flex w-full flex-col items-center rounded-lg p-6 shadow sm:p-8">
      <div className="flex items-center">
        {config.map((config, index) => (
          <button
            key={config.tabName}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={`px-4 py-2 transition-colors first:rounded-l-lg last:rounded-r-lg ${selectedIndex === index ? 'bg-primary-500 text-background' : 'text-text bg-gray-100'}`}
          >
            {config.tabName}
          </button>
        ))}
      </div>
      {config[selectedIndex].template}
    </div>
  );
};

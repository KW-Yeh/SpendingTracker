import { HTMLAttributes, HTMLInputTypeAttribute } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type: HTMLInputTypeAttribute;
  name?: string;
}

export const InputBox = (props: Props) => {
  const { className = '', type, name, label, ...legacy } = props;
  return (
    <fieldset className="hover:border-primary-400 focus-within:border-primary-500 rounded-xl border border-solid border-gray-700 bg-gray-950 px-3 pb-2 transition-all duration-200">
      <legend className="px-2 text-sm font-medium text-gray-400">
        {label}
      </legend>
      <input
        type={type}
        name={name}
        {...legacy}
        className={`min-h-11 w-full bg-transparent px-2 py-1 text-gray-100 placeholder:text-gray-500 focus:outline-0 ${className}`}
      />
    </fieldset>
  );
};

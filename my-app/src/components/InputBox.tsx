import { HTMLAttributes, HTMLInputTypeAttribute } from 'react';

interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type: HTMLInputTypeAttribute;
  name?: string;
}

export const InputBox = (props: Props) => {
  const { className = '', type, name, label, ...legacy } = props;
  return (
    <fieldset className="hover:border-primary-300 focus-within:border-primary-500 focus-within:shadow-warm rounded-xl border-2 border-solid border-gray-300 bg-white px-3 pb-2 transition-all duration-200">
      <legend className="px-2 text-sm font-medium text-gray-700">
        {label}
      </legend>
      <input
        type={type}
        name={name}
        {...legacy}
        className={`min-h-11 w-full bg-transparent px-2 py-1 text-gray-900 placeholder:text-gray-300 focus:outline-0 ${className}`}
      />
    </fieldset>
  );
};

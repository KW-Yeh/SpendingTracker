import { HTMLAttributes, HTMLInputTypeAttribute } from "react";

interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type: HTMLInputTypeAttribute;
  name?: string;
}

export const InputBox = (props: Props) => {
  const { className = "", type, name, label, ...legacy } = props;
  return (
    <fieldset className="rounded-xl border-2 pb-2 px-3 border-solid border-gray-300 bg-white transition-all duration-200 hover:border-primary-300 focus-within:border-primary-500 focus-within:shadow-warm">
      <legend className="px-2 text-sm font-medium text-gray-700">{label}</legend>
      <input
        type={type}
        name={name}
        {...legacy}
        className={`bg-transparent px-2 py-1 focus:outline-0 w-full text-gray-900 placeholder:text-gray-300 min-h-[44px] ${className}`}
      />
    </fieldset>
  );
};

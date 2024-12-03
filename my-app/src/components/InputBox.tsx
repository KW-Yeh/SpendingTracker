import { HTMLAttributes, HTMLInputTypeAttribute } from "react";

interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  type: HTMLInputTypeAttribute;
  name?: string;
}

export const InputBox = (props: Props) => {
  const { className = "", type, name, label, ...legacy } = props;
  return (
    <fieldset className="rounded-lg border pb-1 px-2 border-solid border-text bg-background">
      <legend className="px-2 bg-background">{label}</legend>
      <input
        type={type}
        name={name}
        {...legacy}
        className={`bg-transparent px-2 focus:outline-0 w-full ${className}`}
      />
    </fieldset>
  );
};

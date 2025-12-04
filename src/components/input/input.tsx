import { useState } from "react";

type InputProps = {
  onSubmit: (value: string) => void;
};

export const Input = ({ onSubmit }: InputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input) return;

    onSubmit(input);

    setInput("");
  };

  return (
    <div className="flex gap-2.5">
      <input
        className="border-2 border-gray-300 rounded-[10px] p-2.5"
        type="text"
        maxLength={20}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="border-none rounded-[10px] py-2.5 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Add
      </button>
    </div>
  );
};

import React from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/outline";

const CounterComponent = () => {
  const [count, setCount] = React.useState(2);
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={() => setCount(count - 1)}
        type="button"
        className="transition-all duration-200 transform active:scale-105"
      >
        <MinusIcon className="w-4 h-4" />
      </button>
      <span className="text-[1.25rem] font-semibold text-white">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        type="button"
        className="transition-all duration-200 transform active:scale-105"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CounterComponent;

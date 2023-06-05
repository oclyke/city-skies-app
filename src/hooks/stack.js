import {
  useState,
} from "react";

class Stack extends Array {
  at(depth) {
    return this.slice(-(1 + depth))[0];
  }

  get depth () {
    return this.length;
  }
}

export function useStack(initial) {
  const [stack, setStack] = useState(() => (Stack.from(initial)));

  function push(value) {
    stack.push(value)
    setStack(Stack.from(stack));
  }

  function pop() {
    const value = stack.pop();
    setStack(Stack.from(stack));
    return value;
  }

  return {
    stack,
    ops: {
      push,
      pop,
    }
  }
}

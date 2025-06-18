import React, { useState } from 'react';
import { Pressable, PressableProps } from 'react-native';
import { clsx } from 'clsx';

type ButtonProps = PressableProps & {
  className?: string;
  children: React.ReactNode;
};

export default function Button({ className, children, ...props }: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      {...props}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      className={clsx(
        'rounded-xl items-center justify-center',
        pressed ? 'bg-[#c1ff72]' : '',
        className
      )}
    >
      {children}
    </Pressable>
  );
}

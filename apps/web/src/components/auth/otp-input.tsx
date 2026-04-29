'use client';

import { useRef } from 'react';

export default function OtpInput({ length = 6 }: { length?: number }) {
  const inputs = Array.from({ length });
  const refs = useRef<HTMLInputElement[]>([]);

  return (
    <div className="flex gap-2">
      {inputs.map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            if (el) refs.current[index] = el;
          }}
          maxLength={1}
          className="h-12 w-12 rounded-xl border border-bazar-border text-center text-lg"
          onChange={(event) => {
            if (event.target.value && refs.current[index + 1]) {
              refs.current[index + 1].focus();
            }
          }}
        />
      ))}
    </div>
  );
}

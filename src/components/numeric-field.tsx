import { useState } from 'react';

import { TextField, type TextFieldProps } from '@/components/text-field';

export type NumericFieldProps = Omit<TextFieldProps, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: number | undefined;
  onChangeNumber: (value: number | undefined) => void;
};

/**
 * Bridges a numeric RHF field to RN's string-based TextInput: keeps the
 * field's value as `number | undefined` everywhere else (schema, defaults,
 * submit payload) and only deals in strings at the edge of this component.
 *
 * Keeps its own `text` state instead of deriving the displayed string
 * straight from `value` on every render, so a mid-edit render with a
 * momentarily-stale `value` prop never stomps what the user just typed.
 * `prevValue` mirrors the *prop* from the previous render (not anything
 * this field reports up), so the resync only fires when `value` genuinely
 * changes for an external reason (e.g. a "recalculate suggestion" button)
 * rather than on this field's own keystrokes.
 */
export function NumericField({ value, onChangeNumber, ...rest }: NumericFieldProps) {
  const [text, setText] = useState(value === undefined ? '' : String(value));
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setText(value === undefined ? '' : String(value));
  }

  return (
    <TextField
      keyboardType="decimal-pad"
      value={text}
      onChangeText={(rawText) => {
        setText(rawText);
        const normalized = rawText.replace(',', '.');
        const nextValue = normalized === '' || Number.isNaN(Number(normalized)) ? undefined : Number(normalized);
        onChangeNumber(nextValue);
      }}
      {...rest}
    />
  );
}

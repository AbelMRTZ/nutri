import { TextField, type TextFieldProps } from '@/components/text-field';

export type NumericFieldProps = Omit<TextFieldProps, 'value' | 'onChangeText' | 'keyboardType'> & {
  value: number | undefined;
  onChangeNumber: (value: number | undefined) => void;
};

/**
 * Bridges a numeric RHF field to RN's string-based TextInput: keeps the
 * field's value as `number | undefined` everywhere else (schema, defaults,
 * submit payload) and only deals in strings at the edge of this component.
 */
export function NumericField({ value, onChangeNumber, ...rest }: NumericFieldProps) {
  return (
    <TextField
      keyboardType="decimal-pad"
      value={value === undefined ? '' : String(value)}
      onChangeText={(text) => {
        const normalized = text.replace(',', '.');
        if (normalized === '') {
          onChangeNumber(undefined);
          return;
        }
        const parsed = Number(normalized);
        onChangeNumber(Number.isNaN(parsed) ? undefined : parsed);
      }}
      {...rest}
    />
  );
}

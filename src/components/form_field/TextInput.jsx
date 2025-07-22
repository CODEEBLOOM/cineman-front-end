import { TextField } from '@mui/material';

const TextInput = ({
  onChange,
  value = '',
  name,
  type = 'text',
  placeHolder = '',
  error = false,
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <TextField
        fullWidth
        placeholder={placeHolder}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        required={required}
        slotProps={{
          input: { className: 'h-10 px-3 py-2 ' },
          htmlInput: { className: '!px-0' },
        }}
        error={!!error}
        disabled={disabled}
      />
    </div>
  );
};
export default TextInput;

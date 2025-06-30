import { TextField } from '@mui/material';

const TextAreaInput = ({
  onChange,
  value = '',
  name,
  placeHolder = '',
  error = false,
  required = false,
  ...rest
}) => {
  return (
    <div>
      <TextField
        fullWidth
        placeholder={placeHolder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        multiline={true}
        rows={rest.rows}
        rowsmax={rest.rowsmax}
        error={!!error}
      />
    </div>
  );
};
export default TextAreaInput;

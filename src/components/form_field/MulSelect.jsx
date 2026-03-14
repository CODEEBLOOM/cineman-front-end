import { Box, MenuItem, TextField } from '@mui/material';

const MulSelect = ({
  onChange,
  value = '',
  name,
  type = 'text',
  placeHolder = '',
  error = false,
  options,
  disabled,
}) => {
  const safeValue = Array.isArray(value) ? value : [];
  return (
    <Box className="min-w-[150px] !overflow-hidden">
      <TextField
        name={name}
        label=""
        fullWidth
        type={type}
        value={safeValue}
        onChange={(e) => {
          // MUI trả về array khi multiple
          const val = e.target.value;
          const next = Array.isArray(val) ? val : (val ?? '').split(',');
          onChange?.(next);
        }}
        select
        size="small"
        error={!!error}
        SelectProps={{ multiple: true }}
        disabled={disabled}
      >
        <MenuItem disabled value="">
          <p>{placeHolder}</p>
        </MenuItem>
        {(options || []).map((option) => (
          <MenuItem key={option.value} value={option?.value}>
            {option?.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};
export default MulSelect;

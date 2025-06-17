import { Box, MenuItem, Select, TextField } from '@mui/material';

const CustomSelect = ({
  onChange,
  value = '',
  name,
  type = 'text',
  placeHolder = '',
  error = false,
  options,
}) => {
  return (
    <Box width="250px">
      <TextField
        name={name}
        label=""
        fullWidth
        type={type}
        value={value}
        onChange={onChange}
        select
        size="small"
        error={!!error}
        SelectProps={{ displayEmpty: true }}
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
export default CustomSelect;

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
        onChange={(event) => {
          const nextValue = event.target.value;
          const nextSelection = Array.isArray(nextValue)
            ? nextValue
            : String(nextValue ?? '')
                .split(',')
                .filter(Boolean);

          onChange?.(nextSelection);
        }}
        select
        size="small"
        error={!!error}
        SelectProps={{
          multiple: true,
          displayEmpty: true,
          renderValue: (selected) => {
            const selectedValues = Array.isArray(selected) ? selected : [];

            if (selectedValues.length === 0) {
              return <span className="text-slate-400">{placeHolder}</span>;
            }

            return selectedValues
              .map(
                (selectedValue) =>
                  options?.find(
                    (option) => String(option?.value) === String(selectedValue)
                  )?.label ?? selectedValue
              )
              .join(', ');
          },
        }}
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

import { FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormField = ({
  control,
  label,
  name,
  type,
  placeHolder,
  error,
  Component,
  ...rest
}) => {
  return (
    <div className="mb-3">
      <p className="text-small text-dark-100 mb-1 font-bold">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value}
              name={name}
              type={type}
              placeHolder={placeHolder}
              control={control}
              error={error}
              {...rest}
            />
          );
        }}
      />
      {error && <FormHelperText error={true}>{error.message}</FormHelperText>}
    </div>
  );
};
export default FormField;

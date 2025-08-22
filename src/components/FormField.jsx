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
  require = false,
  ...rest
}) => {
  return (
    <div className="mb-3">
      <p className="text-small text-dark-100 mb-1 font-medium">
        {require && <span className={'text-red-600'}>*&nbsp;</span>}
        {label}
      </p>
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
              require={require}
              {...rest}
            />
          );
        }}
      />
      {error && (
        <FormHelperText error={true} className="!text-[14px]">
          {error.message}
        </FormHelperText>
      )}
    </div>
  );
};
export default FormField;

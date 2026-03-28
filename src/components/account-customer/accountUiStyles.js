export const accountFieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: 52,
    borderRadius: '14px',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 18px rgba(15,23,42,0.07)',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#cbd5e1',
      borderWidth: '1px',
    },
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused': {
      boxShadow: '0 10px 22px rgba(35,72,108,0.14)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#23486c',
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-input': {
      fontSize: '16px',
      color: '#1e293b',
      py: '14px',
    },
    '& .MuiSelect-select': {
      fontSize: '16px',
      color: '#1e293b',
      py: '14px',
    },
  },
  '& .MuiFormHelperText-root': {
    mt: 0.75,
    ml: 0,
    fontSize: '13px',
  },
};

export const accountPrimaryButtonSx = {
  minHeight: 48,
  borderRadius: '14px',
  px: 4,
  py: 1.25,
  backgroundColor: '#cf6d05',
  fontSize: '16px',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 10px 22px rgba(207,109,5,0.22)',
  '&:hover': {
    backgroundColor: '#b95e00',
    boxShadow: '0 12px 24px rgba(185,94,0,0.26)',
  },
};

export const accountSecondaryButtonSx = {
  minHeight: 48,
  borderRadius: '14px',
  px: 3.5,
  py: 1.25,
  borderColor: '#cbd5e1',
  color: '#475569',
  fontSize: '15px',
  fontWeight: 700,
  textTransform: 'none',
  backgroundColor: '#fff',
  '&:hover': {
    borderColor: '#94a3b8',
    backgroundColor: '#f8fafc',
  },
};

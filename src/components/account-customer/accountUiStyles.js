export const accountPrimaryButtonSx = {
  minWidth: 152,
  borderRadius: '999px',
  px: 3,
  py: 1.15,
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
  color: '#0f172a',
  background: 'linear-gradient(135deg, #f5d97b 0%, #d7a94b 100%)',
  boxShadow: '0 14px 32px rgba(215, 169, 75, 0.28)',
  '&:hover': {
    background: 'linear-gradient(135deg, #f7df8d 0%, #cd9731 100%)',
    boxShadow: '0 18px 36px rgba(205, 151, 49, 0.34)',
  },
  '&:disabled': {
    color: 'rgba(15, 23, 42, 0.45)',
    background: '#e2e8f0',
    boxShadow: 'none',
  },
};

export const accountSecondaryButtonSx = {
  minWidth: 140,
  borderRadius: '999px',
  px: 3,
  py: 1.05,
  textTransform: 'none',
  fontSize: '0.95rem',
  fontWeight: 700,
  letterSpacing: '0.01em',
  color: '#0f3a4f',
  borderColor: 'rgba(12, 64, 86, 0.18)',
  backgroundColor: '#f8fafc',
  boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
  '&:hover': {
    borderColor: 'rgba(12, 64, 86, 0.32)',
    backgroundColor: '#eef6fb',
    boxShadow: '0 14px 28px rgba(15, 23, 42, 0.08)',
  },
};

export const accountFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    backgroundColor: 'rgba(248, 250, 252, 0.92)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(12, 64, 86, 0.4)',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(56, 189, 248, 0.12)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0c4056',
    },
  },
  '& .MuiInputBase-input': {
    py: 1.55,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#0c4056',
  },
  '& .MuiFormHelperText-root': {
    mx: 0.5,
    mt: 1,
  },
};

export const accountFieldFlatSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    backgroundColor: '#f3f4f6',
    transition: 'background-color 0.2s ease, border-color 0.2s ease',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#cbd5e1',
    },
    '&.Mui-focused': {
      backgroundColor: '#ffffff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1f5fa0',
      borderWidth: '1px',
    },
    '&.Mui-disabled': {
      backgroundColor: '#eef2f7',
    },
  },
  '& .MuiInputBase-input': {
    py: 1.4,
    fontSize: '14px',
    color: '#1f2937',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1,
    },
  },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#6b7280',
  },
  '& .MuiFormHelperText-root': {
    mx: 0.25,
    mt: 0.5,
    fontSize: '12px',
    minHeight: '16px',
  },
  '& .MuiSvgIcon-root': {
    color: '#9ca3af',
  },
};

export const accountUpdateButtonSx = {
  minWidth: 200,
  borderRadius: '6px',
  px: 5,
  py: 1.35,
  textTransform: 'uppercase',
  fontSize: '0.95rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  color: '#ffffff',
  background: 'linear-gradient(180deg, #2c6cb0 0%, #1f5fa0 100%)',
  boxShadow: '0 10px 22px rgba(31, 95, 160, 0.25)',
  '&:hover': {
    background: 'linear-gradient(180deg, #2f74bd 0%, #1d588f 100%)',
    boxShadow: '0 14px 28px rgba(31, 95, 160, 0.32)',
  },
  '&:disabled': {
    color: 'rgba(255, 255, 255, 0.75)',
    background: '#9bb6d3',
    boxShadow: 'none',
  },
};

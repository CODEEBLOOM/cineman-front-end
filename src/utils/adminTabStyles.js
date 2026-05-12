export const adminTabsSx = {
  minHeight: { xs: 46, md: 54 },
  borderBottom: '1px solid rgba(203,213,225,0.8)',
  '.MuiTabs-flexContainer': {
    gap: { xs: 0.5, md: 1.5 },
    flexWrap: { xs: 'wrap', md: 'nowrap' },
  },
  '.MuiTabs-indicator': {
    height: 3,
    borderRadius: 999,
    backgroundColor: '#0a4d9c',
  },
};

export const adminTabSx = {
  minHeight: { xs: 46, md: 54 },
  minWidth: 'auto',
  px: { xs: 1.25, md: 1.75 },
  py: 0.5,
  color: '#334155',
  fontSize: { xs: '13px', md: '14px' },
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  transition: 'all 0.2s ease',
  '&.Mui-selected': {
    color: '#083d7c',
  },
  '&:hover': {
    color: '#083d7c',
    backgroundColor: 'transparent',
  },
};

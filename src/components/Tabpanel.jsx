import { Box } from '@mui/material';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3, maxWidth: '100%', overflow: 'auto' }}>{children}</Box>
      )}
    </div>
  );
};
export default TabPanel;

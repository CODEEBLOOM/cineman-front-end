import FormInfoUser from '@component/account-customer/FormInfoUser';
import MembershipCard from '@component/account-customer/MembershipCard';
import TransactionHistory from '@component/account-customer/TransactionHistory';
import UploadAvatar from '@component/account-customer/UploadAvatar';
import VoucherCustomer from '@component/account-customer/VoucherCustomer';
import TabPanel from '@component/Tabpanel';
import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const MyAccount = () => {
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state) => state.user);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const tabActive = () => {
    const tab = searchParams.get('tab');
    if (tab) {
      switch (tab) {
        case 'profile':
          return 0;
        case 'membership':
          return 1;
        case 'transaction':
          return 2;
        case 'voucher':
          return 3;
        default:
          return 0;
      }
    }
  };
  const [activeTab, setActiveTab] = useState(tabActive());
  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className="bg-[rgba(237,237,240,0.8)] py-6">
      <div className="container min-h-[500px] rounded-sm bg-white px-4 py-5 shadow-sm">
        <Box sx={{ width: '100%' }}>
          <Box>
            <Tabs
              value={activeTab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
              sx={{
                '.MuiTabs-flexContainer': {
                  justifyContent: 'start',
                  overflowX: 'auto',
                },
              }}
            >
              <Tab label="Thông tin tài khoản" {...a11yProps(0)} />
              <Tab label="Thẻ thành viên" {...a11yProps(1)} />
              <Tab label="Lịch sử giao dịch" {...a11yProps(2)} />
              <Tab label="Voucher của tôi" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={activeTab} index={0}>
              <h1 className="mb-3 text-[18px] font-medium uppercase text-primary underline">
                Thông tin tài khoản
              </h1>
              <UploadAvatar setAvatar={setAvatar} avatar={avatar} />
              <FormInfoUser avatar={avatar} />
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <MembershipCard />
            </TabPanel>
            <TabPanel value={activeTab} index={2}>
              <TransactionHistory />
            </TabPanel>
            <TabPanel value={activeTab} index={3}>
              <VoucherCustomer />
            </TabPanel>
          </Box>
        </Box>
      </div>
    </div>
  );
};
export default MyAccount;

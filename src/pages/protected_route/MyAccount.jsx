import FormInfoUser from '@component/account-customer/FormInfoUser';
import MembershipCard from '@component/account-customer/MembershipCard';
import TransactionHistory from '@component/account-customer/TransactionHistory';
import VoucherCustomer from '@component/account-customer/VoucherCustomer';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const ACCOUNT_TABS = [
  { key: 'profile', label: 'Thông tin tài khoản' },
  { key: 'membership', label: 'Thẻ thành viên' },
  { key: 'transaction', label: 'Lịch sử giao dịch' },
  { key: 'voucher', label: 'Voucher của tôi' },
];

const resolveTabKey = (tab) =>
  ACCOUNT_TABS.some((item) => item.key === tab) ? tab : 'profile';

const panelAnimation = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.28, ease: 'easeOut' },
};

const MyAccount = () => {
  const { user } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [activeTab, setActiveTab] = useState(() =>
    resolveTabKey(searchParams.get('tab'))
  );

  useEffect(() => {
    document.title = 'Quản lý tài khoản - POLY CINEMAS';
  }, []);

  useEffect(() => {
    setAvatar(user?.avatar || '');
  }, [user?.avatar]);

  useEffect(() => {
    setActiveTab(resolveTabKey(searchParams.get('tab')));
  }, [searchParams]);

  const handleChangeTab = (tabKey) => {
    setActiveTab(tabKey);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tabKey);
    setSearchParams(nextParams, { replace: true });
  };

  const activeContent = useMemo(() => {
    switch (activeTab) {
      case 'membership':
        return <MembershipCard />;
      case 'transaction':
        return <TransactionHistory />;
      case 'voucher':
        return <VoucherCustomer />;
      case 'profile':
      default:
        return <FormInfoUser avatar={avatar} onAvatarChange={setAvatar} />;
    }
  }, [activeTab, avatar]);

  return (
    <div className="container py-5 md:py-8">
      <div className="border-b border-slate-200">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {ACCOUNT_TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleChangeTab(tab.key)}
                className={`relative pb-3 text-left text-[14px] font-semibold uppercase tracking-[0.02em] transition md:text-[15px] ${
                  isActive
                    ? 'text-[#083d7c]'
                    : 'text-slate-600 hover:text-[#083d7c]'
                }`}
              >
                {tab.label}
                <span
                  className={`absolute -bottom-px left-0 h-[3px] rounded-full bg-[#0a4d9c] transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-10 opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-5 md:pt-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} {...panelAnimation}>
            {activeContent}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyAccount;

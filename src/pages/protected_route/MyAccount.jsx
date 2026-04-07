import FormInfoUser from '@component/account-customer/FormInfoUser';
import MembershipCard from '@component/account-customer/MembershipCard';
import TransactionHistory from '@component/account-customer/TransactionHistory';
import UploadAvatar from '@component/account-customer/UploadAvatar';
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
        return (
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start xl:grid-cols-[260px_minmax(0,1fr)]">
            <div className="rounded-[16px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
              <UploadAvatar setAvatar={setAvatar} avatar={avatar} />
            </div>
            <div className="rounded-[16px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.08)]">
              <FormInfoUser avatar={avatar} />
            </div>
          </div>
        );
    }
  }, [activeTab, avatar]);

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2f7_55%,#e8edf5_100%)] py-5 md:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_62%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-28 h-72 w-72 rounded-full bg-[rgba(148,163,184,0.12)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-100px] h-64 w-64 rounded-full bg-[rgba(148,163,184,0.14)] blur-3xl" />

      <div className="container relative">
        <div className="overflow-hidden rounded-[16px] border border-white/60 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.14)] backdrop-blur">
          <div className="border-b border-slate-200/90 px-5 pt-4 md:px-8 md:pt-5">
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
                    className={`relative pb-4 text-left text-[14px] font-semibold uppercase tracking-[0.02em] transition md:text-[15px] ${
                      isActive
                        ? 'text-[#23486c]'
                        : 'text-slate-700 hover:text-[#23486c]'
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[#2d5f8d] transition-all duration-300 ${
                        isActive ? 'w-full opacity-100' : 'w-10 opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-5 pt-5 md:px-8 md:pb-7 md:pt-6">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} {...panelAnimation}>
                {activeContent}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;

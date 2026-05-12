import ShowTimeAutoFillPanel from '@component/admin/showtimes/ShowTimeAutoFillPanel';
import ShowTimeListPanel from '@component/admin/showtimes/ShowTimeListPanel';
import ShowTimeSchedulerPanel from '@component/admin/showtimes/ShowTimeSchedulerPanel';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import { Box, Tab, Tabs } from '@mui/material';
import { adminTabSx, adminTabsSx } from '@utils/adminTabStyles';
import { useEffect, useState } from 'react';

const tabProps = (index) => ({
  id: `showtime-tab-${index}`,
  'aria-controls': `showtime-panel-${index}`,
});

const ShowTimePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [listPreset, setListPreset] = useState({
    movieTheaterId: '',
    showDate: '',
    showTimeStatus: '',
    special: '',
  });
  const [listPanelKey, setListPanelKey] = useState(0);

  useEffect(() => {
    document.title = 'Quản lý suất chiếu - POLY CINEMAS';
  }, []);

  const handleAutoFillSuccess = (nextFilters) => {
    setListPreset({
      movieTheaterId: nextFilters?.movieTheaterId ?? '',
      showDate: nextFilters?.showDate ?? '',
      showTimeStatus: nextFilters?.showTimeStatus ?? '',
      special: nextFilters?.special ?? '',
    });
    setListPanelKey((currentValue) => currentValue + 1);
    setActiveTab(2);
  };

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Quản lý suất chiếu',
          },
        ]}
        title="Quản lý suất chiếu"
      />

      <div className="mx-5 mt-3 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                Tạo nhanh bằng auto-fill, kiểm tra lại ở danh sách hoặc timeline
              </h1>
            </div>
          </div>

          <Box sx={{ mt: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              sx={adminTabsSx}
            >
              <Tab label="Tạo tự động" sx={adminTabSx} {...tabProps(0)} />
              <Tab label="Lập lịch" sx={adminTabSx} {...tabProps(1)} />
              <Tab
                label="Danh sách / Bộ lọc"
                sx={adminTabSx}
                {...tabProps(2)}
              />
            </Tabs>
          </Box>
        </div>

        <div
          id="showtime-panel-0"
          role="tabpanel"
          hidden={activeTab !== 0}
          aria-labelledby="showtime-tab-0"
        >
          {activeTab === 0 ? (
            <ShowTimeAutoFillPanel onSuccess={handleAutoFillSuccess} />
          ) : null}
        </div>

        <div
          id="showtime-panel-1"
          role="tabpanel"
          hidden={activeTab !== 1}
          aria-labelledby="showtime-tab-1"
        >
          {activeTab === 1 ? <ShowTimeSchedulerPanel /> : null}
        </div>

        <div
          id="showtime-panel-2"
          role="tabpanel"
          hidden={activeTab !== 2}
          aria-labelledby="showtime-tab-2"
        >
          {activeTab === 2 ? (
            <ShowTimeListPanel
              key={listPanelKey}
              initialFilters={listPreset}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ShowTimePage;

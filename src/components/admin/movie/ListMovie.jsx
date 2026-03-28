import CustomBreadcrumb from '@component/CustomBreakcrumb';
import TabPanel from '@component/Tabpanel';
import { Box, Tab, Tabs } from '@mui/material';
import { adminTabSx, adminTabsSx } from '@utils/adminTabStyles';
import { useState } from 'react';
import FormMovie from './FormMovie';
import MovieTable from './MovieTable';

const ListMovie = () => {
  const [value, setValue] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý bộ phim', href: '/admin/danh-sach-phim' }]}
        title="Quản lý bộ phim"
      />
      <div className="mx-5 mt-3 grid overflow-auto">
        <div className="rounded-sm bg-white px-4 py-3">
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="Quản lý bộ phim"
              sx={adminTabsSx}
            >
              <Tab sx={adminTabSx} label="Thêm bộ phim" {...a11yProps(0)} />
              <Tab sx={adminTabSx} label="Danh sách" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <h2 className="mb-3 border-b-2 pb-2 font-semibold capitalize">
              Thông tin bộ phim
            </h2>
            <FormMovie
              setEditingMovie={setEditingMovie}
              editingMovie={editingMovie}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MovieTable
              setValue={setValue}
              setIsEdit={setIsEdit}
              setEditingMovie={setEditingMovie}
            />
          </TabPanel>
        </div>
      </div>
    </div>
  );
};

export default ListMovie;

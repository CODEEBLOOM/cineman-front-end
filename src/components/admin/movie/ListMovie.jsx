import FormMovie from './FormMovie';
import { useState } from 'react';
import TabPanel from '@component/Tabpanel';
import { Box, Tab, Tabs } from '@mui/material';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import MovieTable from './MovieTable';

const ListMovie = () => {
  const [value, setValue] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý bộ phim', href: '/admin/danh-sach-phim' }]}
        title="Quản lý bộ phim"
      />
      <div className="mx-5 mt-3 grid overflow-auto">
        <div className="rounded-sm bg-white px-4 py-3">
          <Box sx={{ borderBottom: '2px solid lightGray' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                  },
                }}
                label="Thêm bộ phim"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                  },
                }}
                label="Danh sách"
                {...a11yProps(1)}
              />
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

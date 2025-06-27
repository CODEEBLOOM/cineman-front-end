import { useEffect, useState } from 'react';
import { Badge, Box, Button, Switch, Tab, Tabs } from '@mui/material';
import TabPanel from '@component/Tabpanel.jsx';
import './seatMapComponent.scss';
import { useModelContext } from '@context/ModalContext';
import { IoClose } from 'react-icons/io5';
import TextInput from '@component/form_field/TextInput';
import { useForm } from 'react-hook-form';
import FormField from '@component/FormField';
import TextAreaInput from '@component/form_field/TextAreaInput';
import CustomSelect from '@component/form_field/CustomSelect';
import { DataGrid } from '@mui/x-data-grid';

import { findAll } from '@apis/seatMapService';
import { update } from '@apis/seatMapService.js';

const SeatMapComponent = () => {
  const [tab, setTab] = useState(0);
  const { openPopup, setIsShowing } = useModelContext();
  const [seatMaps, setSeatMaps] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  /* Get data */
  const fetchSeatMaps = async ({ page, size, status = null }) => {
    const res = await findAll({
      page,
      size,
      status,
    });
    console.log(res);
    setSeatMaps(res?.data?.seatMapEntity);
    setTotalCount(res.data?.meta?.totalElements);
    setPaginationModel({
      page: res.data?.meta?.currentPage,
      pageSize: res.data?.meta.pageSize,
    });
  };

  useEffect(() => {
    fetchSeatMaps({
      page: paginationModel.page,
      size: paginationModel.pageSize,
    });
  }, []);

  /*Change tab*/
  const handleChangeTab = (event, newValue) => {
    const status = newValue < 1 ? null : newValue === 1;
    setTab(newValue);
    fetchSeatMaps({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      status,
    });
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  /*Xử lý create */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleCreate = (data) => {};

  /* Table */
  const columns = [
    { headerName: '#', field: 'id' },
    { headerName: 'Tên sơ đồ', field: 'name', flex: 1 },
    { headerName: 'Mô tả', field: 'description', flex: 2 },
    { headerName: 'Ma trận ghế', field: 'numberOfRows' },
    {
      headerName: 'Trạng thái',
      field: 'status',
      flex: 1,
      renderCell: (params) => (
        <span
          className={`rounded-lg p-2 capitalize ${params.value === 'NHAP' ? 'bg-yellow-100 text-yellow-500' : 'bg-[#b7e9e0] text-[#0bb392]'}`}
        >
          {params.value === 'XUAT_BAN' ? 'Xuất bản' : 'Nháp'}
        </span>
      ),
    },
    {
      headerName: 'Hoạt động',
      field: 'action',
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.status === 'XUAT_BAN'}
          onChange={(event) => handleChangeStatus(event, params.row)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      ),
    },
  ];

  const handleChangeStatus = async (event, value) => {
    const status = event.target.checked;
    const tabActive = tab < 1 ? null : tab === 1;
    const updateSeatMap = { ...value, status };
    await update({ id: value.id, data: updateSeatMap });
    await fetchSeatMaps({
      page: paginationModel.page,
      size: paginationModel.pageSize,
      status: tabActive,
    });
  };

  /* Handle change page */
  const handlePageChange = (newModel) => {
    const status = tab < 1 ? null : tab === 1;
    fetchSeatMaps({ page: newModel.page, size: newModel.pageSize, status });
  };

  const dataSelect = [
    { label: '14x14 - Sức chứa 196 chỗ ngồi', value: 14 },
    { label: '10x10 - Sức chứa 100 chỗ ngồi', value: 10 },
  ];

  const renderPopup = () => {
    return (
      <div className="relative max-h-screen w-[80vw] rounded-lg bg-white p-5 md:w-[50vw]">
        <span
          className={'absolute right-3 top-3 hover:cursor-pointer'}
          onClick={() => setIsShowing(false)}
        >
          <IoClose size={25} />
        </span>
        <div className="border-b-2 pb-2">
          <h2 className="text-[20px]">Thêm mới mẫu sơ đồ ghế</h2>
        </div>
        <div className="mt-2">
          <form onSubmit={() => handleSubmit(handleCreate)}>
            <FormField
              name="name"
              label="Tên mẫu"
              control={control}
              Component={TextInput}
              type="text"
              require={true}
              placeHolder="Tên mẫu"
            />
            <FormField
              name="matran"
              label="Ma trận ghế"
              control={control}
              Component={CustomSelect}
              type="text"
              require={true}
              options={dataSelect}
              placeHolder="Ma trận ghế"
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                name="regularSeatRow"
                label="Hàng ghế thường"
                control={control}
                Component={TextInput}
                type="number"
                require={true}
                placeHolder="số ghế thường"
              />
              <FormField
                name="vipSeatRow"
                label="Hàng ghế vip"
                control={control}
                Component={TextInput}
                type="number"
                require={true}
                placeHolder="số ghế thường"
              />
              <FormField
                name="doubleSeatRow"
                label="Hàng ghế đôi"
                control={control}
                Component={TextInput}
                type="number"
                require={true}
                placeHolder="số ghế đôi"
              />
            </div>
            <FormField
              name="doubleSeatRow"
              label="Mô tả"
              control={control}
              Component={TextAreaInput}
              type="text"
              placeHolder="Mô tả"
              multiline={true}
              rows={4}
              rowsMax={10}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outlined">Làm mới</Button>
              <Button variant="contained">Thêm mới</Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-10">
      {/* <div className={'flex items-center justify-between bg-white px-5 py-2'}>
        <h2>Quản lý sơ đồ ghế</h2>
        <Breadcrumb current={'Cập nhật'} />
      </div> */}
      <div className={'rounded-sm bg-white p-3'}>
        <div className={'flex items-center justify-between'}>
          <h1 className={'text-[1.2rem]'}>Danh sách mẫu sơ đồ ghế</h1>
          <Button
            variant={'contained'}
            className={'bg-primary'}
            onClick={() => openPopup(renderPopup())}
          >
            Thêm mới
          </Button>
        </div>
        {/*  Phần chính */}

        <Box className="max-h-auto">
          <Box sx={{ borderBottom: '2px solid lightGray' }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginLeft: '16px',
                  },
                }}
                icon={<Badge badgeContent={4} color="warning" />}
                iconPosition={'end'}
                label="tất cả"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginLeft: '16px',
                  },
                }}
                icon={<Badge badgeContent={4} color="success" />}
                iconPosition={'end'}
                label="Đã xuất bản"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  '&.MuiButtonBase-root': {
                    padding: '16px',
                  },
                  '& .MuiTab-iconWrapper': {
                    marginLeft: '16px',
                  },
                }}
                icon={<Badge badgeContent={4} color="info" />}
                iconPosition={'end'}
                label="Bản nháp"
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={tab} index={tab}>
            <div className="w-full overflow-x-auto">
              <DataGrid
                rows={seatMaps}
                columns={columns}
                initialState={{
                  pagination: { paginationModel },
                }}
                rowCount={totalCount}
                pageSizeOptions={[5, 10, 30, 50, 100]}
                checkboxSelection={false}
                paginationMode="server"
                onPaginationModelChange={handlePageChange}
              />
            </div>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default SeatMapComponent;

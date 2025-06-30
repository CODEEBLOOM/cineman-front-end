import { Box, Tabs, Tab, Badge } from '@mui/material';
import TabPanel from '@component/Tabpanel.jsx';
import { DataGrid } from '@mui/x-data-grid';
import { useModelContext } from '@context/ModalContext';
import ModalCreateSeatMap from './ModalCreateCinemaTheater';
import { MdDeleteForever } from 'react-icons/md';
import { deleteCinemaTheater } from '@apis/cinemaTheaterService';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaSitemap } from 'react-icons/fa';
const CinemaTheaterTable = ({
  tab,
  setTab,
  fetchCinemaTheaters,
  paginationModel,
  cinemaTheaters,
  totalCount,
}) => {
  const { openPopup } = useModelContext();

  /* Handle change page */
  const handlePageChange = (newModel) => {
    const status = tab < 1 ? null : tab > 1 ? 'DRAFT' : 'PUBLISHED';
    fetchCinemaTheaters({
      page: newModel.page,
      size: newModel.pageSize,
      status,
    });
  };
  /*Change tab*/
  const handleChangeTab = (event, newValue) => {
    const status = newValue < 1 ? null : newValue > 1 ? 'DRAFT' : 'PUBLISHED';
    setTab(newValue);
    fetchCinemaTheaters({
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

  const handleUpdateCinemaTheater = (data) => {
    openPopup(
      <ModalCreateSeatMap
        fetchCinemaTheaters={fetchCinemaTheaters}
        isUpdate={true}
        cinemaTheaters={data}
      />
    );
  };

  const dispatch = useDispatch();
  const handleDelete = (id) => {
    const isDelete = confirm('Bạn muốn xóa phòng chiếu id: ' + id);
    if (!isDelete) return;
    deleteCinemaTheater(id).then(() => {
      dispatch(openSnackbar({ message: 'Xóa phòng chiếu thành công' }));
      fetchCinemaTheaters({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        status: tab < 1 ? null : tab > 1 ? 'DRAFT' : 'PUBLISHED',
      });
    });
  };

  /* Table */
  const columns = [
    { headerName: '#', field: 'cinemaTheaterId', width: 50 },
    {
      headerName: 'Phòng chiếu',
      field: 'name',
      flex: 1,
      renderCell: (params) => (
        <div>
          <p>{params.value}</p>
          <p>
            Phòng chiếu:{' '}
            <span
              className="ml-2 cursor-pointer text-primary hover:underline"
              onClick={() => handleUpdateCinemaTheater(params.row)}
            >
              Sửa
            </span>
          </p>
        </div>
      ),
    },
    {
      headerName: 'Rạp chiếu',
      field: 'movieTheater',
      flex: 1,
      renderCell: (params) => <p>{`${params.value?.name}`}</p>,
    },
    {
      headerName: 'Loại phòng',
      field: 'cinemaType',
      flex: 1,
      renderCell: (params) => <p>{`${params.value?.name}`}</p>,
    },
    {
      headerName: 'Sức chứa',
      field: 'matrix',
      renderCell: (params) => (
        <p>{`${params.row.numberOfRows} x ${params.row.numberOfColumns}`}</p>
      ),
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
      renderCell: (params) => (
        <span
          className={`rounded-lg p-2 capitalize ${params.value !== 'PUBLISHED' ? 'bg-yellow-100 text-yellow-500' : 'bg-[#b7e9e0] text-[#0bb392]'}`}
        >
          {params.value === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
        </span>
      ),
    },
    {
      headerName: 'Hoạt động',
      field: 'action',
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <p
            className="flex items-center rounded-sm bg-red-500 px-2 py-1 text-white hover:cursor-pointer"
            onClick={() => handleDelete(params.row.cinemaTheaterId)}
          >
            <MdDeleteForever size={25} />
            Xóa
          </p>
          <Link
            to={`/admin/so-do-ghe/${params.row.cinemaTheaterId}`}
            className="flex items-center rounded-sm bg-primary px-2 py-1 text-white hover:cursor-pointer"
          >
            <FaSitemap size={25} />
            Tạo sơ đồ ghế
          </Link>
        </div>
      ),
    },
  ];

  return (
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
            rows={cinemaTheaters}
            getRowId={(row) => row.cinemaTheaterId}
            columns={columns}
            initialState={{
              pagination: { paginationModel },
            }}
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 30, 50, 100]}
            checkboxSelection={false}
            paginationMode="server"
            onPaginationModelChange={handlePageChange}
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                padding: '10px 6px',
              },
            }}
          />
        </div>
      </TabPanel>
    </Box>
  );
};

export default CinemaTheaterTable;

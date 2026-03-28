import { deleteCinemaTheater } from '@apis/cinemaTheaterService';
import TabPanel from '@component/Tabpanel.jsx';
import { useModelContext } from '@context/ModalContext';
import { openSnackbar } from '@redux/slices/snackbarSlice';
import { adminTabSx, adminTabsSx } from '@utils/adminTabStyles';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDeleteForever } from 'react-icons/md';
import ModalCreateCinemaTheater from './ModalCreateCinemaTheater';

const resolveStatusFilter = (tab) => {
  if (tab === 1) {
    return 'PUBLISHED';
  }

  if (tab === 2) {
    return 'DRAFT';
  }

  return null;
};

const CinemaTheaterTable = ({
  tab,
  setTab,
  isLoading,
  fetchCinemaTheaters,
  paginationModel,
  cinemaTheaters,
  totalCount,
}) => {
  const { openPopup } = useModelContext();
  const dispatch = useDispatch();

  const handlePageChange = (newModel) => {
    fetchCinemaTheaters({
      page: newModel.page,
      size: newModel.pageSize,
      status: resolveStatusFilter(tab),
    });
  };

  const handleChangeTab = (_, newValue) => {
    setTab(newValue);
    fetchCinemaTheaters({
      page: 0,
      size: paginationModel.pageSize,
      status: resolveStatusFilter(newValue),
    });
  };

  const handleUpdateCinemaTheater = (data) => {
    openPopup(
      <ModalCreateCinemaTheater
        fetchCinemaTheaters={fetchCinemaTheaters}
        isUpdate={true}
        cinemaTheaters={data}
      />
    );
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Bạn muốn xóa phòng chiếu ID ${id} không?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteCinemaTheater(id);
      dispatch(openSnackbar({ message: 'Xóa phòng chiếu thành công.' }));
      await fetchCinemaTheaters({
        page: paginationModel.page,
        size: paginationModel.pageSize,
        status: resolveStatusFilter(tab),
      });
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa phòng chiếu thất bại!');
    }
  };

  const columns = [
    { headerName: '#', field: 'cinemaTheaterId', width: 70 },
    {
      headerName: 'Phòng chiếu',
      field: 'name',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <div>
          <p className="font-medium">{params.value}</p>
          <button
            type="button"
            className="mt-1 cursor-pointer text-sm text-primary hover:underline"
            onClick={() => handleUpdateCinemaTheater(params.row)}
          >
            Chỉnh sửa
          </button>
        </div>
      ),
    },
    {
      headerName: 'Rạp chiếu',
      field: 'movieTheater',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <p>{params.value?.name || 'Chưa có rạp'}</p>,
    },
    {
      headerName: 'Loại phòng',
      field: 'cinemaType',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => <p>{params.value?.name || 'Chưa có loại phòng'}</p>,
    },
    {
      headerName: 'Sức chứa',
      field: 'matrix',
      minWidth: 140,
      renderCell: (params) => (
        <div className="flex flex-col gap-1 py-2">
          <p>{`${params.row.numberOfRows} x ${params.row.numberOfColumns}`}</p>
          <p className="text-primary">
            {`${params.row.numberOfRows * params.row.numberOfColumns} chỗ ngồi`}
          </p>
        </div>
      ),
    },
    {
      headerName: 'Trạng thái',
      field: 'status',
      minWidth: 140,
      renderCell: (params) => (
        <small
          className={`rounded-lg p-2 font-semibold capitalize ${
            params.value === 'PUBLISHED'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {params.value === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
        </small>
      ),
    },
    {
      headerName: 'Hoạt động',
      field: 'action',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex items-center gap-2 py-2">
          <Button
            onClick={() => handleDelete(params.row.cinemaTheaterId)}
            color="error"
            variant="contained"
            size="medium"
          >
            <MdDeleteForever size={24} />
          </Button>
          <Link to={`/admin/so-do-ghe/${params.row.cinemaTheaterId}`}>
            <Button variant="contained" color="primary" className="!capitalize" size="medium">
              Sơ đồ ghế
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <Box>
      <Box>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          aria-label="trạng thái phòng chiếu"
          sx={adminTabsSx}
        >
          <Tab label="Tất cả" sx={adminTabSx} />
          <Tab label="Đã xuất bản" sx={adminTabSx} />
          <Tab label="Bản nháp" sx={adminTabSx} />
        </Tabs>
      </Box>

      <TabPanel value={tab} index={tab}>
        <div className="w-full overflow-x-auto">
          <DataGrid
            rows={cinemaTheaters}
            getRowId={(row) => row.cinemaTheaterId}
            columns={columns}
            loading={isLoading}
            initialState={{
              pagination: { paginationModel },
            }}
            paginationModel={paginationModel}
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 30, 50, 100]}
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

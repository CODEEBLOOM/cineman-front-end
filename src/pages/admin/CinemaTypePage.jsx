import {
  deleteCinemaType,
  extractCinemaTypeList,
  findAll,
} from '@apis/cinemaTypeService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import CinemaTypeFormModal from '@component/admin/cinema_type/CinemaTypeFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const CinemaTypePage = () => {
  const { openPopup } = useModelContext();
  const [cinemaTypes, setCinemaTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCinemaTypes = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAll();
      setCinemaTypes(extractCinemaTypeList(response));
    } catch {
      toast.error('Không thể tải danh sách loại phòng chiếu!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý loại phòng chiếu - POLY CINEMAS';
    fetchCinemaTypes();
  }, [fetchCinemaTypes]);

  const handleOpenModal = (cinemaType = null) => {
    openPopup(
      <CinemaTypeFormModal
        cinemaType={cinemaType}
        onSuccess={fetchCinemaTypes}
      />
    );
  };

  const handleDelete = async (cinemaType) => {
    const cinemaTypeId = cinemaType?.cinemaTypeId ?? cinemaType?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa loại phòng chiếu "${cinemaType?.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCinemaType(cinemaTypeId);
      toast.success('Xóa loại phòng chiếu thành công!');
      await fetchCinemaTypes();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa loại phòng chiếu thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      cinemaTypes.map((cinemaType, index) => ({
        ...cinemaType,
        gridIndex: index + 1,
      })),
    [cinemaTypes]
  );

  const columns = [
    {
      field: 'gridIndex',
      headerName: 'STT',
      width: 90,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'code',
      headerName: 'Mã',
      width: 160,
      renderCell: (params) => params.value || 'Chưa có mã',
    },
    {
      field: 'name',
      headerName: 'Tên loại phòng chiếu',
      flex: 1,
      minWidth: 240,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1.3,
      minWidth: 320,
      renderCell: (params) => params.value?.trim() || 'Chưa có mô tả',
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleOpenModal(params.row)}
          >
            <CiEdit size={24} fill="orange" />
          </button>
          <button
            type="button"
            className="hover:cursor-pointer"
            onClick={() => handleDelete(params.row)}
          >
            <MdOutlineDeleteSweep size={24} fill="red" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý loại phòng chiếu' }]}
        title="Quản lý loại phòng chiếu"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách loại phòng chiếu</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục loại phòng chiếu để dùng khi cấu hình phòng trong hệ thống rạp.
            </p>
          </div>

          <Button variant="contained" onClick={() => handleOpenModal()}>
            Tạo mới
          </Button>
        </div>

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          hideFooter
          minWidth={940}
          getRowId={(row) => row?.cinemaTypeId ?? row?.id}
          loadingContent="Đang tải danh sách loại phòng chiếu..."
          emptyContent="Chưa có loại phòng chiếu nào"
        />
      </div>
    </div>
  );
};

export default CinemaTypePage;

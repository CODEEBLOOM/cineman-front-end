import {
  deleteSnackType,
  extractSnackTypeList,
  findAllSnackTypesAdmin,
  normalizeSnackType,
} from '@apis/snackTypeAdminService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import SnackTypeFormModal from '@component/admin/snack_type/SnackTypeFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const SnackTypePage = () => {
  const { openPopup } = useModelContext();
  const [snackTypes, setSnackTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSnackTypes = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllSnackTypesAdmin();
      setSnackTypes(extractSnackTypeList(response).map(normalizeSnackType));
    } catch {
      toast.error('Không thể tải danh sách loại đồ ăn vặt!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý loại đồ ăn vặt - POLY CINEMAS';
    fetchSnackTypes();
  }, [fetchSnackTypes]);

  const handleOpenModal = (snackType = null) => {
    openPopup(
      <SnackTypeFormModal snackType={snackType} onSuccess={fetchSnackTypes} />
    );
  };

  const handleDelete = async (snackType) => {
    const snackTypeId = snackType?.snackTypeId ?? snackType?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa loại đồ ăn vặt "${snackType?.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSnackType(snackTypeId);
      toast.success('Xóa loại đồ ăn vặt thành công!');
      await fetchSnackTypes();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa loại đồ ăn vặt thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      snackTypes.map((snackType, index) => ({
        ...snackType,
        gridIndex: index + 1,
      })),
    [snackTypes]
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
      field: 'name',
      headerName: 'Tên loại đồ ăn vặt',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <span className="font-medium">{params.value}</span>
      ),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1.4,
      minWidth: 360,
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
        items={[{ label: 'Quản lý loại đồ ăn vặt' }]}
        title="Quản lý loại đồ ăn vặt"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách loại đồ ăn vặt</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục nhóm sản phẩm để phân loại đồ ăn và nước uống bán
              tại rạp.
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
          getRowId={(row) => row?.snackTypeId ?? row?.id}
          loadingContent="Đang tải danh sách loại đồ ăn vặt..."
          emptyContent="Chưa có loại đồ ăn vặt nào"
        />
      </div>
    </div>
  );
};

export default SnackTypePage;

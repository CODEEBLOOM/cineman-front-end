import {
  deleteSnack,
  extractSnackList,
  findAllSnacksAdmin,
  normalizeSnack,
} from '@apis/snackAdminService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import SnackFormModal from '@component/admin/snack/SnackFormModal';
import ImageComponent from '@component/ImageComponent';
import { useModelContext } from '@context/ModalContext';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const resolveImageSrc = (image) => {
  if (!image) {
    return '';
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${import.meta.env.VITE_STORAGES}/${image}`;
};

const SnackPage = () => {
  const { openPopup } = useModelContext();
  const [snacks, setSnacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSnacks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllSnacksAdmin();
      setSnacks(extractSnackList(response).map(normalizeSnack));
    } catch {
      toast.error('Không thể tải danh sách snack!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý đồ ăn vặt - POLY CINEMAS';
    fetchSnacks();
  }, [fetchSnacks]);

  const handleOpenModal = (snack = null) => {
    openPopup(<SnackFormModal snack={snack} onSuccess={fetchSnacks} />);
  };

  const handleDelete = async (snack) => {
    const snackId = snack?.snackId ?? snack?.id;
    const snackName = snack?.snackName ?? snack?.name ?? `#${snackId}`;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa đồ ăn vặt "${snackName}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSnack(snackId);
      toast.success('Xóa đồ ăn vặt thành công!');
      await fetchSnacks();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa đồ ăn vặt thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      snacks.map((snack, index) => ({
        ...snack,
        gridIndex: index + 1,
      })),
    [snacks]
  );

  const columns = useMemo(
    () => [
      {
        field: 'gridIndex',
        headerName: 'STT',
        width: 90,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'image',
        headerName: 'Ảnh',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <div className="py-2">
            <ImageComponent
              src={resolveImageSrc(params.row?.image)}
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded object-cover"
            />
          </div>
        ),
      },
      {
        field: 'snackName',
        headerName: 'Tên đồ ăn vặt',
        flex: 1,
        minWidth: 220,
        renderCell: (params) => (
          <span className="font-medium">{params.value || 'Chưa có tên'}</span>
        ),
      },
      {
        field: 'snackTypeName',
        headerName: 'Loại đồ ăn vặt',
        width: 180,
        renderCell: (params) => (
          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            {params.value}
          </span>
        ),
      },
      {
        field: 'unitPrice',
        headerName: 'Giá bán',
        width: 160,
        renderCell: (params) => currencyFormatter(Number(params.value) || 0),
      },
      {
        field: 'description',
        headerName: 'Mô tả',
        flex: 1.2,
        minWidth: 300,
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
    ],
    []
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý snack' }]}
        title="Quản lý snack"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách đồ ăn vặt</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý các sản phẩm bán kèm như bắp rang, nước uống và combo phục
              vụ tại rạp.
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
          minWidth={1220}
          getRowId={(row) => row?.snackId ?? row?.id}
          loadingContent="Đang tải danh sách snack..."
          emptyContent="Chưa có đồ ăn vặt nào"
        />
      </div>
    </div>
  );
};

export default SnackPage;

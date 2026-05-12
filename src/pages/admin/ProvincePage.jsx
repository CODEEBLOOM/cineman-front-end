import {
  deleteProvince,
  extractProvinceList,
  findAll,
} from '@apis/provinceService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import ProvinceFormModal from '@component/admin/province/ProvinceFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const ProvincePage = () => {
  const { openPopup } = useModelContext();
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sortedProvinces = useMemo(() => {
    return [...provinces].sort(
      (left, right) => Number(left?.code ?? 0) - Number(right?.code ?? 0)
    );
  }, [provinces]);

  const fetchProvinces = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAll();
      setProvinces(extractProvinceList(response));
    } catch {
      toast.error('Không thể tải danh sách chi nhánh!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý chi nhánh - POLY CINEMAS';
    fetchProvinces();
  }, [fetchProvinces]);

  const handleOpenModal = (province = null) => {
    openPopup(<ProvinceFormModal province={province} onSuccess={fetchProvinces} />);
  };

  const handleDelete = async (province) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa chi nhánh "${province?.name ?? ''}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProvince(province.id);
      toast.success('Xóa chi nhánh thành công!');
      await fetchProvinces();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa chi nhánh thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      sortedProvinces.map((province, index) => ({
        ...province,
        gridIndex: index + 1,
      })),
    [sortedProvinces]
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
      width: 140,
      renderCell: (params) => params.value || 'Chưa có mã',
    },
    {
      field: 'name',
      headerName: 'Tên chi nhánh',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => <span className="font-medium">{params.value}</span>,
    },
    {
      field: 'active',
      headerName: 'Trạng thái',
      width: 190,
      renderCell: (params) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            params.value !== false
              ? 'bg-green-100 text-green-600'
              : 'bg-slate-200 text-slate-600'
          }`}
        >
          {params.value !== false ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      field: 'movieTheaterCount',
      headerName: 'Số rạp',
      width: 120,
      renderCell: (params) => params.row?.movieTheaters?.length ?? 0,
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
      <CustomBreadcrumb items={[{ label: 'Quản lý chi nhánh' }]} title="Quản lý chi nhánh" />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách chi nhánh</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý tỉnh/thành đang vận hành hệ thống rạp và dùng để gắn địa điểm chiếu.
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
          minWidth={900}
          getRowId={(row) => row.id}
          loadingContent="Đang tải danh sách chi nhánh..."
          emptyContent="Chưa có chi nhánh nào"
        />
      </div>
    </div>
  );
};

export default ProvincePage;

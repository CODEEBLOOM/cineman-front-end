import {
  deletePromotionType,
  extractPromotionTypeList,
  findAllPromotionTypesAdmin,
  normalizePromotionType,
} from '@apis/promotionTypeAdminService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import PromotionTypeFormModal from '@component/admin/promotion_type/PromotionTypeFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep, MdOutlineDiscount } from 'react-icons/md';
import { toast } from 'react-toastify';

const PromotionTypePage = () => {
  const { openPopup } = useModelContext();
  const [promotionTypes, setPromotionTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPromotionTypes = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllPromotionTypesAdmin();
      setPromotionTypes(
        extractPromotionTypeList(response).map(normalizePromotionType)
      );
    } catch {
      toast.error('Không thể tải danh sách loại khuyến mãi!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý loại khuyến mãi - POLY CINEMAS';
    fetchPromotionTypes();
  }, [fetchPromotionTypes]);

  const handleOpenModal = (promotionType = null) => {
    openPopup(
      <PromotionTypeFormModal
        promotionType={promotionType}
        onSuccess={fetchPromotionTypes}
      />
    );
  };

  const handleDelete = async (promotionType) => {
    const promotionTypeId =
      promotionType?.promotionTypeId ?? promotionType?.id;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa loại khuyến mãi "${promotionType?.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePromotionType(promotionTypeId);
      toast.success('Xóa loại khuyến mãi thành công!');
      await fetchPromotionTypes();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa loại khuyến mãi thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      promotionTypes.map((promotionType, index) => ({
        ...promotionType,
        gridIndex: index + 1,
      })),
    [promotionTypes]
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
      headerName: 'Mã loại',
      width: 180,
      renderCell: (params) =>
        params.value ? (
          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            {params.value}
          </span>
        ) : (
          'Chưa có mã'
        ),
    },
    {
      field: 'name',
      headerName: 'Tên loại khuyến mãi',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <span className="font-medium">{params.value || 'Chưa có tên'}</span>
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
      width: 150,
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
        items={[{ label: 'Quản lý loại khuyến mãi' }]}
        title="Quản lý loại khuyến mãi"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách loại khuyến mãi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục loại khuyến mãi để nhóm các chương trình ưu đãi theo từng chiến dịch áp dụng.
            </p>
          </div>

          <Button
            variant="contained"
            startIcon={<MdOutlineDiscount size={18} />}
            onClick={() => handleOpenModal()}
          >
            Tạo mới
          </Button>
        </div>

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          hideFooter
          minWidth={1040}
          getRowId={(row) => row?.promotionTypeId ?? row?.id}
          loadingContent="Đang tải danh sách loại khuyến mãi..."
          emptyContent="Chưa có loại khuyến mãi nào"
        />
      </div>
    </div>
  );
};

export default PromotionTypePage;

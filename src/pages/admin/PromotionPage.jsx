import {
  applyPromotion,
  deletePromotion,
  extractPromotionList,
  findAllPromotionsAdmin,
  normalizePromotion,
} from '@apis/promotionAdminService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import PromotionFormModal from '@component/admin/promotion/PromotionFormModal';
import { useModelContext } from '@context/ModalContext';
import { currencyFormatter } from '@libs/Utils';
import { Button, Tooltip } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import {
  MdCheckCircleOutline,
  MdOutlineDeleteSweep,
  MdOutlineDiscount,
} from 'react-icons/md';
import { toast } from 'react-toastify';

const STATUS_META = {
  ALL: {
    label: 'Tất cả',
    badgeClassName: 'bg-slate-100 text-slate-700',
  },
  ACTIVE: {
    label: 'Đang áp dụng',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
  },
  INACTIVE: {
    label: 'Chưa kích hoạt',
    badgeClassName: 'bg-amber-100 text-amber-700',
  },
  USED: {
    label: 'Đã dùng hết',
    badgeClassName: 'bg-sky-100 text-sky-700',
  },
  DELETED: {
    label: 'Đã xóa',
    badgeClassName: 'bg-rose-100 text-rose-700',
  },
};

const STATUS_FILTERS = ['ALL', 'ACTIVE', 'INACTIVE', 'USED', 'DELETED'];

const percentageFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

const SummaryCard = ({ label, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
  </div>
);

const formatDateTime = (value) => {
  if (!value) {
    return 'Không giới hạn';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const comparePromotions = (left, right) => {
  const leftStartDate = left?.startDate ? new Date(left.startDate).getTime() : 0;
  const rightStartDate = right?.startDate
    ? new Date(right.startDate).getTime()
    : 0;

  if (rightStartDate !== leftStartDate) {
    return rightStartDate - leftStartDate;
  }

  return Number(right?.id ?? 0) - Number(left?.id ?? 0);
};

const PromotionPage = () => {
  const { openPopup } = useModelContext();
  const [promotions, setPromotions] = useState([]);
  const [allPromotions, setAllPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchPromotionSummary = useCallback(async () => {
    try {
      const response = await findAllPromotionsAdmin();
      const items = extractPromotionList(response)
        .map(normalizePromotion)
        .sort(comparePromotions);
      setAllPromotions(items);
    } catch {
      toast.error('Không thể tải thống kê khuyến mãi!');
    }
  }, []);

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllPromotionsAdmin(
        selectedStatus === 'ALL' ? undefined : selectedStatus
      );
      const items = extractPromotionList(response)
        .map(normalizePromotion)
        .sort(comparePromotions);
      setPromotions(items);
    } catch {
      toast.error('Không thể tải danh sách khuyến mãi!');
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus]);

  const reloadData = useCallback(async () => {
    await Promise.all([fetchPromotionSummary(), fetchPromotions()]);
  }, [fetchPromotionSummary, fetchPromotions]);

  useEffect(() => {
    document.title = 'Quản lý khuyến mãi - POLY CINEMAS';
  }, []);

  useEffect(() => {
    fetchPromotionSummary();
  }, [fetchPromotionSummary]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleOpenModal = useCallback(
    (promotion = null) => {
      openPopup(
        <PromotionFormModal
          promotion={promotion}
          promotionId={promotion?.id}
          onSuccess={reloadData}
        />
      );
    },
    [openPopup, reloadData]
  );

  const handleApply = useCallback(
    async (promotion) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn kích hoạt khuyến mãi "${promotion?.name}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await applyPromotion(promotion?.id);
        toast.success('Kích hoạt khuyến mãi thành công!');
        await reloadData();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Kích hoạt khuyến mãi thất bại!');
      }
    },
    [reloadData]
  );

  const handleDelete = useCallback(
    async (promotion) => {
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa khuyến mãi "${promotion?.name}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await deletePromotion(promotion?.id);
        toast.success('Xóa khuyến mãi thành công!');
        await reloadData();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Xóa khuyến mãi thất bại!');
      }
    },
    [reloadData]
  );

  const handleCopyCode = useCallback(async (code) => {
    if (!code) {
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã ${code}`);
    } catch {
      toast.error('Không thể sao chép mã voucher!');
    }
  }, []);

  const rows = useMemo(
    () =>
      promotions.map((promotion, index) => ({
        ...promotion,
        gridIndex: index + 1,
      })),
    [promotions]
  );

  const statusCounts = useMemo(() => {
    return allPromotions.reduce(
      (accumulator, promotion) => {
        const status = promotion?.status ?? 'INACTIVE';
        accumulator[status] = (accumulator[status] ?? 0) + 1;
        return accumulator;
      },
      {
        ACTIVE: 0,
        INACTIVE: 0,
        USED: 0,
        DELETED: 0,
      }
    );
  }, [allPromotions]);

  const summary = useMemo(() => {
    const totalQuantity = allPromotions.reduce(
      (accumulator, promotion) => accumulator + Number(promotion?.quantity ?? 0),
      0
    );
    const totalActive = statusCounts.ACTIVE ?? 0;
    const totalInactive = statusCounts.INACTIVE ?? 0;
    const totalUsed = statusCounts.USED ?? 0;

    return {
      total: allPromotions.length,
      totalQuantity,
      totalActive,
      totalInactive,
      totalUsed,
    };
  }, [allPromotions, statusCounts]);

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
        field: 'name',
        headerName: 'Khuyến mãi',
        minWidth: 240,
        flex: 0.95,
        renderCell: (params) => (
          <div className="py-2">
            <p className="font-semibold text-slate-800">
              {params.value || 'Chưa có tên'}
            </p>
            <p className="text-xs leading-5 text-slate-500">
              {params.row?.content?.trim() || 'Chưa có mô tả'}
            </p>
          </div>
        ),
      },
      {
        field: 'promotionTypeName',
        headerName: 'Loại khuyến mãi',
        minWidth: 190,
        flex: 0.7,
        renderCell: (params) =>
          params.value ? (
            <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {params.value}
            </span>
          ) : (
            <span className="text-sm text-slate-400">Chưa phân loại</span>
          ),
      },
      {
        field: 'code',
        headerName: 'Mã voucher',
        width: 180,
        renderCell: (params) =>
          params.value ? (
            <button
              type="button"
              className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600 transition hover:bg-orange-100"
              onClick={() => handleCopyCode(params.value)}
            >
              {params.value}
            </button>
          ) : (
            <span className="text-sm text-slate-400">Sẽ tạo sau khi lưu</span>
          ),
      },
      {
        field: 'period',
        headerName: 'Thời gian áp dụng',
        minWidth: 250,
        flex: 1,
        renderCell: (params) => (
          <div className="py-2 text-sm leading-6">
            <p>Bắt đầu: {formatDateTime(params.row?.startDate)}</p>
            <p>Kết thúc: {formatDateTime(params.row?.endDate)}</p>
          </div>
        ),
      },
      {
        field: 'discount',
        headerName: 'Mức giảm',
        width: 140,
        renderCell: (params) => (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {percentageFormatter.format(Number(params.value) || 0)}
          </span>
        ),
      },
      {
        field: 'quantity',
        headerName: 'Số lượng',
        width: 130,
        renderCell: (params) =>
          `${numberFormatter.format(Number(params.value) || 0)} mã`,
      },
      {
        field: 'limitAmount',
        headerName: 'Đơn tối thiểu',
        width: 170,
        renderCell: (params) => currencyFormatter(Number(params.value) || 0),
      },
      {
        field: 'membershipRankNames',
        headerName: 'Phạm vi áp dụng',
        minWidth: 250,
        flex: 1,
        renderCell: (params) => {
          const rankNames = Array.isArray(params.value) ? params.value : [];

          if (params.row?.applicableForAllRanks || rankNames.length === 0) {
            return (
              <span className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                Tất cả hạng thành viên
              </span>
            );
          }

          return (
            <div className="flex flex-wrap gap-1 py-2">
              {rankNames.map((rankName) => (
                <span
                  key={rankName}
                  className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {rankName}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        field: 'staffName',
        headerName: 'Nhân viên tạo',
        minWidth: 170,
        flex: 0.7,
        renderCell: (params) => params.value || 'Chưa xác định',
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 170,
        renderCell: (params) => {
          const statusMeta = STATUS_META[params.value] ?? STATUS_META.INACTIVE;

          return (
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.badgeClassName}`}
            >
              {statusMeta.label}
            </span>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Thao tác',
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <div className="flex items-center gap-2">
            <Tooltip title="Cập nhật">
              <button
                type="button"
                className="hover:cursor-pointer"
                onClick={() => handleOpenModal(params.row)}
              >
                <CiEdit size={24} fill="orange" />
              </button>
            </Tooltip>

            {params.row?.status === 'INACTIVE' ? (
              <Tooltip title="Kích hoạt">
                <button
                  type="button"
                  className="hover:cursor-pointer"
                  onClick={() => handleApply(params.row)}
                >
                  <MdCheckCircleOutline size={24} fill="#16a34a" />
                </button>
              </Tooltip>
            ) : null}

            <Tooltip title="Xóa">
              <button
                type="button"
                className="hover:cursor-pointer"
                onClick={() => handleDelete(params.row)}
              >
                <MdOutlineDeleteSweep size={24} fill="red" />
              </button>
            </Tooltip>
          </div>
        ),
      },
    ],
    [handleApply, handleCopyCode, handleDelete, handleOpenModal]
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý khuyến mãi' }]}
        title="Quản lý khuyến mãi"
      />

      <div className="mx-5 mt-3 grid gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Tổng chương trình"
          value={numberFormatter.format(summary.total)}
          helper="Số lượng voucher và chương trình ưu đãi đã được cấu hình trong hệ thống."
          accentClass="text-slate-900"
        />
        <SummaryCard
          label="Đang áp dụng"
          value={numberFormatter.format(summary.totalActive)}
          helper="Các khuyến mãi đã kích hoạt và có thể áp dụng cho khách hàng đủ điều kiện."
          accentClass="text-emerald-600"
        />
        <SummaryCard
          label="Chờ kích hoạt"
          value={numberFormatter.format(summary.totalInactive)}
          helper="Chương trình đã tạo nhưng chưa được kích hoạt trên hệ thống."
          accentClass="text-amber-600"
        />
        <SummaryCard
          label="Tổng số voucher"
          value={numberFormatter.format(summary.totalQuantity)}
          helper={`Hiện có ${numberFormatter.format(summary.totalUsed)} chương trình đã dùng hết voucher.`}
          accentClass="text-sky-600"
        />
      </div>

      <div className="mx-5 mt-4 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex flex-col gap-4 border-b pb-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Danh sách khuyến mãi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Theo dõi voucher giảm giá, loại khuyến mãi, thời gian áp dụng, số
              lượng phát hành và phạm vi khách hàng cho từng chương trình.
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

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            const count =
              status === 'ALL' ? allPromotions.length : statusCounts[status] ?? 0;

            return (
              <Button
                key={status}
                variant={isSelected ? 'contained' : 'outlined'}
                color={isSelected ? 'primary' : 'inherit'}
                onClick={() => setSelectedStatus(status)}
              >
                {STATUS_META[status].label} ({numberFormatter.format(count)})
              </Button>
            );
          })}
        </div>

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          hideFooter
          minWidth={1920}
          getRowId={(row) => row?.id ?? row?.promotionId}
          loadingContent="Đang tải danh sách khuyến mãi..."
          emptyContent={
            selectedStatus === 'ALL'
              ? 'Chưa có chương trình khuyến mãi nào'
              : `Chưa có khuyến mãi ở trạng thái "${STATUS_META[selectedStatus].label.toLowerCase()}"`
          }
        />
      </div>
    </div>
  );
};

export default PromotionPage;

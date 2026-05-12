import {
  deleteMembershipRank,
  extractMembershipRankList,
  findAllMembershipRanksAdmin,
  normalizeMembershipRank,
} from '@apis/membershipRankService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import MembershipRankFormModal from '@component/admin/membership_rank/MembershipRankFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import DateFormatter from '@utils/DateFormatter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const percentageFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('vi-VN', {
  maximumFractionDigits: 0,
});

const dateFormatter = (value) => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  return new DateFormatter(value).format('HH:mm:ss - DD/MM/YYYY');
};

const compareMembershipRanks = (left, right) => {
  const priorityCompare =
    Number(left?.priorityLevel ?? 0) - Number(right?.priorityLevel ?? 0);

  if (priorityCompare !== 0) {
    return priorityCompare;
  }

  const requiredPointCompare =
    Number(left?.requiredPoint ?? 0) - Number(right?.requiredPoint ?? 0);

  if (requiredPointCompare !== 0) {
    return requiredPointCompare;
  }

  return (left?.name ?? '').localeCompare(right?.name ?? '', 'vi');
};

const SummaryCard = ({ label, value, helper, accentClass }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accentClass}`}>{value}</p>
    <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
  </div>
);

const MembershipRankPage = () => {
  const { openPopup } = useModelContext();
  const [membershipRanks, setMembershipRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMembershipRanks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllMembershipRanksAdmin();
      const items = extractMembershipRankList(response)
        .map(normalizeMembershipRank)
        .sort(compareMembershipRanks);
      setMembershipRanks(items);
    } catch {
      toast.error('Không thể tải danh sách hạng thẻ thành viên!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý thẻ thành viên - POLY CINEMAS';
    fetchMembershipRanks();
  }, [fetchMembershipRanks]);

  const handleOpenModal = useCallback(
    (membershipRank = null) => {
      openPopup(
        <MembershipRankFormModal
          membershipRank={membershipRank}
          onSuccess={fetchMembershipRanks}
        />
      );
    },
    [fetchMembershipRanks, openPopup]
  );

  const handleDelete = useCallback(
    async (membershipRank) => {
      const membershipRankId =
        membershipRank?.id ?? membershipRank?.membershipRankId ?? null;
      const membershipRankName = membershipRank?.name ?? `#${membershipRankId}`;
      const confirmed = window.confirm(
        `Bạn có chắc muốn xóa hạng thẻ "${membershipRankName}" không?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteMembershipRank(membershipRankId);
        toast.success('Xóa hạng thẻ thành công!');
        await fetchMembershipRanks();
      } catch (error) {
        if (
          error?.response?.status === 400 ||
          error?.response?.status === 404 ||
          error?.response?.status === 409
        ) {
          return toast.error(error?.response?.data?.message);
        }

        toast.error('Xóa hạng thẻ thất bại!');
      }
    },
    [fetchMembershipRanks]
  );

  const rows = useMemo(
    () =>
      membershipRanks.map((membershipRank, index) => ({
        ...membershipRank,
        gridIndex: index + 1,
      })),
    [membershipRanks]
  );

  const summary = useMemo(() => {
    const activeCount = membershipRanks.filter((item) => item.status !== false).length;
    const highestPoint = membershipRanks.reduce(
      (currentMax, item) =>
        Math.max(currentMax, Number(item?.requiredPoint ?? 0)),
      0
    );
    const highestTicketRate = membershipRanks.reduce(
      (currentMax, item) =>
        Math.max(currentMax, Number(item?.returnPointsTicket ?? 0)),
      0
    );

    return {
      total: membershipRanks.length,
      activeCount,
      highestPoint,
      highestTicketRate,
    };
  }, [membershipRanks]);

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
        headerName: 'Hạng thẻ',
        minWidth: 220,
        flex: 1,
        renderCell: (params) => (
          <div className="py-2">
            <p className="font-semibold text-slate-800">{params.value}</p>
            <p className="text-xs text-slate-500">
              Ưu tiên: {params.row?.priorityLevel ?? 0}
            </p>
          </div>
        ),
      },
      {
        field: 'requiredPoint',
        headerName: 'Điểm yêu cầu',
        width: 170,
        renderCell: (params) =>
          `${numberFormatter.format(Number(params.value) || 0)} điểm`,
      },
      {
        field: 'returnPointsTicket',
        headerName: 'Hoàn điểm vé',
        width: 170,
        renderCell: (params) => (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {percentageFormatter.format(Number(params.value) || 0)}
          </span>
        ),
      },
      {
        field: 'returnPointsSnack',
        headerName: 'Hoàn điểm snack',
        width: 190,
        renderCell: (params) => (
          <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {percentageFormatter.format(Number(params.value) || 0)}
          </span>
        ),
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 170,
        renderCell: (params) => (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              params.value !== false
                ? 'bg-green-100 text-green-600'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {params.value !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
          </span>
        ),
      },
      {
        field: 'updatedAt',
        headerName: 'Cập nhật lần cuối',
        minWidth: 210,
        flex: 1,
        renderCell: (params) => dateFormatter(params.value),
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
    [handleDelete, handleOpenModal]
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý thẻ thành viên' }]}
        title="Quản lý thẻ thành viên"
      />

      <div className="mx-5 mt-3 grid gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Tổng số hạng thẻ"
          value={numberFormatter.format(summary.total)}
          helper="Theo dõi nhanh số cấp độ thành viên đang được cấu hình trong hệ thống."
          accentClass="text-slate-900"
        />
        <SummaryCard
          label="Hạng đang áp dụng"
          value={numberFormatter.format(summary.activeCount)}
          helper="Số hạng thẻ hiện còn hiệu lực để sử dụng trong quá trình tích điểm và xét hạng."
          accentClass="text-emerald-600"
        />
        <SummaryCard
          label="Mốc điểm cao nhất"
          value={`${numberFormatter.format(summary.highestPoint)} điểm`}
          helper={`Tỷ lệ hoàn điểm vé cao nhất hiện tại là ${percentageFormatter.format(
            summary.highestTicketRate
          )}.`}
          accentClass="text-sky-600"
        />
      </div>

      <div className="mx-5 mt-4 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách hạng thẻ</h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý các cấp độ thành viên, điểm yêu cầu và tỷ lệ hoàn điểm
              cho từng hạng thẻ trong hệ thống.
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
          minWidth={1340}
          getRowId={(row) => row?.id ?? row?.membershipRankId}
          loadingContent="Đang tải danh sách hạng thẻ thành viên..."
          emptyContent="Chưa có hạng thẻ thành viên nào"
        />
      </div>
    </div>
  );
};

export default MembershipRankPage;

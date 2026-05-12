import {
  deleteTicketType,
  extractTicketTypeList,
  findAllTicketTypesAdmin,
} from '@apis/ticketTypeService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import TicketTypeFormModal from '@component/admin/ticket_type/TicketTypeFormModal';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

const TICKET_TYPE_LABELS = {
  ADULT: 'Người lớn',
  CHILD: 'Trẻ em',
  STUDENT: 'Học sinh / Sinh viên',
  SENIOR: 'Người cao tuổi',
};

const TicketTypePage = () => {
  const { openPopup } = useModelContext();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    []
  );

  const fetchTicketTypes = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAllTicketTypesAdmin();
      setTicketTypes(extractTicketTypeList(response));
    } catch {
      toast.error('Không thể tải danh sách loại vé!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý loại vé - POLY CINEMAS';
    fetchTicketTypes();
  }, [fetchTicketTypes]);

  const handleOpenModal = (ticketType = null) => {
    openPopup(
      <TicketTypeFormModal ticketType={ticketType} onSuccess={fetchTicketTypes} />
    );
  };

  const handleDelete = async (ticketType) => {
    const ticketTypeLabel = TICKET_TYPE_LABELS[ticketType.name] ?? ticketType.name;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa loại vé "${ticketTypeLabel}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTicketType(ticketType.id);
      toast.success('Xóa loại vé thành công!');
      await fetchTicketTypes();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa loại vé thất bại!');
    }
  };

  const rows = useMemo(
    () =>
      ticketTypes.map((ticketType, index) => ({
        ...ticketType,
        gridIndex: index + 1,
      })),
    [ticketTypes]
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
      headerName: 'Loại vé',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span className="font-medium">
          {TICKET_TYPE_LABELS[params.value] ?? params.value}
        </span>
      ),
    },
    {
      field: 'price',
      headerName: 'Giá vé',
      width: 180,
      renderCell: (params) => currencyFormatter.format(Number(params.value) || 0),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1.2,
      minWidth: 280,
      renderCell: (params) => params.value?.trim() || 'Chưa có mô tả',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 180,
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
        items={[
          {
            label: 'Quản lý loại vé',
          },
        ]}
        title="Quản lý loại vé"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách loại vé</h2>
            <p className="mt-1 text-sm text-slate-500">
              Cấu hình mức giá và nhóm đối tượng áp dụng cho từng loại vé bán ra.
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
          minWidth={960}
          getRowId={(row) => row.id}
          loadingContent="Đang tải danh sách loại vé..."
          emptyContent="Chưa có loại vé nào"
        />
      </div>
    </div>
  );
};

export default TicketTypePage;

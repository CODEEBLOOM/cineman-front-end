import {
  deleteTicketType,
  extractTicketTypeList,
  findAllTicketTypesAdmin,
} from '@apis/ticketTypeService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import TicketTypeFormModal from '@component/admin/ticket_type/TicketTypeFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

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
    } catch (error) {
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

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[18%] min-w-[160px]">Loại vé</th>
              <th className="w-[18%] min-w-[160px]">Giá vé</th>
              <th className="w-[28%] min-w-[220px]">Mô tả</th>
              <th className="w-[16%] min-w-[140px]">Trạng thái</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <Loading content="Đang tải danh sách loại vé..." />
                </td>
              </tr>
            )}

            {!isLoading && ticketTypes.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyList content="Chưa có loại vé nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              ticketTypes.map((ticketType, index) => (
                <tr key={ticketType.id}>
                  <td>{index + 1}</td>
                  <td className="font-medium">
                    {TICKET_TYPE_LABELS[ticketType.name] ?? ticketType.name}
                  </td>
                  <td>{currencyFormatter.format(Number(ticketType.price) || 0)}</td>
                  <td className="text-slate-600">
                    {ticketType.description?.trim() || 'Chưa có mô tả'}
                  </td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        ticketType.status !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ticketType.status !== false ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(ticketType)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(ticketType)}
                      >
                        <MdOutlineDeleteSweep size={24} fill="red" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTypePage;

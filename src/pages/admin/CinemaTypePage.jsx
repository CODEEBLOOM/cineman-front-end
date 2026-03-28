import {
  deleteCinemaType,
  extractCinemaTypeList,
  findAll,
} from '@apis/cinemaTypeService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import CinemaTypeFormModal from '@component/admin/cinema_type/CinemaTypeFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

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

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Quản lý loại phòng chiếu' }]}
        title="Quản lý loại phòng chiếu"
      />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">
              Danh sách loại phòng chiếu
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục loại phòng chiếu để dùng khi cấu hình phòng trong
              hệ thống rạp.
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
              <th className="w-[18%] min-w-[160px]">Mã</th>
              <th className="w-[22%] min-w-[180px]">Tên loại phòng chiếu</th>
              <th className="w-[40%] min-w-[260px]">Mô tả</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <Loading content="Đang tải danh sách loại phòng chiếu..." />
                </td>
              </tr>
            )}

            {!isLoading && cinemaTypes.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyList content="Chưa có loại phòng chiếu nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              cinemaTypes.map((cinemaType, index) => (
                <tr key={cinemaType.cinemaTypeId ?? cinemaType.id}>
                  <td>{index + 1}</td>
                  <td>{cinemaType.code}</td>
                  <td className="font-medium">{cinemaType.name}</td>
                  <td className="text-slate-600">
                    {cinemaType.description?.trim() || 'Chưa có mô tả'}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(cinemaType)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(cinemaType)}
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

export default CinemaTypePage;

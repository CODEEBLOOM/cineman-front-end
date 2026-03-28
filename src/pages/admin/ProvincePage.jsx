import {
  deleteProvince,
  extractProvinceList,
  findAll,
} from '@apis/provinceService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import ProvinceFormModal from '@component/admin/province/ProvinceFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const ProvincePage = () => {
  const { openPopup } = useModelContext();
  const [provinces, setProvinces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sortedProvinces = useMemo(() => {
    return [...provinces].sort((left, right) => Number(left?.code ?? 0) - Number(right?.code ?? 0));
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

  return (
    <div>
      <CustomBreadcrumb items={[{ label: 'Quản lý chi nhánh' }]} title="Quản lý chi nhánh" />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
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

        <table>
          <thead>
            <tr>
              <th className="w-[8%]">STT</th>
              <th className="w-[14%] min-w-[120px]">Mã</th>
              <th className="w-[34%] min-w-[220px]">Tên chi nhánh</th>
              <th className="w-[18%] min-w-[150px]">Trạng thái</th>
              <th className="w-[14%] min-w-[120px]">Số rạp</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>
                  <Loading content="Đang tải danh sách chi nhánh..." />
                </td>
              </tr>
            )}

            {!isLoading && sortedProvinces.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyList content="Chưa có chi nhánh nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              sortedProvinces.map((province, index) => (
                <tr key={province.id}>
                  <td>{index + 1}</td>
                  <td>{province.code}</td>
                  <td className="font-medium">{province.name}</td>
                  <td>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        province.active !== false
                          ? 'bg-green-100 text-green-600'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {province.active !== false ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td>{province.movieTheaters?.length ?? 0}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleOpenModal(province)}
                      >
                        <CiEdit size={24} fill="orange" />
                      </button>
                      <button
                        type="button"
                        className="hover:cursor-pointer"
                        onClick={() => handleDelete(province)}
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

export default ProvincePage;
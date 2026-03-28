import {
  deleteParticipant,
  extractParticipantList,
  findAll,
} from '@apis/participantService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import ParticipantFormModal from '@component/admin/participant/ParticipantFormModal';
import EmptyList from '@component/cinema_showtime/EmptyList';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'react-toastify';

const resolveAvatarSrc = (avatar) => {
  if (!avatar) {
    return '';
  }

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  return `${import.meta.env.VITE_STORAGES}/${avatar}`;
};

const resolveGenderLabel = (gender) => {
  switch (gender) {
    case 'MALE':
      return 'Nam';
    case 'FEMALE':
      return 'Nữ';
    case 'OTHER':
      return 'Khác';
    default:
      return gender || 'Chưa cập nhật';
  }
};

const ParticipantPage = () => {
  const { openPopup } = useModelContext();
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchParticipants = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await findAll();
      setParticipants(extractParticipantList(response));
    } catch {
      toast.error('Không thể tải danh sách người tham gia!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Quản lý người tham gia - POLY CINEMAS';
    fetchParticipants();
  }, [fetchParticipants]);

  const handleOpenModal = (participant = null) => {
    openPopup(
      <ParticipantFormModal participant={participant} onSuccess={fetchParticipants} />
    );
  };

  const handleDelete = async (participant) => {
    const participantId = participant?.participantId ?? participant?.id;
    const participantName =
      participant?.nickname || participant?.birthName || `#${participantId}`;
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa người tham gia "${participantName}" không?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteParticipant(participantId);
      toast.success('Xóa người tham gia thành công!');
      await fetchParticipants();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error('Xóa người tham gia thất bại!');
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Quản lý người tham gia',
          },
        ]}
        title="Quản lý người tham gia"
      />

      <div className="mx-5 mt-3 overflow-auto rounded-sm bg-white px-4 py-3">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-lg font-semibold">Danh sách người tham gia</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tạo danh mục diễn viên, đạo diễn hoặc nhân sự để gán vào từng bộ phim.
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
              <th className="w-[14%] min-w-[120px]">Ảnh</th>
              <th className="w-[20%] min-w-[180px]">Tên thật</th>
              <th className="w-[18%] min-w-[160px]">Nghệ danh</th>
              <th className="w-[12%] min-w-[110px]">Giới tính</th>
              <th className="w-[16%] min-w-[140px]">Quốc tịch</th>
              <th className="w-[12%] min-w-[120px]">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7}>
                  <Loading content="Đang tải danh sách người tham gia..." />
                </td>
              </tr>
            )}

            {!isLoading && participants.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyList content="Chưa có người tham gia nào" />
                </td>
              </tr>
            )}

            {!isLoading &&
              participants.map((participant, index) => {
                const participantId = participant?.participantId ?? participant?.id;

                return (
                  <tr key={participantId}>
                    <td>{index + 1}</td>
                    <td>
                      <ImageComponent
                        src={resolveAvatarSrc(participant?.avatar)}
                        width={72}
                        height={96}
                        className="h-24 w-[72px] rounded object-cover"
                      />
                    </td>
                    <td className="font-medium">{participant?.birthName || 'Chưa có tên'}</td>
                    <td>{participant?.nickname || 'Chưa có nghệ danh'}</td>
                    <td>{resolveGenderLabel(participant?.gender)}</td>
                    <td>{participant?.nationality || 'Chưa cập nhật'}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => handleOpenModal(participant)}
                        >
                          <CiEdit size={24} fill="orange" />
                        </button>
                        <button
                          type="button"
                          className="hover:cursor-pointer"
                          onClick={() => handleDelete(participant)}
                        >
                          <MdOutlineDeleteSweep size={24} fill="red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantPage;

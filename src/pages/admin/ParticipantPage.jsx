import {
  deleteParticipant,
  extractParticipantList,
  findAll,
} from '@apis/participantService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DataGridTable from '@component/DataGridTable';
import ParticipantFormModal from '@component/admin/participant/ParticipantFormModal';
import ImageComponent from '@component/ImageComponent';
import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { MdOutlineDeleteSweep } from 'react-icons/md';
import { toast } from 'sonner';

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

  const rows = useMemo(
    () =>
      participants.map((participant, index) => ({
        ...participant,
        gridIndex: index + 1,
      })),
    [participants]
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
        field: 'avatar',
        headerName: 'Ảnh',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <div className="py-2">
            <ImageComponent
              src={resolveAvatarSrc(params.row?.avatar)}
              width={72}
              height={96}
              className="h-24 w-[72px] rounded object-cover"
            />
          </div>
        ),
      },
      {
        field: 'birthName',
        headerName: 'Tên thật',
        flex: 1,
        minWidth: 220,
        renderCell: (params) => (
          <span className="font-medium">{params.value || 'Chưa có tên'}</span>
        ),
      },
      {
        field: 'nickname',
        headerName: 'Nghệ danh',
        flex: 1,
        minWidth: 200,
        renderCell: (params) => params.value || 'Chưa có nghệ danh',
      },
      {
        field: 'gender',
        headerName: 'Giới tính',
        width: 140,
        renderCell: (params) => resolveGenderLabel(params.value),
      },
      {
        field: 'nationality',
        headerName: 'Quốc tịch',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => params.value || 'Chưa cập nhật',
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
        items={[
          {
            label: 'Quản lý người tham gia',
          },
        ]}
        title="Quản lý người tham gia"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-3">
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

        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          hideFooter
          minWidth={1080}
          getRowId={(row) => row?.participantId ?? row?.id}
          loadingContent="Đang tải danh sách người tham gia..."
          emptyContent="Chưa có người tham gia nào"
        />
      </div>
    </div>
  );
};

export default ParticipantPage;

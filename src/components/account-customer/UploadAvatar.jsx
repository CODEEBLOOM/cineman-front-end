import ImageComponent from '@component/ImageComponent';
import { Button } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UploadAvatar = ({ setAvatar, avatar = '' }) => {
  const { accessToken } = useSelector((state) => state.auth);
  // Hàm xử lý sự kiện khi người dùng chọn file
  // Ở đây bạn có thể thêm logic để xử lý file tải lên, ví dụ: gửi file lên server hoặc hiển thị xem trước ảnh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    axios
      .post(`${import.meta.env.VITE_HOST}/files/photo/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAvatar(res.data.data);
        event.target.value = '';
        // setAvatar(res.data);
      });
  };
  return (
    <div className="flex items-center gap-4">
      <ImageComponent
        src={avatar ? `${import.meta.env.VITE_STORAGES}/${avatar}` : ''}
        alt="Avatar"
        className="h-[225px] w-[150px] border-2 border-gray-300 object-cover"
        width={150}
        height={225}
      />
      <Button variant="contained" color="warning" component="label">
        Tải ảnh đại diện
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
          multiple={false}
        />
      </Button>
    </div>
  );
};
export default UploadAvatar;

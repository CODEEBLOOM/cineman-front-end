import ImageComponent from '@component/ImageComponent';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const UploadAvatar = () => {
  const { user } = useSelector((state) => state.user);

  // Hàm xử lý sự kiện khi người dùng chọn file
  // Ở đây bạn có thể thêm logic để xử lý file tải lên, ví dụ: gửi file lên server hoặc hiển thị xem trước ảnh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Xử lý file tải lên ở đây
    console.log(file);
  };
  return (
    <div className="flex items-center gap-4">
      <ImageComponent
        src={user.avatar || '/images/default-avatar.png'}
        alt="Avatar"
        className="border-2 border-gray-300 object-cover"
        width={150}
        height={150}
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

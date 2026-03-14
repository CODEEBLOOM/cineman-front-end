import CustomSelect from '@component/form_field/CustomSelect';
import TextAreaInput from '@component/form_field/TextAreaInput';
import TextInput from '@component/form_field/TextInput';
import FormField from '@component/FormField';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import MulSelect from '@component/form_field/MulSelect';
import DateFormatter from '@utils/DateFormatter';
import { getAllGenre } from '@apis/genreService';
import { addMovie, updateMovie } from '@apis/movieService';
import { toast } from 'react-toastify';

const FormMovie = ({ editingMovie, setEditingMovie }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const [posterImage, setPosterImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const formSchema = yup.object().shape({
    title: yup
      .string()
      .required('Tiêu đề phim không được để trống!')
      .max(100, 'Tiêu đề phim phải nhỏ hơn 100 ký tự!'),

    synopsis: yup
      .string()
      .required('Tóm tắt phim không được để trống!')
      .max(250, 'Tóm tắt phim phải nhỏ hơn 250 ký tự!'),

    detailDescription: yup
      .string()
      .required('Mô tả chi tiết phim không được để trống!'),

    releaseDate: yup
      .date()
      .typeError('Ngày khởi chiếu phải là ngày hợp lệ!')
      .required('Ngày khởi chiếu không được để trống!'),

    endDate: yup
      .date()
      .typeError('Ngày kết thúc phải là ngày hợp lệ!')
      .required('Ngày kết thúc không được để trống!')
      .min(yup.ref('releaseDate'), 'Ngày kết thúc phải sau ngày khởi chiếu!'),

    language: yup.string().required('Ngôn ngữ phim không được để trống!'),

    duration: yup
      .number()
      .typeError('Thời lượng phim phải là số!')
      .required('Thời lượng phim không được để trống!')
      .min(1, 'Thời lượng phim phải lớn hơn 1 phút!'),

    age: yup
      .number()
      .typeError('Độ tuổi phải là số!')
      .required('Giới hạn độ tuổi không được để trống!')
      .min(0, 'Độ tuổi phải từ 0 đến 100!')
      .max(100, 'Độ tuổi phải từ 0 đến 100!'),

    status: yup
      .string()
      .required('Trạng thái phim không được để trống!')
      .oneOf(['SC', 'DC', 'NC', 'DB', 'CNS'], 'Trạng thái phim không hợp lệ!'),

    genres: yup
      .array()
      .of(yup.number().typeError('Thể loại phim phải là số!'))
      .min(1, 'Phim phải có ít nhất một thể loại!')
      .required('Thể loại phim không được để trống!'),

    trailerLink: yup
      .string()
      .required('Link trailer không được để trống!')
      .url('Định dạng link trailer không hợp lệ!'),

    posterImage: yup.string().required('Ảnh poster không được để trống!'),

    bannerImage: yup.string().required('Ảnh banner không được để trống!'),
  });
  const {
    control,
    handleSubmit: handleSubmitForm,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      title: '',
      synopsis: '',
      detailDescription: '',
      releaseDate: new DateFormatter().format('YYYY-MM-DD'),
      endDate: new DateFormatter().format('YYYY-MM-DD'),
      language: 'Vietnamese',
      duration: 60,
      age: 13,
      trailerLink: '',
      posterImage: posterImage || '',
      bannerImage: bannerImage || '',
      genres: [],
    },
  });

  const onSubmit = (value) => {
    if (editingMovie) {
      updateMovie({ ...value, movieId: editingMovie.movieId })
        .then((res) => {
          toast.success('Cập nhật thông tin phim thành công');
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 404) {
            return toast.error(err.response.data.message);
          }
          toast.error('Cập nhât thông tin bộ phim thất bại !');
        });
    } else {
      addMovie(value)
        .then((res) => {
          toast.success('Thêm mới bộ phim thành công');
          resetForm();
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 404) {
            return toast.error(err.response.data.message);
          }
          toast.error('Thêm bộ phim thất bại !');
        });
    }
  };

  const status = [
    { label: 'Sắp chiếu', value: 'SC' },
    { label: 'Đang chiếu', value: 'DC' },
    { label: 'Ngưng chiếu', value: 'NC' },
    { label: 'Đặc biệt', value: 'DB' },
    { label: 'Đã hủy', value: 'CNS' },
  ];

  const limitAges = [
    { label: 'Từ 13', value: 13 },
    { label: 'Từ 16', value: 16 },
    { label: 'Từ 18', value: 18 },
  ];

  // Hàm xử lý sự kiện khi người dùng chọn file
  // Ở đây bạn có thể thêm logic để xử lý file tải lên, ví dụ: gửi file lên server hoặc hiển thị xem trước ảnh
  const handleUploadPoster = (event) => {
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
        const url = `${import.meta.env.VITE_STORAGES}/${res.data.data}`;
        setPosterImage(url);
        setValue('posterImage', url, {
          shouldDirty: true,
          shouldValidate: true,
        });
        event.target.value = '';
        // setAvatar(res.data);
      });
  };

  const handleUploadBanner = (event) => {
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
        const url = `${import.meta.env.VITE_STORAGES}/${res.data.data}`;
        setBannerImage(url);
        setValue('bannerImage', url, {
          shouldDirty: true,
          shouldValidate: true,
        });
        event.target.value = '';
      });
  };

  const [listGenre, setListGenre] = useState([]);

  // Hàm load thông tin lần đầu //
  useEffect(() => {
    getAllGenre()
      .then((res) => {
        if (res && res.data) {
          // setListGenre(res.data);
          const genre = res.data.map((item) => ({
            value: item.genresId,
            label: item.name,
          }));
          setListGenre(genre);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (editingMovie) {
      convertData(editingMovie);
    }
  }, [editingMovie]);
  const convertData = (movie) => {
    const genres = movie.genres.map((genre) => genre.genresId);
    resetForm({
      title: editingMovie.title || '',
      synopsis: editingMovie.synopsis || '',
      detailDescription: editingMovie.detailDescription || '',
      releaseDate:
        new DateFormatter(editingMovie.releaseDate).format('YYYY-MM-DD') || '',
      endDate:
        new DateFormatter(editingMovie.endDate).format('YYYY-MM-DD') || '',
      language: editingMovie.language || 'Vietnamese',
      duration: Number(editingMovie.duration) || 60,
      age: Number(editingMovie.age) || 13,
      trailerLink: editingMovie.trailerLink || '',
      posterImage: editingMovie.posterImage || '',
      bannerImage: editingMovie.bannerImage || '',
      status: mapStatus(editingMovie.status),
      genres: genres,
    });
    setPosterImage(editingMovie.posterImage || '');
    setBannerImage(editingMovie.bannerImage || '');
  };

  const mapStatus = (statusText) => {
    // Nếu API trả về đúng code thì giữ nguyên
    if (['SC', 'DC', 'NC', 'DB', 'CNS'].includes(statusText)) {
      return statusText;
    }

    // Nếu trả về tiếng Việt thì map về code
    switch (statusText) {
      case 'Sắp chiếu':
        return 'SC';
      case 'Đang chiếu':
        return 'DC';
      case 'Ngưng chiếu':
        return 'NC';
      case 'Đặc biệt':
        return 'DB';
      case 'Đã hủy':
        return 'CNS';
      default:
        return ''; // fallback để không bị warning
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmitForm(onSubmit)}>
        <FormField
          name="title"
          require={true}
          label="Tên phim"
          control={control}
          Component={TextInput}
          type="text"
          placeHolder="Nhập tên phim"
          error={errors['title']}
        />
        <div className="grid grid-cols-3 gap-3">
          <FormField
            disabled={
              editingMovie?.status === 'DC' || editingMovie?.status === 'DB'
            }
            name="releaseDate"
            require={true}
            label="Ngày khởi chiếu"
            control={control}
            Component={TextInput}
            type="date"
            error={errors['releaseDate']}
          />
          <FormField
            name="endDate"
            disabled={
              editingMovie?.status === 'DC' || editingMovie?.status === 'DB'
            }
            require={true}
            label="Ngày kết thúc"
            control={control}
            Component={TextInput}
            type="date"
            error={errors['endDate']}
          />
          <FormField
            name="duration"
            require={true}
            label="Thời lượng"
            control={control}
            Component={TextInput}
            type="number"
            placeHolder={'Nhập thời lượng'}
            error={errors['duration']}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex w-full">
            <div className="flex-1">
              <FormField
                name="status"
                disabled={
                  editingMovie?.status === 'DC' || editingMovie?.status === 'DB'
                }
                require={true}
                label="Trạng thái phim"
                control={control}
                options={status}
                Component={CustomSelect}
                type="text"
                placeHolder="Chọn trạng thái phim"
                error={errors['status']}
              />
            </div>
          </div>
          <FormField
            name="age"
            require={true}
            label="Giới hạn độ tuổi"
            control={control}
            Component={CustomSelect}
            options={limitAges}
            type="number"
            placeHolder="Giới hạn độ tuổi"
            error={errors['age']}
          />
          <FormField
            name="genres"
            require={true}
            label="Thể loại"
            control={control}
            Component={MulSelect}
            options={listGenre}
            type="number"
            placeHolder="Giới hạn độ tuổi"
            error={errors['age']}
          />
        </div>
        <div>
          <FormField
            name="language"
            require={true}
            label="Ngôn ngữ"
            control={control}
            Component={TextInput}
            type="text"
            placeHolder="vietnam"
            error={errors['version']}
          />
        </div>
        <div>
          <FormField
            name="trailerLink"
            require={true}
            label="Đường dẫn video trailer"
            control={control}
            Component={TextInput}
            type="text"
            placeHolder="https://www.youtube.com/"
            error={errors['version']}
          />
        </div>
        <FormField
          name="synopsis"
          require={true}
          label="Tóm tắt"
          control={control}
          Component={TextAreaInput}
          rows={2}
          maxRows={4}
          type="text"
          placeHolder="Nhập tóm tắt bộ phim"
          error={errors['synopsis']}
        />
        <FormField
          name="detailDescription"
          require={true}
          label="Mô tả bộ phim"
          control={control}
          Component={TextAreaInput}
          rows={4}
          maxRows={6}
          type="text"
          placeHolder="Mô tả phim"
          error={errors['detailDescription']}
        />
        <div className="grid items-end gap-3">
          <div className="col-span-12">
            <FormField
              name="posterImage"
              require={true}
              label="Ảnh poster"
              control={control}
              Component={TextInput}
              value={posterImage}
              type="text"
              disabled
              inputProps={{ readOnly: true }}
              placeHolder="Ảnh poster"
              error={errors['posterImage']}
            />
          </div>
          <Button
            variant="contained"
            color="warning"
            component="label"
            className="col-span-1 !mb-3 !mt-auto h-10 w-full"
          >
            Tải ảnh poster
            <input
              type="file"
              hidden
              onChange={handleUploadPoster}
              accept="image/*"
              multiple={false}
            />
          </Button>
        </div>
        <div className="grid items-end gap-3">
          <div className="col-span-12">
            <FormField
              name="bannerImage"
              require={true}
              label="Ảnh banner"
              control={control}
              Component={TextInput}
              value={bannerImage}
              type="text"
              placeHolder="Ảnh banner"
              disabled
              error={errors['bannerImage']}
            />
          </div>
          <Button
            variant="contained"
            color="warning"
            component="label"
            className="col-span-1 !mb-3 !mt-auto h-10 w-full"
          >
            Tải ảnh banner
            <input
              type="file"
              hidden
              onChange={handleUploadBanner}
              accept="image/*"
              multiple={false}
            />
          </Button>
        </div>
        <div className="flex justify-center gap-2 border-t-2 pt-3">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!!editingMovie}
          >
            Tạo mới
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="warning"
            disabled={!editingMovie}
          >
            Cập nhật
          </Button>
          <Button
            variant="outlined"
            color="info"
            onClick={() => {
              resetForm({
                title: '',
                synopsis: '',
                detailDescription: '',
                releaseDate: new DateFormatter().format('YYYY-MM-DD'),
                endDate: new DateFormatter().format('YYYY-MM-DD'),
                language: 'Vietnamese',
                duration: 60,
                age: 13,
                status: 'SC',
                trailerLink: '',
                posterImage: '',
                bannerImage: '',
                genres: [],
              });
              setBannerImage('');
              setPosterImage('');
              setEditingMovie(null);
            }}
          >
            Làm mới
          </Button>
        </div>
      </form>
    </div>
  );
};
export default FormMovie;

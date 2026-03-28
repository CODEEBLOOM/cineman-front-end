import { getSeatMap, published } from '@apis/cinemaTheaterService';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import DoubleSeat from '@component/seat/DoubleSeat';
import RegularSeat from '@component/seat/RegularSeat';
import VIPSeat from '@component/seat/VIPSeat';
import { useModelContext } from '@context/ModalContext';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import PublishRounded from '@mui/icons-material/PublishRounded';
import TheatersRounded from '@mui/icons-material/TheatersRounded';
import WarningAmberRounded from '@mui/icons-material/WarningAmberRounded';
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SeatGrid from './SeatGrid';

const panelSx = {
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
  p: { xs: 2.5, md: 3 },
};

const legendSeatWrapperSx = {
  minWidth: 78,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const colorTokenSx = (backgroundColor, borderColor) => ({
  width: 36,
  height: 36,
  borderRadius: 2,
  backgroundColor,
  border: '1px solid',
  borderColor,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
});

const SeatMap = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { openPopup, closeTopModal } = useModelContext();
  const [seats, setSeats] = useState([]);
  const [cinemaTheater, setCinemaTheater] = useState({});

  const fetchSeatMap = useCallback(() => {
    getSeatMap(id)
      .then((res) => {
        const { seats, ...restData } = res.data;
        setSeats(seats);
        setCinemaTheater(restData);
      })
      .catch((error) => console.log(error));
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchSeatMap();
  }, [fetchSeatMap]);

  const handlePublishedCinemaTheater = useCallback(() => {
    published(id)
      .then(() => {
        fetchSeatMap();
      })
      .catch((error) => console.log(error))
      .finally(() => closeTopModal());
  }, [closeTopModal, fetchSeatMap, id]);

  const seatStats = useMemo(() => {
    const activeSeats = seats.filter((seat) => seat.status !== 'INACTIVE').length;
    const inactiveSeats = seats.filter((seat) => seat.status === 'INACTIVE').length;

    return {
      total: seats.length,
      active: activeSeats,
      inactive: inactiveSeats,
    };
  }, [seats]);

  const typeLegendItems = [
    {
      key: 'regular',
      label: 'Ghế thường',
      description: 'Khu vực tiêu chuẩn cho đa số vị trí ngồi.',
      visual: <RegularSeat size="42px" color="#b8c1cc" />,
    },
    {
      key: 'vip',
      label: 'Ghế VIP',
      description: 'Dùng cho các hàng ghế ưu tiên hoặc có giá cao hơn.',
      visual: <VIPSeat size="42px" color="#a8b4c4" />,
    },
    {
      key: 'double',
      label: 'Ghế đôi',
      description: 'Chiếm hai cột ghế liền nhau trong sơ đồ.',
      visual: <DoubleSeat size="48px" color="#b8bcb5" />,
    },
  ];

  const draftColorLegendItems = [
    {
      key: 'regular-color',
      label: 'Màu nền ghế thường',
      description: 'Hiển thị khi đang chỉnh sửa sơ đồ.',
      visual: <Box sx={colorTokenSx('#f7f4ec', '#e7dbc2')} />,
    },
    {
      key: 'vip-color',
      label: 'Màu nền ghế VIP',
      description: 'Sắc xanh nhẹ để phân biệt nhóm ghế.',
      visual: <Box sx={colorTokenSx('#f4f8fd', '#d7e2ef')} />,
    },
    {
      key: 'double-color',
      label: 'Màu nền ghế đôi',
      description: 'Tông ấm hơn để dễ nhận biết khối ghế đôi.',
      visual: <Box sx={colorTokenSx('#f9f1f3', '#ebd4da')} />,
    },
  ];

  const publishedStatusLegendItems = [
    {
      key: 'active',
      label: 'Hoạt động',
      description: 'Ghế khả dụng để mở bán suất chiếu.',
      visual: (
        <Box sx={legendSeatWrapperSx}>
          <RegularSeat size="42px" color="#b8c1cc" />
        </Box>
      ),
    },
    {
      key: 'inactive',
      label: 'Ngừng hoạt động',
      description: 'Hiển thị dấu chéo đỏ trên ghế đã bị khoá.',
      visual: (
        <Box sx={{ ...legendSeatWrapperSx, position: 'relative' }}>
          <RegularSeat size="42px" color="#b8c1cc" />
          <CloseRounded
            sx={{
              position: 'absolute',
              color: 'error.main',
              fontSize: 28,
            }}
          />
        </Box>
      ),
    },
  ];

  const renderPopupConfirm = () => (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '100%', sm: 420 },
        borderRadius: 3,
        p: 3,
      }}
    >
      <Stack spacing={2.5} alignItems="center" textAlign="center">
        <WarningAmberRounded sx={{ fontSize: 58, color: 'warning.main' }} />
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Xác nhận xuất bản
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Khi xuất bản, bạn sẽ không thể thay đổi bố cục sơ đồ ghế nữa.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} width="100%">
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={handlePublishedCinemaTheater}
          >
            Xác nhận
          </Button>
          <Button fullWidth variant="outlined" color="inherit" onClick={closeTopModal}>
            Hủy bỏ
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );

  const renderLegendSection = (title, subtitle, items) => (
    <Paper sx={panelSx}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.75}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Divider />
        <List disablePadding>
          {items.map((item, index) => (
            <Box key={item.key}>
              <ListItem
                disableGutters
                sx={{
                  py: 1.25,
                  gap: 2,
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary={item.label}
                  secondary={item.description}
                  primaryTypographyProps={{ fontWeight: 600 }}
                  secondaryTypographyProps={{ sx: { mt: 0.4 } }}
                />
                <Box sx={legendSeatWrapperSx}>{item.visual}</Box>
              </ListItem>
              {index < items.length - 1 && <Divider component="li" />}
            </Box>
          ))}
        </List>
      </Stack>
    </Paper>
  );

  return (
    <>
      <CustomBreadcrumb
        className="mb-4"
        items={[{ label: 'Sơ đồ phòng chiếu' }]}
        title="Quản lý sơ đồ phòng chiếu"
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 360px' },
        }}
      >
        <Paper sx={panelSx}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <TheatersRounded color="action" />
                  <Typography variant="h6" fontWeight={700}>
                    Sơ đồ ghế
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" mt={0.75}>
                  Theo dõi bố cục ghế, loại ghế và trạng thái hoạt động ngay trên một màn hình.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`${seatStats.total} ghế đã tạo`}
                  color="default"
                  variant="outlined"
                />
                <Chip label={`${seatStats.active} hoạt động`} color="success" variant="outlined" />
                <Chip
                  label={`${seatStats.inactive} ngừng hoạt động`}
                  color="error"
                  variant="outlined"
                />
              </Stack>
            </Stack>
            <Divider />
            <SeatGrid
              seats={seats}
              cinemaTheater={cinemaTheater}
              fetchSeatMap={fetchSeatMap}
            />
          </Stack>
        </Paper>

        <Stack spacing={3}>
          <Paper sx={panelSx}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Cập nhật
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.75}>
                  Kiểm tra trạng thái phòng chiếu trước khi xuất bản sơ đồ ghế.
                </Typography>
              </Box>
              <Divider />
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái
                </Typography>
                <Chip
                  label={cinemaTheater?.status || 'DRAFT'}
                  color={cinemaTheater?.status === 'PUBLISHED' ? 'success' : 'warning'}
                  sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row', xl: 'column' }} spacing={1.5}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<ArrowBackRounded />}
                  onClick={() => navigate('/admin/phong-chieu')}
                >
                  Quay lại
                </Button>
                {cinemaTheater?.status !== 'PUBLISHED' && (
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PublishRounded />}
                    onClick={() => openPopup(renderPopupConfirm())}
                  >
                    Xuất bản
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>

          {renderLegendSection(
            'Chú thích loại ghế',
            'Dùng cùng một bộ icon để dễ đối chiếu trực tiếp trên sơ đồ.',
            typeLegendItems
          )}

          {cinemaTheater?.status !== 'PUBLISHED'
            ? renderLegendSection(
                'Chú thích màu khi chỉnh sửa',
                'Các ô nền giúp phân biệt loại ghế trong giai đoạn cấu hình.',
                draftColorLegendItems
              )
            : renderLegendSection(
                'Chú thích trạng thái ghế',
                'Sau khi xuất bản, bạn chỉ còn thao tác bật hoặc tắt từng ghế.',
                publishedStatusLegendItems
              )}
        </Stack>
      </Box>
    </>
  );
};

export default SeatMap;

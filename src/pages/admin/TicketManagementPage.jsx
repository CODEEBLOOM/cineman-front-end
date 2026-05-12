import { findByQRCode } from '@apis/invoiceService';
import BookingSnack from '@component/admin/invoice/BookingSnack';
import RenderInvoice from '@component/admin/invoice/RenderInvoice';
import CustomBreadcrumb from '@component/CustomBreakcrumb';
import EmptyList from '@component/cinema_showtime/EmptyList';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import QRGenerator from '@component/QRGenerator';
import { currencyFormatter } from '@libs/Utils';
import { setSnacks } from '@redux/slices/invoiceASlide';
import DateFormatter from '@utils/DateFormatter';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import ConfirmationNumberRounded from '@mui/icons-material/ConfirmationNumberRounded';
import EventSeatRounded from '@mui/icons-material/EventSeatRounded';
import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import PhoneIphoneRounded from '@mui/icons-material/PhoneIphoneRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import QrCode2Rounded from '@mui/icons-material/QrCode2Rounded';
import ScheduleRounded from '@mui/icons-material/ScheduleRounded';
import TheatersRounded from '@mui/icons-material/TheatersRounded';
import AlternateEmailRounded from '@mui/icons-material/AlternateEmailRounded';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TfiTicket } from 'react-icons/tfi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

const STATUS_META = {
  USED: {
    label: 'Đã xuất vé',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    panelClassName: 'border-emerald-200 bg-emerald-50/80',
    dotClassName: 'bg-emerald-500',
    helperText: 'Vé này đã được in và xuất tại quầy.',
  },
  PAID: {
    label: 'Chờ xuất vé',
    badgeClassName: 'bg-amber-100 text-amber-800',
    panelClassName: 'border-amber-200 bg-amber-50/80',
    dotClassName: 'bg-amber-500',
    helperText: 'Kiểm tra thông tin và in vé khi khách đến nhận.',
  },
};

const SEAT_TYPE_META = {
  REGULAR: {
    label: 'Ghế thường',
    toneClassName: 'bg-slate-100 text-slate-700',
  },
  VIP: {
    label: 'Ghế VIP',
    toneClassName: 'bg-fuchsia-100 text-fuchsia-700',
  },
  DOUBLE: {
    label: 'Ghế đôi',
    toneClassName: 'bg-sky-100 text-sky-700',
  },
};

const resolveStatusMeta = (status) => STATUS_META[status] ?? STATUS_META.PAID;

const formatCurrencyValue = (value) => currencyFormatter(Number(value) || 0);

const formatDateValue = (value, pattern = 'DD/MM/YYYY') => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  try {
    return new DateFormatter(value).format(pattern);
  } catch {
    return value;
  }
};

const formatShowTimeRange = (showTime) => {
  if (!showTime?.startTime || !showTime?.endTime) {
    return 'Chua cap nhat';
  }

  return `${showTime.startTime} - ${showTime.endTime}`;
};

const InfoRow = ({ icon, label, value, valueClassName = '' }) => (
  <div className="flex items-start gap-3 rounded-[16px] bg-slate-50 px-4 py-3">
    <div className="mt-0.5 text-slate-500">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 break-words text-[15px] font-medium text-slate-800 ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  </div>
);

const SummaryMetric = ({ label, value, helper, accentClassName }) => (
  <div className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {label}
    </p>
    <p className={`mt-3 text-2xl font-black tracking-tight ${accentClassName}`}>
      {value}
    </p>
    <p className="mt-2 text-sm text-slate-500">{helper}</p>
  </div>
);

const DetailSection = ({ eyebrow, title, description, children }) => (
  <section className="rounded-[16px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
    <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
    <div className="pt-5">{children}</div>
  </section>
);

const TicketManagementPage = () => {
  const dispatch = useDispatch();
  const { qrCode } = useParams();
  const [invoiceDetail, setInvoiceDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoiceDetail = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await findByQRCode(qrCode);
      const nextInvoice = res?.data ?? {};
      setInvoiceDetail(nextInvoice);

      const mappedSnacks = Array.isArray(nextInvoice?.detailBookingSnacks)
        ? nextInvoice.detailBookingSnacks.map((snackItem) => ({
            ...snackItem.snack,
            quantity: snackItem.totalSnack,
          }))
        : [];

      dispatch(setSnacks(mappedSnacks));
    } catch (error) {
      console.log(error);
      setInvoiceDetail({});
      dispatch(setSnacks([]));
      toast.error('Không thể tải thông tin vé!');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, qrCode]);

  useEffect(() => {
    document.title = 'Quản lý xuất vé - POLY CINEMAS';
    fetchInvoiceDetail();
  }, [fetchInvoiceDetail]);

  const statusMeta = useMemo(
    () => resolveStatusMeta(invoiceDetail?.status),
    [invoiceDetail?.status]
  );

  const ticketGroups = useMemo(() => {
    const grouped = {
      REGULAR: [],
      VIP: [],
      DOUBLE: [],
    };

    (invoiceDetail?.tickets || []).forEach((ticket) => {
      const seatTypeId = ticket?.seat?.seatType?.id;
      const seatLabel = ticket?.seat?.label;

      if (seatTypeId && seatLabel && grouped[seatTypeId]) {
        grouped[seatTypeId].push(seatLabel);
      }
    });

    return Object.entries(grouped)
      .map(([type, seats]) => ({
        type,
        seats,
        ...SEAT_TYPE_META[type],
      }))
      .filter((group) => group.seats.length > 0);
  }, [invoiceDetail?.tickets]);

  const snackItems = useMemo(
    () =>
      Array.isArray(invoiceDetail?.detailBookingSnacks)
        ? invoiceDetail.detailBookingSnacks
        : [],
    [invoiceDetail?.detailBookingSnacks]
  );

  const ticketCount = useMemo(
    () =>
      Array.isArray(invoiceDetail?.tickets) ? invoiceDetail.tickets.length : 0,
    [invoiceDetail?.tickets]
  );

  const snackCount = useMemo(
    () =>
      snackItems.reduce(
        (total, item) => total + (Number(item?.totalSnack) || 0),
        0
      ),
    [snackItems]
  );

  const customerInfo = invoiceDetail?.customer ?? invoiceDetail?.staff ?? {};
  const customerName =
    customerInfo?.fullName ||
    customerInfo?.name ||
    invoiceDetail?.customerName ||
    'Chưa cập nhật';
  const customerEmail =
    customerInfo?.email || invoiceDetail?.email || 'Chưa cập nhật';
  const customerPhone =
    customerInfo?.phoneNumber || invoiceDetail?.phoneNumber || 'Chưa cập nhật';
  const audienceType = invoiceDetail?.customer
    ? 'Khách hàng'
    : invoiceDetail?.staff
      ? 'Nhân viên'
      : 'Khách lẻ';

  const movieTitle = invoiceDetail?.movie?.title || 'Chưa có tên phim';
  const posterImage = invoiceDetail?.movie?.posterImage || '';
  const movieAge = Number(invoiceDetail?.movie?.age) || 0;
  const movieTheaterName =
    invoiceDetail?.movieTheater?.name ||
    invoiceDetail?.movieTheater?.title ||
    'Chưa cập nhật';
  const cinemaTheaterName =
    invoiceDetail?.cinemaTheater?.name || 'Chưa cập nhật';
  const bookingTime = formatDateValue(
    invoiceDetail?.createdAt,
    'HH:mm DD/MM/YYYY'
  );
  const showDate = formatDateValue(invoiceDetail?.showTime?.showDate);
  const showTimeRange = formatShowTimeRange(invoiceDetail?.showTime);

  return (
    <>
      <CustomBreadcrumb
        className="mb-4"
        linkComponent=""
        items={[
          {
            label: 'Xuat ve',
            icon: <TfiTicket fontSize="small" />,
          },
        ]}
        title="Quản lý xuất vé"
      />

      <div className="px-2 pb-6">
        <div className="relative overflow-hidden rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm md:px-6 md:py-6">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-sky-200/45 blur-3xl" />

          <div className="relative">
            {isLoading ? (
              <div className="flex min-h-[420px] items-center justify-center">
                <Loading content="Đang tải thông tin quản lý vé..." />
              </div>
            ) : !invoiceDetail?.id ? (
              <div className="rounded-[16px] border border-dashed border-slate-300 bg-white/80 px-6 py-16">
                <EmptyList content="Không tìm thấy thông tin vé" />
              </div>
            ) : (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                  <section className="rounded-[16px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <div className="mx-auto w-full max-w-[220px] xl:mx-0">
                        <div className="relative overflow-hidden rounded-[16px] border border-slate-200 bg-slate-100 shadow-[0_18px_40px_rgba(15,23,42,0.10)]">
                          <ImageComponent
                            src={posterImage}
                            alt={movieTitle}
                            width={235}
                            height={372}
                            className="aspect-[235/372] w-full object-cover"
                          />
                          <div className="bg-slate-950/88 absolute left-3 top-3 rounded-[16px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                            {movieAge > 0 ? `${movieAge}+` : 'P'}
                          </div>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-[16px] bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                                <ConfirmationNumberRounded
                                  sx={{ fontSize: 16, mr: 0.8 }}
                                />
                                {invoiceDetail?.code || qrCode}
                              </span>
                              <span
                                className={`inline-flex items-center rounded-[16px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusMeta.badgeClassName}`}
                              >
                                <span
                                  className={`mr-2 inline-block h-2.5 w-2.5 rounded-full ${statusMeta.dotClassName}`}
                                />
                                {statusMeta.label}
                              </span>
                            </div>

                            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                              Thông tin vé và combo
                            </p>
                            <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-slate-900 md:text-[38px]">
                              {movieTitle}
                            </h1>
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                              Tổng hợp suất chiếu, ghế đã đặt, combo đi kèm và
                              chi phí còn lại trong một bố cục để quét nhanh tại
                              quầy xuất vé.
                            </p>
                          </div>

                          <div className="rounded-[16px] bg-slate-950 px-4 py-4 text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] lg:min-w-[220px]">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                              Hành động
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/75">
                              In hóa đơn và cập nhật trạng thái xuất vé ngay tại
                              màn hình này.
                            </p>
                            <div className="mt-4">
                              <RenderInvoice invoiceDetail={invoiceDetail} />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                          <SummaryMetric
                            label="Tổng số ghế"
                            value={`${ticketCount} vé`}
                            helper="Tổng số ghế đang được giữ trong đơn."
                            accentClassName="text-slate-900"
                          />
                          <SummaryMetric
                            label="Tổng snack"
                            value={`${snackCount} món`}
                            helper="Bao gồm tất cả combo, bắp và nước đã chọn."
                            accentClassName="text-amber-700"
                          />
                          <SummaryMetric
                            label="Thời điểm đặt"
                            value={bookingTime}
                            helper="Mốc thời gian tạo hóa đơn để đối soát."
                            accentClassName="text-sky-700"
                          />
                          <SummaryMetric
                            label="Tổng thanh toán"
                            value={formatCurrencyValue(
                              invoiceDetail?.totalMoney
                            )}
                            helper="Số tiền còn lại cần thu hoặc đã thanh toán."
                            accentClassName="text-emerald-700"
                          />
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                          <div className="rounded-[16px] bg-slate-50 p-4">
                            <div className="mb-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Lịch chiếu
                              </p>
                              <h2 className="mt-1 text-lg font-bold text-slate-900">
                                Chi tiết suất chiếu
                              </h2>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <InfoRow
                                icon={<PlaceRounded sx={{ fontSize: 20 }} />}
                                label="Rạp chiếu"
                                value={movieTheaterName}
                              />
                              <InfoRow
                                icon={<TheatersRounded sx={{ fontSize: 20 }} />}
                                label="Phòng chiếu"
                                value={cinemaTheaterName}
                              />
                              <InfoRow
                                icon={<ScheduleRounded sx={{ fontSize: 20 }} />}
                                label="Ngày chiếu"
                                value={showDate}
                              />
                              <InfoRow
                                icon={
                                  <AccessTimeRounded sx={{ fontSize: 20 }} />
                                }
                                label="Khung giờ"
                                value={showTimeRange}
                              />
                            </div>
                          </div>

                          <div className="rounded-[16px] bg-slate-50 p-4">
                            <div className="mb-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Sơ đồ ghế
                              </p>
                              <h2 className="mt-1 text-lg font-bold text-slate-900">
                                Ghế đã chọn
                              </h2>
                            </div>

                            <div className="flex flex-col gap-3">
                              {ticketGroups.length > 0 ? (
                                ticketGroups.map((group) => (
                                  <div
                                    key={group.type}
                                    className="rounded-[16px] border border-slate-200 bg-white px-4 py-3"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span
                                        className={`inline-flex items-center rounded-[16px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${group.toneClassName}`}
                                      >
                                        <EventSeatRounded
                                          sx={{ fontSize: 16, mr: 0.8 }}
                                        />
                                        {group.label}
                                      </span>
                                      <span className="text-sm font-semibold text-slate-500">
                                        {group.seats.length} ghế
                                      </span>
                                    </div>
                                    <p className="mt-3 text-sm leading-6 text-slate-700">
                                      {group.seats.join(', ')}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-[16px] border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                                  Chưa có thông tin ghế.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <DetailSection
                    eyebrow="Combo hiện tại"
                    title="Danh sách snack đi kèm"
                    description="Kiểm tra nhanh các món đang có trong hóa đơn trước khi thao tác thêm hoặc hủy."
                  >
                    {snackItems.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {snackItems.map((snack) => (
                          <div
                            key={snack.id}
                            className="rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-4 transition-all duration-300 hover:border-slate-300 hover:bg-white"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-lg font-semibold text-slate-900">
                                  {snack?.snack?.snackName || 'Combo không tên'}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                  {snack?.snack?.description?.trim() ||
                                    'Snack đã được thêm vào hóa đơn hiện tại.'}
                                </p>
                              </div>
                              <span className="rounded-[16px] bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">
                                x{Number(snack?.totalSnack) || 0}
                              </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
                              <p className="text-sm text-slate-500">Đơn giá</p>
                              <p className="text-base font-semibold text-slate-900">
                                {formatCurrencyValue(snack?.snack?.unitPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
                        Hóa đơn này chưa có snack đi kèm.
                      </div>
                    )}
                  </DetailSection>

                  <BookingSnack
                    invoiceId={invoiceDetail?.id}
                    status={invoiceDetail?.status}
                    onUpdated={fetchInvoiceDetail}
                  />
                </div>

                <aside className="space-y-4 xl:sticky xl:self-start">
                  <section
                    className={`rounded-[16px] border p-5 shadow-sm ${statusMeta.panelClassName}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Mã QR vé
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                          Trạng thái xuất vé
                        </h2>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-[16px] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusMeta.badgeClassName}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {statusMeta.helperText}
                    </p>

                    <div className="mt-5 rounded-[16px] bg-white px-4 py-5 shadow-sm">
                      <div className="mb-4 flex items-center gap-2 text-slate-500">
                        <QrCode2Rounded sx={{ fontSize: 20 }} />
                        <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                          QR ticket
                        </span>
                      </div>
                      <QRGenerator text={qrCode} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-[16px] bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Số ghế
                        </p>
                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {ticketCount}
                        </p>
                      </div>
                      <div className="rounded-[16px] bg-white px-4 py-3 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Snack
                        </p>
                        <p className="mt-2 text-xl font-bold text-slate-900">
                          {snackCount}
                        </p>
                      </div>
                    </div>
                  </section>

                  <DetailSection
                    eyebrow="Người đặt vé"
                    title="Thông tin liên hệ"
                    description="Sử dụng thông tin này để xác minh người nhận vé tại quầy."
                  >
                    <div className="space-y-3">
                      <InfoRow
                        icon={<PersonRounded sx={{ fontSize: 20 }} />}
                        label="Họ tên"
                        value={customerName}
                      />
                      <InfoRow
                        icon={<AlternateEmailRounded sx={{ fontSize: 20 }} />}
                        label="Email"
                        value={customerEmail}
                        valueClassName="break-all"
                      />
                      <InfoRow
                        icon={<PhoneIphoneRounded sx={{ fontSize: 20 }} />}
                        label="Số điện thoại"
                        value={customerPhone}
                      />
                      <InfoRow
                        icon={<LocalOfferRounded sx={{ fontSize: 20 }} />}
                        label="Loại khách"
                        value={audienceType}
                      />
                    </div>
                  </DetailSection>

                  <DetailSection
                    eyebrow="Chi phí dự kiến"
                    title="Tổng hợp thanh toán"
                    description="Theo dõi chi tiết tiền vé, khuyến mãi, đổi điểm và snack trong đơn."
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-500">
                          Tiền vé
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrencyValue(invoiceDetail?.totalMoneyTicket)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-500">
                          Discount
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrencyValue(
                            invoiceDetail?.totalMoneyPromotion
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-500">
                          Đổi điểm
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrencyValue(
                            invoiceDetail?.totalMoneyDiscount
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-[16px] bg-slate-50 px-4 py-3">
                        <span className="text-sm font-medium text-slate-500">
                          Snack
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrencyValue(invoiceDetail?.totalMoneySnack)}
                        </span>
                      </div>

                      <div className="rounded-[16px] bg-slate-950 px-5 py-5 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                          Tổng tiền còn lại
                        </p>
                        <p className="mt-3 text-3xl font-black tracking-tight">
                          {formatCurrencyValue(invoiceDetail?.totalMoney)}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/70">
                          Bao gồm toàn bộ vé, snack và các khoản điều chỉnh áp
                          dụng cho hóa đơn.
                        </p>
                      </div>
                    </div>
                  </DetailSection>
                </aside>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketManagementPage;

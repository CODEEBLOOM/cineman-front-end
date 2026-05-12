import { clearMultiple, createMultiple } from '@apis/detailBookingSnack';
import { findAllSnacks } from '@apis/snackService';
import { getAllSnackType } from '@apis/snackType';
import ImageComponent from '@component/ImageComponent';
import Loading from '@component/Loading';
import { currencyFormatter } from '@libs/Utils';
import { setSnacks } from '@redux/slices/invoiceASlide';
import { Skeleton } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const resolveImageSrc = (image) => {
  if (!image) {
    return '/combo-online-03.png';
  }

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  return `${import.meta.env.VITE_STORAGES}/${image}`;
};

const normalizeSnack = (snack, fallbackType) => {
  const snackType = snack?.snackTypes ?? snack?.snackType ?? fallbackType ?? {};

  return {
    ...snack,
    snackTypeId: snack?.snackTypeId ?? snackType?.id ?? null,
    snackTypeName:
      snack?.snackTypeName ??
      snackType?.name ??
      (snackType?.id ? `Loại đồ ăn vặt #${snackType.id}` : 'Chưa phân loại'),
  };
};

const SnackCardSkeleton = () => (
  <div className="rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start gap-4">
      <Skeleton variant="rounded" width={88} height={88} sx={{ borderRadius: '16px', flexShrink: 0 }} />
      <div className="flex-1">
        <Skeleton variant="text" width="36%" height={24} />
        <Skeleton variant="text" width="72%" height={34} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="84%" height={24} />
      </div>
    </div>
    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
      <div className="w-full max-w-[120px]">
        <Skeleton variant="text" width="60%" height={22} />
        <Skeleton variant="text" width="100%" height={30} />
      </div>
      <Skeleton variant="rounded" width={120} height={42} sx={{ borderRadius: '16px' }} />
    </div>
  </div>
);

const BookingSnack = ({ invoiceId, status = 'SOLD', onUpdated }) => {
  const dispatch = useDispatch();
  const [combos, setCombos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackOptions, setSnackOptions] = useState([]);
  const [selectedSnackType, setSelectedSnackType] = useState(null);
  const { snacks } = useSelector((state) => state.invoiceASlice);

  const snackSelections = Array.isArray(snacks) ? snacks : [];
  const isLocked = status === 'USED';

  const getSelectedQuantity = (combo) =>
    snackSelections.find((item) => item.id === combo.id)?.quantity || 0;

  useEffect(() => {
    let isMounted = true;

    getAllSnackType()
      .then((res) => {
        if (!isMounted) {
          return;
        }

        const nextSnackOptions = (Array.isArray(res?.data) ? res.data : []).map((item) => ({
          value: item.id,
          label: item.name,
        }));

        setSnackOptions(nextSnackOptions);
        setSelectedSnackType(nextSnackOptions[0]?.value ?? null);
      })
      .catch((err) => {
        console.log(err);
        if (isMounted) {
          setSnackOptions([]);
          setSelectedSnackType(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!selectedSnackType) {
      setCombos([]);
      return () => {
        isMounted = false;
      };
    }

    setIsLoading(true);

    findAllSnacks(selectedSnackType)
      .then((res) => {
        if (!isMounted) {
          return;
        }

        const activeOption = snackOptions.find((option) => option.value === selectedSnackType);
        const nextCombos = (Array.isArray(res?.data) ? res.data : [])
          .map((item) => normalizeSnack(item, activeOption))
          .sort((left, right) =>
            (left?.snackName || '').localeCompare(right?.snackName || '', 'vi')
          );

        setCombos(nextCombos);
      })
      .catch((err) => {
        console.log(err);
        if (isMounted) {
          setCombos([]);
          toast.error('Không thể tải danh sách đồ ăn vặt!');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSnackType, snackOptions]);

  const selectedItems = useMemo(
    () => snackSelections.filter((item) => Number(item?.quantity) > 0),
    [snackSelections]
  );

  const selectedSnackCount = useMemo(
    () => selectedItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0),
    [selectedItems]
  );

  const selectedSnackAmount = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) =>
          total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [selectedItems]
  );

  const handleIncrease = (combo) => {
    const foundSnackSelected = snackSelections.find((item) => item.id === combo.id);

    if (!foundSnackSelected) {
      dispatch(
        setSnacks([
          ...snackSelections,
          {
            ...combo,
            quantity: 1,
          },
        ])
      );
      return;
    }

    dispatch(
      setSnacks(
        snackSelections.map((item) =>
          item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    );
  };

  const handleDecrease = (combo) => {
    const foundSnackSelected = snackSelections.find((item) => item.id === combo.id);

    if (!foundSnackSelected) {
      return;
    }

    if (Number(foundSnackSelected.quantity) <= 1) {
      dispatch(setSnacks(snackSelections.filter((item) => item.id !== combo.id)));
      return;
    }

    dispatch(
      setSnacks(
        snackSelections.map((item) =>
          item.id === combo.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      )
    );
  };

  const handleSaveCombo = async () => {
    if (!invoiceId) {
      return;
    }

    if (selectedItems.length === 0) {
      toast.info('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = selectedItems.map((item) => ({
        snackId: item.id,
        totalSnack: item.quantity,
        invoiceId,
      }));

      const res = await createMultiple(payload);

      if (res && (res.status === 200 || res.status === 201)) {
        toast.success('Cập nhật combo thành công!');
        await onUpdated?.();
        return;
      }

      toast.error('Cập nhật combo thất bại!');
    } catch (error) {
      console.log(error);
      toast.error('Cập nhật combo thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearCombo = async () => {
    if (!invoiceId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await clearMultiple(invoiceId);

      if (res && res.status === 200) {
        dispatch(setSnacks([]));
        toast.success('Đã hủy toàn bộ combo!');
        await onUpdated?.();
        return;
      }

      toast.error('Hủy combo thất bại!');
    } catch (error) {
      console.log(error);
      toast.error('Hủy combo thất bại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[16px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur md:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quản lý combo
          </p>
          <h2 className="mt-2 text-[24px] font-black tracking-tight text-slate-900">
            Thêm snack vào hóa đơn
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Chuyển khu vực này thành một quầy chọn nhanh để nhân viên thêm bắp, nước
            hoặc combo trực tiếp khi khách nhận vé.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[16px] bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Loại đang xem
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {snackOptions.find((option) => option.value === selectedSnackType)?.label ||
                'Chưa có loại'}
            </p>
          </div>
          <div className="rounded-[16px] bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Đã chọn
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">
              {selectedSnackCount} sản phẩm
            </p>
          </div>
          <div className="rounded-[16px] bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
              Tạm tính snack
            </p>
            <p className="mt-2 text-base font-semibold text-amber-900">
              {currencyFormatter(selectedSnackAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {snackOptions.length > 0 ? (
          snackOptions.map((option) => {
            const isActive = option.value === selectedSnackType;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedSnackType(option.value)}
                className={`rounded-[16px] px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            );
          })
        ) : (
          <div className="rounded-[16px] bg-slate-100 px-4 py-2 text-sm text-slate-500">
            Chưa có loại đồ ăn vặt
          </div>
        )}
      </div>

      {isLocked && (
        <div className="mt-5 rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          Vé đã xuất, vì vậy khu vực combo được khóa để đảm bảo đối soát chính xác.
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <SnackCardSkeleton key={`snack-skeleton-${index}`} />
            ))}
          </div>
        ) : combos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {combos.map((combo) => {
              const quantity = getSelectedQuantity(combo);

              return (
                <article
                  key={combo.id}
                  className="group flex h-full flex-col rounded-[16px] border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-[88px] w-[88px] overflow-hidden rounded-[16px] bg-slate-100">
                      <ImageComponent
                        src={resolveImageSrc(combo?.image)}
                        alt={combo?.snackName || 'Snack'}
                        width={88}
                        height={88}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-[16px] bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                          {combo?.snackTypeName || 'Snack'}
                        </span>
                        {quantity > 0 && (
                          <span className="rounded-[16px] bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                            Đã chọn {quantity}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900">
                        {combo?.snackName || 'Chưa có tên'}
                      </h3>
                      <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                        {combo?.description?.trim() || 'Sản phẩm bán kèm tại quầy xuất vé.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Đơn giá
                      </p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {currencyFormatter(combo?.unitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={isLocked}
                        className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-slate-200 bg-slate-100 text-slate-700 transition-all duration-300 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleDecrease(combo)}
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="inline-flex min-w-[46px] justify-center rounded-[16px] bg-slate-950 px-3 py-2 text-sm font-semibold text-white">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        disabled={isLocked}
                        className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-primary text-white transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={() => handleIncrease(combo)}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[16px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <p className="text-lg font-semibold text-slate-700">Chưa có snack trong nhóm này</p>
            <p className="mt-2 text-sm text-slate-500">
              Hãy chọn một loại khác hoặc kiểm tra lại dữ liệu sản phẩm.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-[16px] bg-slate-950 px-5 py-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-[16px] bg-white/8 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Số dòng đã chọn
              </p>
              <p className="mt-2 text-lg font-bold">{selectedItems.length} món</p>
            </div>
            <div className="rounded-[16px] bg-white/8 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Tổng số lượng
              </p>
              <p className="mt-2 text-lg font-bold">{selectedSnackCount} sản phẩm</p>
            </div>
            <div className="rounded-[16px] bg-white/8 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                Giá trị snack
              </p>
              <p className="mt-2 text-lg font-bold">{currencyFormatter(selectedSnackAmount)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isLocked || isSubmitting}
              onClick={handleSaveCombo}
              className="rounded-[16px] bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thêm combo'}
            </button>
            <button
              type="button"
              disabled={isLocked || isSubmitting}
              onClick={handleClearCombo}
              className="rounded-[16px] border border-white/20 bg-transparent px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy toàn bộ combo
            </button>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div className="mt-4 flex items-center justify-center">
          <Loading content="Đang cập nhật combo..." />
        </div>
      )}
    </section>
  );
};

export default BookingSnack;

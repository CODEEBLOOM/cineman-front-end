import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ImageComponent from '@component/ImageComponent';
import { findAllSnacks } from '@apis/snackService';
import { getAllSnackType } from '@apis/snackType';
import { setSnack } from '@redux/slices/snackSlice';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const resolveImageSrc = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image)) return image;
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
      (snackType?.id ? `Loại #${snackType.id}` : 'Khác'),
  };
};

const SnackCard = ({ snack, quantity, onIncrease, onDecrease }) => (
  <div className="flex gap-3 rounded-md border border-slate-200 bg-white p-3 shadow-sm transition hover:border-slate-300">
    <div className="h-[88px] w-[88px] flex-none overflow-hidden rounded-md border border-slate-200 bg-slate-100">
      <ImageComponent
        src={resolveImageSrc(snack.image)}
        width={88}
        height={88}
        className="h-full w-full object-cover"
      />
    </div>

    <div className="flex min-w-0 flex-1 flex-col">
      <p className="line-clamp-1 text-sm font-extrabold text-slate-900">
        {snack.snackName || 'Chưa có tên'}
      </p>
      <p className="mt-0.5 line-clamp-2 text-[12px] text-slate-500">
        {snack.description?.trim() || snack.snackTypeName || ''}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <p className="text-[15px] font-extrabold text-primary">
          {currencyFormatter.format(snack.unitPrice || 0)}đ
        </p>

        {quantity > 0 ? (
          <div className="flex flex-none items-center gap-1 overflow-hidden rounded-md border border-slate-200">
            <button
              type="button"
              onClick={onDecrease}
              className="flex h-7 w-7 flex-none items-center justify-center text-slate-700 transition hover:bg-slate-50"
              aria-label="Giảm"
            >
              <RemoveRoundedIcon sx={{ fontSize: 16 }} />
            </button>
            <span className="min-w-[20px] flex-none text-center text-sm font-bold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="flex h-7 w-7 flex-none items-center justify-center bg-primary text-white transition hover:bg-[#083d7c]"
              aria-label="Tăng"
            >
              <AddRoundedIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onIncrease}
            className="inline-flex h-7 flex-none items-center gap-1 rounded-md border border-primary px-2.5 text-[12px] font-bold text-primary transition hover:bg-primary hover:text-white"
          >
            <AddRoundedIcon sx={{ fontSize: 14 }} />
            Chọn
          </button>
        )}
      </div>
    </div>
  </div>
);

const SnackSection = () => {
  const dispatch = useDispatch();
  const { snackSelected } = useSelector((state) => state.snack);
  const snackItems = Array.isArray(snackSelected) ? snackSelected : [];

  const [snacks, setSnacks] = useState([]);
  const [snackTypes, setSnackTypes] = useState([]);
  const [activeTypeId, setActiveTypeId] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const typeRes = await getAllSnackType();
        const types = Array.isArray(typeRes?.data) ? typeRes.data : [];

        const results = await Promise.allSettled(
          types.map((t) => findAllSnacks(t.id))
        );

        const map = new Map();
        results.forEach((r, i) => {
          if (r.status !== 'fulfilled') return;
          const items = Array.isArray(r.value?.data) ? r.value.data : [];
          const fallback = types[i];
          items
            .map((item) => normalizeSnack(item, fallback))
            .filter((item) => item?.id && item?.isActive !== false)
            .forEach((item) => map.set(item.id, item));
        });

        if (!isMounted) return;
        setSnackTypes(types);
        setSnacks(Array.from(map.values()));
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setSnacks([]);
          toast.error('Không thể tải danh sách đồ ăn kèm');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSnacks = useMemo(() => {
    if (activeTypeId === 'ALL') return snacks;
    return snacks.filter((s) => String(s.snackTypeId) === String(activeTypeId));
  }, [snacks, activeTypeId]);

  const getQuantity = (snack) =>
    snackItems.find((item) => item.id === snack.id)?.quantity || 0;

  const handleIncrease = (snack) => {
    const found = snackItems.find((item) => item.id === snack.id);
    if (!found) {
      dispatch(setSnack([...snackItems, { ...snack, quantity: 1 }]));
      return;
    }
    dispatch(
      setSnack(
        snackItems.map((item) =>
          item.id === snack.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    );
  };

  const handleDecrease = (snack) => {
    const found = snackItems.find((item) => item.id === snack.id);
    if (!found) return;
    if (found.quantity <= 1) {
      dispatch(setSnack(snackItems.filter((item) => item.id !== snack.id)));
      return;
    }
    dispatch(
      setSnack(
        snackItems.map((item) =>
          item.id === snack.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      )
    );
  };

  const tabs = [
    { id: 'ALL', name: 'Tất cả' },
    ...snackTypes.map((t) => ({ id: String(t.id), name: t.name })),
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTypeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTypeId(tab.id)}
              className={`rounded-md border px-3 py-1.5 text-[13px] font-semibold transition ${
                isActive
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {isLoading ? (
          <div className="grid min-h-[180px] place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Đang tải danh sách đồ ăn kèm...
          </div>
        ) : filteredSnacks.length === 0 ? (
          <div className="grid min-h-[180px] place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Chưa có sản phẩm bán kèm nào
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredSnacks.map((snack) => (
              <SnackCard
                key={snack.id}
                snack={snack}
                quantity={getQuantity(snack)}
                onIncrease={() => handleIncrease(snack)}
                onDecrease={() => handleDecrease(snack)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SnackSection;

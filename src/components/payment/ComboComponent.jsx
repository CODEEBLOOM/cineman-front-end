import { findAllSnacks } from '@apis/snackService';
import { getAllSnackType } from '@apis/snackType';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';
import { currencyFormatter } from '@libs/Utils';
import { setSnack } from '@redux/slices/snackSlice';
import { useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const DEFAULT_PAGINATION_MODEL = {
  page: 0,
  pageSize: 5,
};

const resolveImageSrc = (image) => {
  if (!image) {
    return '';
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

const ComboComponent = () => {
  const dispatch = useDispatch();
  const [snacks, setSnacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState(
    DEFAULT_PAGINATION_MODEL
  );
  const { snackSelected } = useSelector((state) => state.snack);

  const snackItems = Array.isArray(snackSelected) ? snackSelected : [];

  useEffect(() => {
    let isMounted = true;

    const fetchSnacks = async () => {
      setIsLoading(true);

      try {
        const snackTypeResponse = await getAllSnackType();
        const snackTypes = Array.isArray(snackTypeResponse?.data)
          ? snackTypeResponse.data
          : [];

        const snackResults = await Promise.allSettled(
          snackTypes.map((snackType) => findAllSnacks(snackType.id))
        );

        const snackMap = new Map();

        snackResults.forEach((result, index) => {
          if (result.status !== 'fulfilled') {
            return;
          }

          const items = Array.isArray(result.value?.data) ? result.value.data : [];
          const fallbackType = snackTypes[index];

          items
            .map((item) => normalizeSnack(item, fallbackType))
            .filter((item) => item?.id && item?.isActive !== false)
            .forEach((item) => {
              snackMap.set(item.id, item);
            });
        });

        const nextSnacks = Array.from(snackMap.values()).sort((left, right) => {
          const typeCompare = (left.snackTypeName || '').localeCompare(
            right.snackTypeName || '',
            'vi'
          );

          if (typeCompare !== 0) {
            return typeCompare;
          }

          return (left.snackName || '').localeCompare(right.snackName || '', 'vi');
        });

        if (!isMounted) {
          return;
        }

        setSnacks(nextSnacks);
        setPaginationModel((prev) => ({
          ...prev,
          page: 0,
        }));

        if (
          snackResults.length > 0 &&
          snackResults.every((result) => result.status !== 'fulfilled')
        ) {
          toast.error('Không thể tải danh sách đồ ăn kèm!');
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.log(error);
        setSnacks([]);
        toast.error('Không thể tải danh sách đồ ăn kèm!');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSnacks();

    return () => {
      isMounted = false;
    };
  }, []);

  const getSelectedQuantity = (snack) =>
    snackItems.find((item) => item.id === snack.id)?.quantity || 0;

  const selectedSnackCount = useMemo(
    () => snackItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0),
    [snackItems]
  );

  const selectedSnackAmount = useMemo(
    () =>
      snackItems.reduce(
        (total, item) =>
          total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [snackItems]
  );

  const handleSelectCombo = (combo) => {
    const foundSnackSelected = snackItems.find((item) => item.id === combo.id);

    if (!foundSnackSelected) {
      dispatch(
        setSnack([
          ...snackItems,
          {
            ...combo,
            quantity: 1,
          },
        ])
      );
      return;
    }

    const updatedSnacks = snackItems.map((item) =>
      item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    dispatch(setSnack(updatedSnacks));
  };

  const handleRemoveCombo = (combo) => {
    const foundSnackSelected = snackItems.find((item) => item.id === combo.id);

    if (!foundSnackSelected) {
      return;
    }

    if (foundSnackSelected.quantity === 1) {
      dispatch(setSnack(snackItems.filter((item) => item.id !== combo.id)));
      return;
    }

    const updatedSnacks = snackItems.map((item) =>
      item.id === combo.id ? { ...item, quantity: item.quantity - 1 } : item
    );
    dispatch(setSnack(updatedSnacks));
  };

  const rows = useMemo(
    () =>
      snacks.map((item, index) => ({
        ...item,
        gridIndex: index + 1,
      })),
    [snacks]
  );

  const columns = [
    {
      field: 'gridIndex',
      headerName: 'STT',
      width: 80,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'image',
      headerName: 'Ảnh',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div className="py-2">
          <ImageComponent
            src={resolveImageSrc(params.row.image)}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-xl object-cover"
          />
        </div>
      ),
    },
    {
      field: 'snackName',
      headerName: 'Sản phẩm',
      minWidth: 240,
      flex: 1,
      renderCell: (params) => (
        <div className="py-2">
          <span className="font-semibold text-slate-800">
            {params.value || 'Chưa có tên'}
          </span>
          <div className="mt-1 text-[16px] font-semibold text-pink-500">
            {currencyFormatter(params.row.unitPrice)}
          </div>
        </div>
      ),
    },
    {
      field: 'snackTypeName',
      headerName: 'Loại',
      width: 160,
      renderCell: (params) => (
        <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {params.value}
        </span>
      ),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <p className="whitespace-normal break-words text-sm leading-6 text-slate-600">
          {params.value?.trim() || 'Chưa có mô tả'}
        </p>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Chọn mua',
      width: 190,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3 py-2">
          <span className="inline-flex min-w-[44px] justify-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            {getSelectedQuantity(params.row)}
          </span>
          <div className="flex overflow-hidden rounded-full border border-slate-200 shadow-sm">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              onClick={() => handleRemoveCombo(params.row)}
            >
              <FaMinus size={12} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center bg-primary text-white transition hover:brightness-110"
              onClick={() => handleSelectCombo(params.row)}
            >
              <FaPlus size={12} />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50">
            <img src="ic-combo.png" alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold uppercase text-slate-800">
              Đồ ăn kèm
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn nhanh bắp, nước và các sản phẩm bán kèm cho đơn hàng.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm">
            <p className="text-slate-500">Tổng sản phẩm</p>
            <p className="font-semibold text-slate-800">{rows.length}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm">
            <p className="text-slate-500">Đã chọn</p>
            <p className="font-semibold text-slate-800">{selectedSnackCount}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-2 text-sm">
            <p className="text-amber-700">Tạm tính snack</p>
            <p className="font-semibold text-amber-800">
              {currencyFormatter(selectedSnackAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataGridTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          minWidth={1020}
          getRowId={(row) => row.id}
          loadingContent="Đang tải danh sách đồ ăn kèm..."
          emptyContent="Chưa có sản phẩm bán kèm nào"
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
            },
            '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
              outline: 'none',
            },
          }}
        />
      </div>
    </div>
  );
};

export default ComboComponent;

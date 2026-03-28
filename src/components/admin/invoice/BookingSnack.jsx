import { clearMultiple, createMultiple } from '@apis/detailBookingSnack';
import { findAllSnacks } from '@apis/snackService';
import { getAllSnackType } from '@apis/snackType';
import DataGridTable from '@component/DataGridTable';
import CustomSelect from '@component/form_field/CustomSelect';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { setSnacks } from '@redux/slices/invoiceASlide';
import { useEffect, useMemo, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BookingSnack = ({ invoiceId, status = 'SOLD' }) => {
  const dispatch = useDispatch();
  const [combos, setCombos] = useState([]);
  const { snacks } = useSelector((state) => state.invoiceASlice);
  const [snackSelect, setSnackSelect] = useState([]);
  const [snackSelected, setSnackSelected] = useState(null);

  const checkQuantity = (combo) => {
    const foundSnackSelected = snacks.find((item) => item.id === combo.id);
    if (foundSnackSelected) {
      return foundSnackSelected.quantity;
    }
    return 0;
  };

  useEffect(() => {
    if (!snackSelected) return;
    findAllSnacks(snackSelected)
      .then((res) => {
        setCombos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [snackSelected]);

  const handleSelectCombo = (combo) => {
    const foundSnackSelected = snacks.find((item) => item.id === combo.id);
    if (!foundSnackSelected) {
      dispatch(
        setSnacks([
          ...snacks,
          {
            ...combo,
            quantity: 1,
          },
        ])
      );
    } else {
      const updatedSnacks = snacks.map((item) =>
        item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      dispatch(setSnacks(updatedSnacks));
    }
  };

  const handleRemoveCombo = (combo) => {
    const findIndex = snacks.findIndex((item) => item.id === combo.id);
    if (findIndex !== -1) {
      if (snacks[findIndex].quantity === 0) {
        return;
      }
      const updatedSnacks = snacks.map((item) =>
        item.id === combo.id ? { ...item, quantity: item.quantity - 1 } : item
      );
      dispatch(setSnacks(updatedSnacks));
    }
  };

  useEffect(() => {
    getAllSnackType()
      .then((res) => {
        const nextSnackSelect = res.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setSnackSelect(nextSnackSelect);
        setSnackSelected(nextSnackSelect[0]?.value ?? null);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelectSnackType = (e) => {
    const selected = e.target.value;
    setSnackSelected(selected);
  };

  const handleSaveCombo = async () => {
    const newComboSelected = snacks.map((item) => ({
      snackId: item.id,
      totalSnack: item.quantity,
      invoiceId,
    }));
    const res = await createMultiple(newComboSelected);
    if (res && res.status === 201) {
      toast.success('Thêm đồ ăn vặt thành công !');
      window.location.reload();
    } else {
      toast.error('Thêm đồ ăn vặt thất bại !');
    }
  };

  const handleClearCombo = async () => {
    try {
      const res = await clearMultiple(invoiceId);
      if (res && res.status === 200) {
        toast.success('Xóa combo thành công');
        dispatch(setSnacks([]));
        window.location.reload();
      }
    } catch (error) {
      toast.error('Xóa combo thất bại !');
      console.log(error);
    }
  };

  const rows = useMemo(() => combos.map((item) => ({ ...item })), [combos]);

  const columns = [
    {
      field: 'image',
      headerName: 'Hình ảnh',
      width: 120,
      sortable: false,
      renderCell: () => (
        <img
          src="/combo-online-03.png"
          className="h-[80px] w-[80px] rounded-full"
        />
      ),
    },
    {
      field: 'snackName',
      headerName: 'Tên',
      width: 240,
      renderCell: (params) => (
        <div className="py-2">
          <span className="font-medium">{params.value}</span>
          <div className="text-[18px] font-medium text-pink-400">
            {currencyFormatter(params.row.unitPrice)}
          </div>
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 280,
      renderCell: (params) => (
        <p className="whitespace-normal break-words text-justify">
          {params.value}
        </p>
      ),
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <div className="flex select-none items-center justify-between gap-2 py-2">
          <span className="text-[18px] font-medium">
            {checkQuantity(params.row)}
          </span>
          <span
            className="cursor-pointer bg-primary p-1"
            onClick={() => handleSelectCombo(params.row)}
          >
            <FaPlus fill={'white'} />
          </span>
          <span
            className="cursor-pointer bg-gray-400 p-1"
            onClick={() => handleRemoveCombo(params.row)}
          >
            <FaMinus />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-5">
      <div className="mb-2 flex flex-wrap items-center justify-between">
        <h2 className="mb-2 font-semibold">Danh sách lựa chọn combo</h2>
        <div className="flex flex-wrap items-center gap-2">
          <CustomSelect
            className="w-[200px]"
            onChange={handleSelectSnackType}
            options={snackSelect}
            value={snackSelected || ''}
            name="snackType"
            placeHolder="Chọn loại đồ ăn vặt"
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveCombo}
            disabled={status === 'USED'}
          >
            Xác nhận thêm combo
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleClearCombo}
            disabled={status === 'USED'}
          >
            Hủy combo
          </Button>
        </div>
      </div>
      <DataGridTable
        rows={rows}
        columns={columns}
        hideFooter
        minWidth={860}
        getRowId={(row) => row.id}
        emptyContent="Chưa có đồ ăn vặt nào cho nhóm đang chọn"
      />
    </div>
  );
};
export default BookingSnack;

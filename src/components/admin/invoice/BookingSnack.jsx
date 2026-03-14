import { clearMultiple, createMultiple } from '@apis/detailBookingSnack';
import { findAllSnacks } from '@apis/snackService';
import { getAllSnackType } from '@apis/snackType';
import CustomSelect from '@component/form_field/CustomSelect';
import { currencyFormatter } from '@libs/Utils';
import { Button } from '@mui/material';
import { setSnacks } from '@redux/slices/invoiceASlide';
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const BookingSnack = ({ invoiceId, status = 'SOLD' }) => {
  const dispatch = useDispatch();
  const [combos, setCombos] = useState([]);
  const { snacks, snacksSelected } = useSelector(
    (state) => state.invoiceASlice
  );
  const [snackSelect, setSnackSelect] = useState([]);
  const [snackSelected, setSnackSelected] = useState(null);

  const checkQuantity = (combo) => {
    const foundSnackSelected = snacks.find((item) => item.id === combo.id);
    if (foundSnackSelected) {
      return foundSnackSelected.quantity;
    }
    return 0;
  };

  /* Fetch danh sách combo */
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
      const createSnackSelected = {
        ...combo,
        quantity: 1,
      };
      dispatch(setSnacks([...snacks, createSnackSelected]));
    } else {
      const findIndex = snacks.findIndex((item) => item.id === combo.id);
      if (findIndex !== -1) {
        const updatedSnacks = snacks.map((item) =>
          item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        dispatch(setSnacks(updatedSnacks));
      }
    }
  };

  /**
   * Handle remove combo
   * @param {object} combo - Combo info
   * @description
   * If the quantity of the combo is 1, remove the combo from the snackSelected array.
   * Otherwise, minus the quantity of the combo by 1.
   */
  const handleRemoveCombo = (combo) => {
    const findIndex = snacks.findIndex((item) => item.id === combo.id);
    if (findIndex !== -1) {
      // if (snacks[findIndex].quantity === 0) {
      //   const updatedSnacks = snacks.filter((item) => item.id !== combo.id);
      //   dispatch(setSnacks(updatedSnacks));
      //   return;
      // }
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
        const snackSelect = res.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setSnackSelect(snackSelect);
        setSnackSelected(snackSelect[0].value);
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
      invoiceId: invoiceId,
    }));
    const res = await createMultiple(newComboSelected);
    if (res && res.status === 201) {
      toast.success('Thêm snack thành công !');
      window.location.reload();
    } else {
      toast.error('Thêm snack thất bại !');
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
            placeHolder="Chọn loại snack"
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
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-[10%] font-semibold">Hình ảnh</th>
              <th className="w-[15%] font-semibold">Tên</th>
              <th className="w-[65%] min-w-[200px] font-semibold">Mô tả</th>
              <th className="w-[10%] min-w-[60px] font-semibold">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((item, index) => {
              return (
                <tr key={`combo-${index}-${item.id}`}>
                  <td className={'flex w-[100px] justify-center px-3 py-5'}>
                    <img
                      src="/combo-online-03.png"
                      className="h-[80px] w-[80px] rounded-full"
                    />
                  </td>
                  <td className={'px-3 py-5'}>
                    <div>
                      <span className={'font-medium'}> {item.snackName}</span>
                      <span className="text-[18px] font-medium text-pink-400">
                        <FaMinus />
                        {currencyFormatter(item.unitPrice)}
                      </span>
                    </div>
                  </td>
                  <td className={'px-3 py-5'}>
                    <div>
                      <p className="whitespace-normal break-words text-justify">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className={'px-3 py-5'}>
                    <div
                      className={
                        'flex select-none items-center justify-between gap-2'
                      }
                    >
                      <span className="text-[18px] font-medium">
                        {checkQuantity(item)}
                      </span>
                      <span
                        className={'cursor-pointer bg-primary p-1'}
                        onClick={() => handleSelectCombo(item)}
                      >
                        <FaPlus fill={'white'} />
                      </span>
                      <span
                        className={'cursor-pointer bg-gray-400 p-1'}
                        onClick={() => handleRemoveCombo(item)}
                      >
                        <FaMinus />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default BookingSnack;

import { findAllCombos } from '@apis/snackService';
import { currencyFormatter } from '@libs/Utils';
import { setSnack } from '@redux/slices/snackSlice';
import { useEffect, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

const ComboComponent = () => {
  const dispatch = useDispatch();
  const [combos, setCombos] = useState([]);
  const { snackSelected } = useSelector((state) => state.snack);

  const snackItems = Array.isArray(snackSelected) ? snackSelected : [];
  const comboItems = Array.isArray(combos) ? combos : [];

  useEffect(() => {
    findAllCombos()
      .then((res) => {
        setCombos(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setCombos([]);
      });
  }, []);

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

  return (
    <div>
      <div className={'mt-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-combo.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Combo ưu đãi</h2>
      </div>
      <div className={'mt-5'}>
        <table className={'w-full'}>
          <thead>
            <tr className={'border-b-2'}>
              <th className={'w-[100px] pb-3'}></th>
              <th className={'pb-3'}>Tên Combo</th>
              <th className={'pb-3'}>Mô tả</th>
              <th className={'pb-3'}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {comboItems.map((item, index) => (
              <tr key={`combo-${item.id}-${index}`}>
                <td className={'flex w-[100px] justify-center px-3 py-5'}>
                  <img
                    src="/combo-online-03.png"
                    className="h-[80px] w-[80px] rounded-full"
                  />
                </td>
                <td className={'px-3 py-5'}>
                  <span className={'font-medium'}>{item.snackName}</span>
                  <span className="text-[18px] font-medium text-pink-400">
                    <FaMinus />
                    {currencyFormatter(item.unitPrice)}
                  </span>
                </td>
                <td className={'px-3 py-5'}>
                  <p className="whitespace-normal break-words text-justify">
                    {item.description}
                  </p>
                </td>
                <td className={'px-3 py-5'}>
                  <div
                    className={
                      'flex select-none items-center justify-between gap-2'
                    }
                  >
                    <span className="text-[18px] font-medium">
                      {snackItems.find((snack) => snack.id === item.id)?.quantity || 0}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComboComponent;

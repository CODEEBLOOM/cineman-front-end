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

  /* Fetch danh sách combo */
  useEffect(() => {
    findAllCombos()
      .then((res) => {
        setCombos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  /**
   * Handle select combo
   * @param {object} combo - Combo info
   * @description
   * If the combo does not exist in snackSelected, create a new snackSelected with quantity equal to 1.
   * Otherwise, increase the quantity of the combo in snackSelected by 1.
   */
  const handleSelectCombo = (combo) => {
    const foundSnackSelected = snackSelected.find(
      (item) => item.id === combo.id
    );
    if (!foundSnackSelected) {
      const createSnackSelected = {
        ...combo,
        quantity: 1,
      };
      dispatch(setSnack([...snackSelected, createSnackSelected]));
    } else {
      const findIndex = snackSelected.findIndex((item) => item.id === combo.id);
      if (findIndex !== -1) {
        const updatedSnacks = snackSelected.map((item) =>
          item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        dispatch(setSnack(updatedSnacks));
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
    const findIndex = snackSelected.findIndex((item) => item.id === combo.id);
    if (findIndex !== -1) {
      if (snackSelected[findIndex].quantity === 1) {
        const updatedSnacks = snackSelected.filter(
          (item) => item.id !== combo.id
        );
        dispatch(setSnack(updatedSnacks));
        return;
      }
      const updatedSnacks = snackSelected.map((item) =>
        item.id === combo.id ? { ...item, quantity: item.quantity - 1 } : item
      );
      dispatch(setSnack(updatedSnacks));
    }
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
              <th className={'min-w-[100px] pb-3'}></th>
              <th className={'pb-3'}>Tên Combo</th>
              <th className={'pb-3'}>Mô tả</th>
              <th className={'pb-3'}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((item) => {
              return (
                <tr key={item.id}>
                  <td className={'flex min-w-[100px] justify-center px-3 py-5'}>
                    <img
                      src="/combo-online-03.png"
                      className="h-[80px] w-[80px] rounded-full"
                    />
                  </td>
                  <td className={'px-3 py-5'}>
                    <span className={'font-medium'}> {item.snackName}</span>
                    <span className="text-[18px] font-medium text-pink-400">
                      <FaMinus />
                      {currencyFormatter(item.unitPrice)}
                    </span>
                  </td>
                  <td className={'px-3 py-5'}>
                    <span className="whitespace-normal">
                      {item.description}
                    </span>
                  </td>
                  <td className={'px-3 py-5'}>
                    <div
                      className={
                        'flex select-none items-center justify-between gap-2'
                      }
                    >
                      <span className="text-[18px] font-medium">
                        {snackSelected.find((snack) => snack.id === item.id)
                          ?.quantity || 0}
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

export default ComboComponent;

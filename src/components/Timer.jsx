import { clearSnack } from '@redux/slices/snackSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Timer = ({ deadlineTime }) => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState('00:00:00');
  const ref = useRef();
  const dispatch = useDispatch();

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minute = Math.floor((total / 1000 / 60) % 60);
    const hour = Math.floor((total / (1000 * 60 * 60)) % 24);
    return { total, hour, minute, seconds };
  };

  const startTimer = (e) => {
    let { total, hour, minute, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        // (hour > 9 ? hour : '0' + hour) +
        //   ':' +
        (minute > 9 ? minute : '0' + minute) +
          ':' +
          (seconds > 9 ? seconds : '0' + seconds)
      );
    } else {
      dispatch(clearSnack());
      clearInterval(ref.current);
      sessionStorage.removeItem('bookingDeadline');
      navigate('/', { replace: true });
    }
  };

  const clearTimer = (e) => {
    setTimer('10:00');
    if (ref.current) {
      clearInterval(ref.current);
    }
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    ref.current = id;
  };
  const getDeadlineTime = () => {
    // let deadline = new Date();
    // deadline.setMinutes(deadline.getMinutes() + deadlineTime);
    // return deadline;
    const saved = sessionStorage.getItem('bookingDeadline');
    if (saved) return new Date(saved);

    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + deadlineTime);
    sessionStorage.setItem('bookingDeadline', deadline.toISOString());
    return deadline;
  };

  // useEffect(() => {
  //   clearTimer(getDeadlineTime());
  //   return () => {
  //     if (ref.current) {
  //       dispatch(clearSnack());
  //       clearInterval(ref.current);
  //     }
  //   };
  // }, []);
  useEffect(() => {
    const deadline = getDeadlineTime(); // <-- sử dụng deadline từ session
    clearTimer(deadline);

    return () => {
      if (ref.current) {
        dispatch(clearSnack());
        clearInterval(ref.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <p className="font-medium text-primary md:text-[20px]">{timer}</p>
    </div>
  );
};
export default Timer;

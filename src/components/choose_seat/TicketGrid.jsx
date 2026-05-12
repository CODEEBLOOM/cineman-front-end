import { getAllTicketByShowTime } from '@apis/ticketService';
import { Client } from '@stomp/stompjs';
import { setSelectedSeats } from '@redux/slices/ticketSlice';
import { resolveRealtimeBrokerUrl } from '@utils/promotionRealtime';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SeatMapRenderer from './SeatMapRenderer';

const TicketGrid = ({ showTime, invoiceId, setTotalMoneyTicket }) => {
  const dispatch = useDispatch();
  const { selectedSeats } = useSelector((state) => state.ticket);
  const { accessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  const clientRef = useRef(null);
  const selectedSeatsRef = useRef([]);
  const hasRealtimeFailureRef = useRef(false);
  const hasSeatInteractionNoticeRef = useRef(false);
  const [ticketMap, setTicketMap] = useState(new Map());
  const [isRealtimeAvailable, setIsRealtimeAvailable] = useState(true);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  const message = {
    type: 'TICKET_CREATE',
    content: {
      showTimeId: showTime?.id,
      ticketType: 'ADULT',
      seatId: null,
      invoiceId,
    },
    ticketId: null,
    userId: user?.userId,
  };

  useEffect(() => {
    if (!showTime?.id || !user?.userId) {
      return;
    }

    getAllTicketByShowTime({ userId: user.userId, showTimeId: showTime.id })
      .then((res) => {
        const newMap = new Map();
        const seatSelected = [];

        res.data.forEach((ticket) => {
          const key = `${ticket.seat.rowIndex}-${ticket.seat.columnIndex}`;
          newMap.set(key, ticket);

          if (ticket.status === 'SELECTED') {
            seatSelected.push({
              ticketId: ticket.id,
              seat: ticket.seat,
              price: ticket.price,
            });
          }
        });

        setTicketMap(newMap);
        dispatch(setSelectedSeats(seatSelected));
      })
      .catch((error) => {
        console.error('Không thể tải sơ đồ ghế từ API:', error);
      });
  }, [dispatch, showTime?.id, user?.userId]);

  useEffect(() => {
    if (!showTime?.id || !user?.userId || !accessToken) {
      setIsRealtimeAvailable(false);

      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }

      return undefined;
    }

    hasRealtimeFailureRef.current = false;
    hasSeatInteractionNoticeRef.current = false;
    setIsRealtimeAvailable(true);

    const client = new Client({
      brokerURL: resolveRealtimeBrokerUrl(),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 0,
      debug: () => {},
      onConnect: () => {
        hasRealtimeFailureRef.current = false;
        hasSeatInteractionNoticeRef.current = false;
        setIsRealtimeAvailable(true);

        client.subscribe('/user/queue/errors', (messageFrame) => {
          const error = JSON.parse(messageFrame.body);
          toast.error(error.message, { position: 'bottom-left' });
        });

        client.subscribe(
          `/cineman/topic/seat-map/show-time/${showTime.id}`,
          (response) => {
            const msg = JSON.parse(response.body);

            if (msg.type === 'TICKET_DELETED') {
              const seatKey = `${msg.rowIndex}-${msg.columnIndex}`;
              setTotalMoneyTicket(msg.totalMoney);

              setTicketMap((prevMap) => {
                const newMap = new Map(prevMap);
                const updatedTicket = newMap.get(seatKey);

                if (updatedTicket) {
                  updatedTicket.status = 'EMPTY';
                  updatedTicket.id = null;
                  newMap.set(seatKey, updatedTicket);
                }

                return newMap;
              });

              const index = selectedSeatsRef.current.findIndex(
                (ticketSelected) => ticketSelected.ticketId === msg.ticketId
              );

              if (index !== -1) {
                const updatedSelectedSeats = [...selectedSeatsRef.current];
                updatedSelectedSeats.splice(index, 1);
                dispatch(setSelectedSeats(updatedSelectedSeats));
              }
            }

            if (msg.type === 'TICKET_CREATED' && msg.content) {
              const seatKey = `${msg.content.seat.rowIndex}-${msg.content.seat.columnIndex}`;
              const isCurrentUser = msg.userId === user.userId;
              setTotalMoneyTicket(msg.totalMoney);

              setTicketMap((prevMap) => {
                const newMap = new Map(prevMap);
                const updatedTicket = {
                  ...msg.content,
                  status: isCurrentUser ? 'SELECTED' : 'HOLDED',
                };
                newMap.set(seatKey, updatedTicket);
                return newMap;
              });

              if (isCurrentUser) {
                const newSelectedSeats = [
                  ...selectedSeatsRef.current,
                  {
                    ticketId: msg.ticketId,
                    seat: msg.content.seat,
                    price: msg.content.price,
                  },
                ];
                dispatch(setSelectedSeats(newSelectedSeats));
              }
            }
          }
        );
      },
      onStompError: (error) => {
        if (hasRealtimeFailureRef.current) {
          return;
        }

        hasRealtimeFailureRef.current = true;
        setIsRealtimeAvailable(false);
        console.error('TicketGrid STOMP error:', error);
        toast.warning(
          'Realtime chọn ghế đang tạm gián đoạn. Vui lòng tải lại trang hoặc kiểm tra backend WebSocket.'
        );
        client.deactivate();
      },
      onWebSocketError: (error) => {
        if (hasRealtimeFailureRef.current) {
          return;
        }

        hasRealtimeFailureRef.current = true;
        setIsRealtimeAvailable(false);
        console.warn(
          'TicketGrid realtime connection is unavailable. Seat actions were disabled.',
          error
        );
        toast.warning(
          'Không kết nối được WebSocket chọn ghế. Tính năng giữ ghế tạm thời bị tắt.'
        );
        client.deactivate();
        clientRef.current = null;
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken, dispatch, setTotalMoneyTicket, showTime?.id, user?.userId]);

  const sendMessageChooseSeat = (data) => {
    if (!clientRef.current?.connected || !isRealtimeAvailable) {
      if (!hasSeatInteractionNoticeRef.current) {
        hasSeatInteractionNoticeRef.current = true;
        toast.info(
          'Realtime chọn ghế chưa sẵn sàng. Hãy kiểm tra kết nối WebSocket của backend rồi thử lại.'
        );
      }
      return;
    }

    if (selectedSeats.length > 0) {
      const seatFound = selectedSeats.find(
        (ticketSelected) => ticketSelected.ticketId === data.ticketId
      );

      if (seatFound) {
        clientRef.current.publish({
          destination: '/cineman/app/seat/cancel-seat',
          body: JSON.stringify(data),
        });
        return;
      }
    }

    if (selectedSeats.length + 1 > 8) {
      toast.info('Bạn chỉ có thể đặt tối đa 8 ghế trong một lần.');
      return;
    }

    clientRef.current.publish({
      destination: '/cineman/app/seat/choose-seat',
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="mx-auto w-full overflow-x-auto">
      {!isRealtimeAvailable ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Không kết nối được realtime chọn ghế. Hệ thống vẫn hiển thị sơ đồ ghế, nhưng thao tác giữ
          ghế sẽ tạm dừng cho đến khi WebSocket backend hoạt động lại.
        </div>
      ) : null}

      <div
        className="mx-auto grid min-w-max items-center gap-[10px] px-1 pb-1"
        style={{
          gridTemplateColumns: `44px repeat(${showTime?.cinemaTheater?.numberOfColumns ?? 0}, minmax(58px, 1fr))`,
          width: 'fit-content',
        }}
      >
        {showTime?.id ? (
          <SeatMapRenderer
            ticketMap={ticketMap}
            showTime={showTime}
            message={message}
            sendMessageChooseSeat={sendMessageChooseSeat}
          />
        ) : null}
      </div>
    </div>
  );
};

export default TicketGrid;

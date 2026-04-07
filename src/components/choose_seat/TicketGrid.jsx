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

  const selectedSeatsRef = useRef([]);

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  const { accessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [ticketMap, setTicketMap] = useState(new Map());

  const message = {
    type: 'TICKET_CREATE',
    content: {
      showTimeId: showTime.id,
      ticketType: 'ADULT',
      seatId: null,
      invoiceId: invoiceId,
    },
    ticketId: null,
    userId: user.userId,
  };

  useEffect(() => {
    if (!showTime.id) return;

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
      .catch((err) => {
        console.log(err);
      });
  }, [showTime.id, user.userId, dispatch]);

  const clientRef = useRef();
  useEffect(() => {
    if (!showTime.id) return;

    const client = new Client({
      brokerURL: resolveRealtimeBrokerUrl(),
      connectHeaders: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
      reconnectDelay: 0,

      onConnect: (frame) => {
        console.log('Connected:', frame);

        client.subscribe('/user/queue/errors', (message) => {
          const error = JSON.parse(message.body);
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
                }

                newMap.set(seatKey, updatedTicket);
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
        alert('STOMP Error');
        console.error('STOMP error:', error);
      },
      onWebSocketError: (error) => {
        alert('WebSocket Error');
        console.error('WebSocket error:', error);
        clientRef.current = null;
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (client.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [accessToken, showTime.id]);

  const sendMessageChooseSeat = (data) => {
    if (selectedSeats.length > 0) {
      const seatFound = selectedSeats.find(
        (ticketSelected) => ticketSelected.ticketId === data.ticketId
      );

      if (seatFound) {
        clientRef.current.publish({
          destination: `/cineman/app/seat/cancel-seat`,
          body: JSON.stringify(data),
        });
        return;
      }
    }

    if (!clientRef.current?.connected) return;
    if (selectedSeats.length + 1 > 8) return alert('bạn chỉ có thể đặt 8 ghế');

    clientRef.current.publish({
      destination: `/cineman/app/seat/choose-seat`,
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="mx-auto w-full overflow-x-auto">
      <div
        className="mx-auto grid min-w-max items-center gap-[10px] px-1 pb-1"
        style={{
          gridTemplateColumns: `44px repeat(${showTime?.cinemaTheater?.numberOfColumns ?? 0}, minmax(58px, 1fr))`,
          width: 'fit-content',
        }}
      >
        {showTime.id && (
          <SeatMapRenderer
            ticketMap={ticketMap}
            showTime={showTime}
            message={message}
            sendMessageChooseSeat={sendMessageChooseSeat}
          />
        )}
      </div>
    </div>
  );
};

export default TicketGrid;

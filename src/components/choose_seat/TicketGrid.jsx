import { getAllTicketByShowTime } from '@apis/ticketService';
import React, { useEffect, useRef, useState } from 'react';
import RenderSeat from './RenderSeat';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';

const TicketGrid = React.memo(
  ({ showTime, invoiceId, selectedSeats, setSelectedSeats }) => {
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
      userId: user.userId,
    };

    /* Call api lấy toàn bộ thông tin vé của một lịch chiếu: chạy khi lịch chiếu thay đổi */
    useEffect(() => {
      if (!showTime.id) return;
      getAllTicketByShowTime({ userId: user.userId, showTimeId: showTime.id })
        .then((res) => {
          const newMap = new Map();
          res.data.forEach((ticket) => {
            const key = `${ticket.seat.rowIndex}-${ticket.seat.columnIndex}`;
            newMap.set(key, ticket);
          });
          setTicketMap(newMap);
        })
        .catch((err) => {
          console.log(err);
        });
    }, [showTime.id, user.userId]);

    /* Xử lý realtime */
    const clientRef = useRef();
    // Tạo STOMP client một lần
    useEffect(() => {
      if (!showTime.id) return;
      const client = new Client({
        brokerURL: 'ws://localhost:8081/cineman-ws',
        reconnectDelay: 0,

        // Chạy khi connected thành công  //
        onConnect: (frame) => {
          console.log('Connected:', frame);
          client.subscribe(
            `/cineman/topic/seat-map/show-time/${showTime.id}`,
            (response) => {
              const msg = JSON.parse(response.body);
              console.log(msg);
              if (msg.type === 'TICKET_CREATED' && msg.content) {
                const seatKey = `${msg.content.seat.rowIndex}-${msg.content.seat.columnIndex}`;
                const isCurrentUser = msg.userId === user.userId;
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
                  setSelectedSeats((prev) => [...prev, msg]);
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

      // Khởi chạy client
      clientRef.current = client;
      client.activate();
      // Optional cleanup
      return () => {
        if (client.connected) {
          clientRef.current.deactivate();
        }
      };
    }, [showTime.id]);

    const sendMessageChooseSeat = (data) => {
      debugger;
      if (selectedSeats.length > 0) {
        const isCurrentSeat = selectedSeats.find(
          (ticket) => ticket.content?.seat.id === data.content.seatId
        );
        if (isCurrentSeat) return;
      }
      if (!clientRef.current?.connected) return;
      clientRef.current.publish({
        destination: `/cineman/app/seat/choose-seat`,
        body: JSON.stringify(data),
      });
    };

    /* Hàm render toàn bộ sơ đồ */
    const renderSeatMap = () => {
      /* Lưu toàn bộ ghế cơ bản trong map */
      if (!ticketMap.size) return;

      const theater = showTime?.cinemaTheater;
      if (!theater) return null;

      const allSeats = [];
      for (let row = 0; row < theater.numberOfRows; row++) {
        if (
          row >=
          theater.regularSeatRow + theater.vipSeatRow + theater.doubleSeatRow
        ) {
          break;
        }
        allSeats.push(
          <div
            className="flex items-center justify-center"
            key={String.fromCharCode(65 + row)}
          >
            {String.fromCharCode(65 + row)}
          </div>
        );

        for (let col = 0; col < theater.numberOfColumns; col++) {
          const seatKey = `${row}-${col}`;
          const ticket = ticketMap.get(seatKey);
          if (!ticket) {
            allSeats.push(
              <div
                className={`h-[60px] w-[60px] bg-white ${row >= theater.regularSeatRow + theater.vipSeatRow ? 'col-span-2' : ''}`}
                key={seatKey}
              />
            );
            if (row >= theater.regularSeatRow + theater.vipSeatRow) {
              col++;
            }
            continue;
          }
          if (ticket.seat.seatType.id === 'DOUBLE') {
            col++;
          }
          allSeats.push(
            <RenderSeat
              key={seatKey}
              ticket={ticket}
              cinemaTheater={theater}
              message={message}
              sendMessageChooseSeat={sendMessageChooseSeat}
            />
          );
        }
      }

      return allSeats;
    };

    return (
      <div
        className="mx-auto grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${showTime?.cinemaTheater?.numberOfColumns + 1}, 60px)`,
          width: 'fit-content',
        }}
      >
        {renderSeatMap()}
      </div>
    );
  }
);
export default TicketGrid;

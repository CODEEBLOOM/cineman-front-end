import { Client } from '@stomp/stompjs';
import PromotionActivatedPopup from '@component/realtime/PromotionActivatedPopup.jsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  emitPromotionActivatedEvent,
  parsePromotionActivatedMessage,
  resolveRealtimeBrokerUrl,
} from '@utils/promotionRealtime';

const PROMOTION_DESTINATION = '/user/queue/promotions';

const PromotionRealtimeListener = () => {
  const { isAuthentication, accessToken } = useSelector((state) => state.auth);
  const clientRef = useRef(null);
  const displayedPromotionKeysRef = useRef(new Set());
  const hasRealtimeFailureRef = useRef(false);
  const [activePromotion, setActivePromotion] = useState(null);
  const navigate = useNavigate();

  const handleClosePopup = useCallback(() => {
    setActivePromotion(null);
  }, []);

  const handleCopyPromotionCode = useCallback(async (code) => {
    if (!code) {
      toast.info('Voucher mới đã được lưu vào tài khoản của bạn.');
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã ${code}`);
    } catch (error) {
      console.error('Không thể sao chép mã voucher:', error);
      toast.error('Không thể sao chép mã voucher trên thiết bị này.');
    }
  }, []);

  const handleViewVouchers = useCallback(() => {
    setActivePromotion(null);
    navigate('/my-account?tab=voucher');
  }, [navigate]);

  useEffect(() => {
    if (!isAuthentication || !accessToken) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      hasRealtimeFailureRef.current = false;
      displayedPromotionKeysRef.current.clear();
      setActivePromotion(null);
      return undefined;
    }

    const client = new Client({
      brokerURL: resolveRealtimeBrokerUrl(),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 0,
      debug: () => {},
      onConnect: () => {
        hasRealtimeFailureRef.current = false;
        client.subscribe(PROMOTION_DESTINATION, (message) => {
          const activatedPromotion = parsePromotionActivatedMessage(
            message.body
          );

          if (!activatedPromotion) {
            return;
          }

          emitPromotionActivatedEvent(activatedPromotion);

          const popupId =
            activatedPromotion.promotion?.id ??
            activatedPromotion.promotion?.code ??
            activatedPromotion.promotion?.name ??
            'promotion-activated';

          const uniquePopupId = `promotion-activated-${popupId}`;

          if (displayedPromotionKeysRef.current.has(uniquePopupId)) {
            return;
          }

          displayedPromotionKeysRef.current.add(uniquePopupId);
          setActivePromotion(activatedPromotion.promotion);
        });
      },
      onStompError: (error) => {
        if (hasRealtimeFailureRef.current) {
          return;
        }

        hasRealtimeFailureRef.current = true;
        console.error('Promotion websocket STOMP error:', error);
        client.deactivate();
      },
      onWebSocketError: (error) => {
        if (hasRealtimeFailureRef.current) {
          return;
        }

        hasRealtimeFailureRef.current = true;
        console.warn(
          'Promotion realtime is unavailable. The listener was disabled for this session.',
          error
        );
        client.deactivate();
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [accessToken, isAuthentication]);

  return (
    <PromotionActivatedPopup
      open={Boolean(activePromotion)}
      promotion={activePromotion}
      onClose={handleClosePopup}
      onCopy={handleCopyPromotionCode}
      onViewVouchers={handleViewVouchers}
    />
  );
};

export default PromotionRealtimeListener;

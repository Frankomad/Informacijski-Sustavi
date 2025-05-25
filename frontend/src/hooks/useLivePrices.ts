import { useState, useEffect, useRef } from "react";
import { useCryptocurrencies } from "./useCryptocurrencies";

interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  timestamp: string;
}

export const useLivePrices = () => {
  const { cryptocurrencies } = useCryptocurrencies();
  const [prices, setPrices] = useState<Record<string, PriceUpdate>>({});
  const [isConnected, setIsConnected] = useState(false);
  const lastUpdateTime = useRef<Record<string, number>>({});
  const UPDATE_INTERVAL = 15000; // 15 seconds in milliseconds

  useEffect(() => {
    let ws: WebSocket | null = null;
    let shouldReconnect = true;

    const connect = () => {
      ws = new WebSocket('wss://wevunatuprlwfmpoqjrx.supabase.co/functions/v1/binance-price-updater');

      ws.onopen = () => {
        setIsConnected(true);
        console.log('Connected to live price updates');
      };

      ws.onmessage = (event) => {
        const update: PriceUpdate = JSON.parse(event.data);
        const now = Date.now();
        const lastUpdate = lastUpdateTime.current[update.symbol] || 0;

        // Only update if 15 seconds have passed since the last update for this symbol
        if (now - lastUpdate >= UPDATE_INTERVAL) {
          setPrices(prev => ({
            ...prev,
            [update.symbol]: update
          }));
          lastUpdateTime.current[update.symbol] = now;
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log('Disconnected from price updates');
        if (shouldReconnect) {
          console.log('Reconnecting to price updates...');
          connect(); // Immediately reconnect
        }
      };

      ws.onerror = (error) => {
        setIsConnected(false);
        console.error('WebSocket error:', error);
        if (shouldReconnect) {
          console.log('Reconnecting to price updates after error...');
          ws?.close(); // This will trigger onclose and reconnect
        }
      };
    };

    connect();

    return () => {
      shouldReconnect = false;
      ws?.close();
    };
  }, []);

  const getCurrentPrice = (symbol: string): number => {
    const livePrice = prices[symbol]?.price;
    if (livePrice) return livePrice;
    
    const crypto = cryptocurrencies.find(c => c.symbol === symbol);
    return crypto?.current_price || 0;
  };

  const getPriceChange = (symbol: string): number => {
    const liveChange = prices[symbol]?.change;
    if (liveChange !== undefined) return liveChange;
    
    const crypto = cryptocurrencies.find(c => c.symbol === symbol);
    return crypto?.price_change_24h || 0;
  };

  return {
    prices,
    isConnected,
    getCurrentPrice,
    getPriceChange,
  };
};

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wifi, WifiOff } from "lucide-react";
import { useCryptocurrencies } from "@/hooks/useCryptocurrencies";
import { useLivePrices } from "@/hooks/useLivePrices";

const LivePriceTracker = () => {
  const { cryptocurrencies } = useCryptocurrencies();
  const { isConnected, getCurrentPrice, getPriceChange } = useLivePrices();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Live Cryptocurrency Prices
          {isConnected ? (
            <Badge variant="default" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Live
            </Badge>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Disconnected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {cryptocurrencies.map((crypto) => {
            const currentPrice = getCurrentPrice(crypto.symbol);
            const priceChange = getPriceChange(crypto.symbol);
            const borderColor = priceChange > 0
              ? 'border-green-400 shadow-green-800/10'
              : priceChange < 0
              ? 'border-red-400 shadow-red-800/10'
              : 'border-blue-400 shadow-blue-800/10';
            const bgColor = priceChange > 0
              ? 'bg-green-900/10'
              : priceChange < 0
              ? 'bg-red-900/10'
              : 'bg-blue-900/10';
            return (
              <div
                key={crypto.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${borderColor} ${bgColor} shadow transition-all text-sm`}
                style={{ minWidth: 0 }}
              >
                <div>
                  <div className="font-semibold text-base text-gray-900">{crypto.name}</div>
                  <div className="text-xs text-gray-500">{crypto.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base text-gray-900">{formatPrice(currentPrice)}</div>
                  <div className={`text-xs flex items-center gap-1 ${
                    priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {priceChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {priceChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceTracker;

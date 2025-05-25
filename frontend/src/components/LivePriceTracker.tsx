
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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cryptocurrencies.map((crypto) => {
            const currentPrice = getCurrentPrice(crypto.symbol);
            const priceChange = getPriceChange(crypto.symbol);
            
            return (
              <div key={crypto.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{crypto.name}</div>
                  <div className="text-sm text-gray-500">{crypto.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatPrice(currentPrice)}</div>
                  <div className={`text-sm flex items-center gap-1 ${
                    priceChange >= 0 ? 'text-green-600' : 'text-red-600'
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

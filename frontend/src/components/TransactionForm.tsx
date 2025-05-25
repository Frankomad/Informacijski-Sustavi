import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Portfolio, Cryptocurrency, RiskType } from "@/types/database";
import { useLivePrices } from "@/hooks/useLivePrices";

interface TransactionFormProps {
  portfolios: Portfolio[];
  cryptocurrencies: Cryptocurrency[];
  riskTypes: RiskType[];
  onSubmit: (data: {
    portfolio_id: string;
    cryptocurrency_id: string;
    tip_transakcije: 'BUY' | 'SELL';
    kolicina: number;
    cijena: number;
    datum: string;
    risk_type_id: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  defaultPortfolioId?: string | null;
  initialValues?: {
    portfolio_id: string;
    cryptocurrency_id: string;
    tip_transakcije: 'BUY' | 'SELL';
    kolicina: number;
    cijena: number;
    datum: string;
    risk_type_id: string;
  };
}

const TransactionForm = ({ 
  portfolios, 
  cryptocurrencies,
  riskTypes,
  onSubmit, 
  onCancel, 
  isLoading, 
  defaultPortfolioId,
  initialValues
}: TransactionFormProps) => {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(initialValues?.portfolio_id || defaultPortfolioId || "");
  const [selectedCryptocurrencyId, setSelectedCryptocurrencyId] = useState(initialValues?.cryptocurrency_id || "");
  const [selectedRiskTypeId, setSelectedRiskTypeId] = useState(initialValues?.risk_type_id || "");
  const [tipTransakcije, setTipTransakcije] = useState<'BUY' | 'SELL'>(initialValues?.tip_transakcije || 'BUY');
  const [kolicina, setKolicina] = useState(initialValues?.kolicina?.toString() || "");
  const [datum, setDatum] = useState(initialValues?.datum || new Date().toISOString().split('T')[0]);
  const [manualPrice, setManualPrice] = useState(initialValues?.cijena?.toString() || "");
  const [forceManualPrice, setForceManualPrice] = useState(false);

  const { getCurrentPrice, isConnected } = useLivePrices();
  const selectedCrypto = cryptocurrencies.find(c => c.id === selectedCryptocurrencyId);

  // Helper to check if a date string is today
  const isToday = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  };

  // If date or crypto changes in edit mode, require manual price if not today
  useEffect(() => {
    if (!isToday(datum)) {
      setForceManualPrice(true);
    } else {
      setForceManualPrice(false);
    }
  }, [datum, selectedCryptocurrencyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPortfolioId && selectedCryptocurrencyId && selectedRiskTypeId && kolicina && datum && selectedCrypto) {
      let price: number;
      if (forceManualPrice) {
        price = parseFloat(manualPrice);
      } else {
        price = initialValues ? initialValues.cijena : getCurrentPrice(selectedCrypto.symbol);
      }
      onSubmit({
        portfolio_id: selectedPortfolioId,
        cryptocurrency_id: selectedCryptocurrencyId,
        tip_transakcije: tipTransakcije,
        kolicina: parseFloat(kolicina),
        cijena: price,
        datum,
        risk_type_id: selectedRiskTypeId,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const getCurrentMarketPrice = () => {
    if (!selectedCrypto) return 0;
    return getCurrentPrice(selectedCrypto.symbol);
  };

  const getTotalValue = () => {
    if (!kolicina || !selectedCrypto) return 0;
    return parseFloat(kolicina) * getCurrentMarketPrice();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-3 block">Select Portfolio *</Label>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPortfolioId === portfolio.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPortfolioId(portfolio.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{portfolio.naziv}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-2">
                  {portfolio.strategija || 'No strategy'}
                </p>
                <Badge variant="outline" className="text-xs">
                  {new Date(portfolio.datum_kreiranja).toLocaleDateString()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">Select Cryptocurrency *</Label>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cryptocurrencies.map((crypto) => {
            const currentPrice = getCurrentPrice(crypto.symbol);
            return (
              <Card 
                key={crypto.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCryptocurrencyId === crypto.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedCryptocurrencyId(crypto.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{crypto.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 mb-2">{crypto.symbol}</p>
                  <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
                    {formatPrice(currentPrice)}
                    {isConnected && <span className="ml-1">🔴</span>}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium mb-3 block">Transaction Type *</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={tipTransakcije === 'BUY' ? 'default' : 'outline'}
            onClick={() => setTipTransakcije('BUY')}
            className="flex-1"
          >
            BUY
          </Button>
          <Button
            type="button"
            variant={tipTransakcije === 'SELL' ? 'default' : 'outline'}
            onClick={() => setTipTransakcije('SELL')}
            className="flex-1"
          >
            SELL
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="risk-type" className="text-base font-medium mb-3 block">Risk Type *</Label>
        <Select value={selectedRiskTypeId} onValueChange={setSelectedRiskTypeId}>
          <SelectTrigger>
            <SelectValue placeholder="Select risk type" />
          </SelectTrigger>
          <SelectContent>
            {riskTypes.map((riskType) => (
              <SelectItem key={riskType.id} value={riskType.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: riskType.color || '#gray-500' }}
                  />
                  {riskType.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="kolicina">Quantity *</Label>
          <Input
            id="kolicina"
            type="number"
            step="0.00000001"
            min="0"
            value={kolicina}
            onChange={(e) => setKolicina(e.target.value)}
            placeholder="0.00000000"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="datum">Date *</Label>
          <Input
            id="datum"
            type="date"
            value={datum}
            onChange={e => setDatum(e.target.value)}
            required
          />
        </div>
      </div>

      {forceManualPrice ? (
        <div>
          <Label htmlFor="manual-price">Entry Price *</Label>
          <Input
            id="manual-price"
            type="number"
            step="0.00000001"
            min="0"
            value={manualPrice}
            onChange={e => setManualPrice(e.target.value)}
            placeholder="Enter price for selected date"
            required
          />
        </div>
      ) : (
        <div>
          <Label>Entry Price</Label>
          <div className="flex items-center gap-2">
            <span>{formatPrice(getCurrentMarketPrice())}</span>
            <span className="text-xs text-gray-500">(Live price)</span>
          </div>
        </div>
      )}
      
      {selectedCrypto && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Current Market Price:</span>
            <span className="font-semibold">
              {formatPrice(getCurrentMarketPrice())}
              {isConnected ? ' 🔴 LIVE' : ' (Static)'}
            </span>
          </div>
          {kolicina && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Transaction Value:</span>
              <span className="text-lg font-semibold">
                {formatPrice(getTotalValue())}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isLoading || !selectedPortfolioId || !selectedCryptocurrencyId || !selectedRiskTypeId || !kolicina || (forceManualPrice && !manualPrice)}>
          {isLoading ? (initialValues ? "Saving..." : "Creating...") : initialValues ? "Save Changes" : "Create Transaction"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;

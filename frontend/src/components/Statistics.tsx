import { useTransactions } from "@/hooks/useTransactions";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface StatisticsProps {
  selectedPortfolioId: string | null;
}

const Statistics = ({ selectedPortfolioId }: StatisticsProps) => {
  const { transactions, isLoading } = useTransactions(selectedPortfolioId);
  const { getCurrentPrice } = useLivePrices();

  // Calculate stats
  const totalTrades = transactions.length;
  const totalInvested = transactions.reduce((acc, t) => acc + t.cijena * t.kolicina, 0);
  const avgEntryPrice = totalTrades > 0 ? (transactions.reduce((acc, t) => acc + t.cijena, 0) / totalTrades) : 0;
  const numLongs = transactions.filter(t => t.tip_transakcije === 'LONG').length;
  const numShorts = transactions.filter(t => t.tip_transakcije === 'SHORT').length;

  // Calculate P/L for each trade
  const tradesWithPL = transactions.map(t => {
    if (!t.cryptocurrency) return { ...t, pl: 0 };
    const currentPrice = getCurrentPrice(t.cryptocurrency.symbol);
    const pl = t.tip_transakcije === 'LONG'
      ? (currentPrice - t.cijena) * t.kolicina
      : (t.cijena - currentPrice) * t.kolicina;
    return { ...t, pl };
  });

  const totalPL = tradesWithPL.reduce((acc, t) => acc + t.pl, 0);
  const avgPL = totalTrades > 0 ? totalPL / totalTrades : 0;
  const bestTrade = tradesWithPL.reduce((best, t) => (t.pl > (best?.pl ?? -Infinity) ? t : best), undefined as typeof tradesWithPL[0] | undefined);
  const worstTrade = tradesWithPL.reduce((worst, t) => (t.pl < (worst?.pl ?? Infinity) ? t : worst), undefined as typeof tradesWithPL[0] | undefined);

  // Prepare data for chart (P/L by asset)
  const plByAsset = tradesWithPL.reduce<Record<string, { name: string; pl: number }>>((acc, t) => {
    if (!t.cryptocurrency) return acc;
    const name = t.cryptocurrency.name + ' (' + t.cryptocurrency.symbol + ')';
    if (!acc[name]) acc[name] = { name, pl: 0 };
    acc[name].pl += t.pl;
    return acc;
  }, {});
  const chartData = Object.values(plByAsset);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Trade Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Trades</span>
              <span className="font-bold">{totalTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Long / Short</span>
              <span className="font-bold">{numLongs} / {numShorts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Invested</span>
              <span className="font-bold">{totalInvested.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Entry Price</span>
              <span className="font-bold">{avgEntryPrice.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Total P/L</span>
              <span className={`font-bold ${totalPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPL.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average P/L per Trade</span>
              <span className={`font-bold ${avgPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>{avgPL.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</span>
            </div>
            {bestTrade && bestTrade.cryptocurrency && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Trade</span>
                <span className="font-bold text-green-400">
                  {bestTrade.cryptocurrency.name} ({bestTrade.cryptocurrency.symbol}): {bestTrade.pl.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
            {worstTrade && worstTrade.cryptocurrency && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Worst Trade</span>
                <span className="font-bold text-red-400">
                  {worstTrade.cryptocurrency.name} ({worstTrade.cryptocurrency.symbol}): {worstTrade.pl.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>P/L by Asset</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#aaa', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => value.toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })} contentStyle={{ background: '#222', border: 'none', color: '#fff' }} />
              <Bar dataKey="pl" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics; 
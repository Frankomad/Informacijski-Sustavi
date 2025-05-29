import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { usePortfolios } from "@/hooks/usePortfolios";
import { useCryptocurrencies } from "@/hooks/useCryptocurrencies";
import { useRiskTypes } from "@/hooks/useRiskTypes";
import { useLivePrices } from "@/hooks/useLivePrices";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, TrendingUp, TrendingDown, Filter, Edit2 } from "lucide-react";
import TransactionForm from "./TransactionForm";
import type { Transaction } from "@/types/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TransactionManagerProps {
  selectedPortfolioId: string | null;
}

type TransactionFormData = {
  portfolio_id: string;
  cryptocurrency_id: string;
  tip_transakcije: 'LONG' | 'SHORT';
  kolicina: number;
  cijena: number;
  datum: string;
  risk_type_id: string;
};

const TransactionManager = ({ selectedPortfolioId }: TransactionManagerProps) => {
  const { portfolios } = usePortfolios();
  const { cryptocurrencies } = useCryptocurrencies();
  const { riskTypes } = useRiskTypes();
  const { transactions, isLoading, createTransaction, deleteTransaction, editTransaction } = useTransactions(selectedPortfolioId);
  const { getCurrentPrice } = useLivePrices();
  const [showForm, setShowForm] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; transaction: Transaction | null }>({ open: false, transaction: null });
  const [filterType, setFilterType] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [filterCrypto, setFilterCrypto] = useState<string>('ALL');

  const handleCreateTransaction = async (data: TransactionFormData) => {
    await createTransaction.mutateAsync(data);
    setShowForm(false);
  };

  const handleEditTransaction = async (data: TransactionFormData) => {
    if (editModal.transaction) {
      await editTransaction.mutateAsync({ id: editModal.transaction.id, data });
      setEditModal({ open: false, transaction: null });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatQuantity = (quantity: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(quantity);
  };

  const calculateCurrentValue = (transaction: Transaction) => {
    if (!transaction.cryptocurrency) return 0;
    const crypto = transaction.cryptocurrency;
    const currentPrice = getCurrentPrice(crypto.symbol);
    return transaction.kolicina * currentPrice;
  };

  const calculateProfitLoss = (transaction: Transaction) => {
    if (!transaction.cryptocurrency) return 0;
    const currentValue = calculateCurrentValue(transaction);
    const entryValue = transaction.kolicina * transaction.cijena;
    
    // For LONG positions: profit when price goes up
    // For SHORT positions: profit when price goes down
    return transaction.tip_transakcije === 'LONG' 
      ? currentValue - entryValue 
      : entryValue - currentValue;
  };

  const getPositionTypeBadge = (type: 'LONG' | 'SHORT') => {
    return type === 'LONG' ? (
      <Badge variant="default" className="bg-green-500">LONG</Badge>
    ) : (
      <Badge variant="default" className="bg-red-500">SHORT</Badge>
    );
  };

  const getProfitLossBadge = (profitLoss: number) => {
    const isProfit = profitLoss >= 0;
    const icon = isProfit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    return (
      <Badge 
        className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold text-white ${isProfit ? 'bg-green-500' : 'bg-red-500'}`}
      >
        {icon}
        {formatCurrency(profitLoss)}
      </Badge>
    );
  };

  const clearAllTransactions = async () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      for (const transaction of transactions) {
        await deleteTransaction.mutateAsync(transaction.id);
      }
    }
  };

  // Filtering logic
  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filterType === 'ALL' || t.tip_transakcije === filterType;
    const cryptoMatch = filterCrypto === 'ALL' || t.cryptocurrency_id === filterCrypto;
    return typeMatch && cryptoMatch;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Trading Positions
          </h2>
          {selectedPortfolioId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filtered by: {portfolios.find(p => p.id === selectedPortfolioId)?.naziv}
            </Badge>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {transactions.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={clearAllTransactions}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="flex items-center gap-2"
            disabled={portfolios.length === 0 || cryptocurrencies.length === 0 || riskTypes.length === 0}
          >
            <Plus className="h-4 w-4" />
            New Position
          </Button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="flex gap-4 items-center flex-wrap">
        <div>
          <Label className="mr-2">Type:</Label>
          <Select value={filterType} onValueChange={v => setFilterType(v as 'ALL' | 'LONG' | 'SHORT')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="LONG">Long</SelectItem>
              <SelectItem value="SHORT">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mr-2">Cryptocurrency:</Label>
          <Select value={filterCrypto} onValueChange={v => setFilterCrypto(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {cryptocurrencies.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name} ({c.symbol})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(portfolios.length === 0 || cryptocurrencies.length === 0 || riskTypes.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prerequisites missing</h3>
            <p className="text-gray-500">
              {portfolios.length === 0 && "Create a portfolio first. "}
              {cryptocurrencies.length === 0 && "Cryptocurrency data not available. "}
              {riskTypes.length === 0 && "Risk types not available."}
            </p>
          </CardContent>
        </Card>
      )}

      {showForm && portfolios.length > 0 && cryptocurrencies.length > 0 && riskTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Position</CardTitle>
            <CardDescription>Open a new long or short position using current market prices</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionForm
              portfolios={portfolios}
              cryptocurrencies={cryptocurrencies}
              riskTypes={riskTypes}
              onSubmit={handleCreateTransaction}
              onCancel={() => setShowForm(false)}
              isLoading={createTransaction.isPending}
              defaultPortfolioId={selectedPortfolioId}
            />
          </CardContent>
        </Card>
      )}

      {filteredTransactions && filteredTransactions.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Cryptocurrency</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Risk Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => {
                  const currentPrice = transaction.cryptocurrency 
                    ? getCurrentPrice(transaction.cryptocurrency.symbol)
                    : 0;
                  const profitLoss = calculateProfitLoss(transaction);

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.datum).toLocaleDateString()}</TableCell>
                      <TableCell>{getPositionTypeBadge(transaction.tip_transakcije)}</TableCell>
                      <TableCell>
                        {transaction.cryptocurrency?.name} ({transaction.cryptocurrency?.symbol})
                      </TableCell>
                      <TableCell>{formatQuantity(transaction.kolicina)}</TableCell>
                      <TableCell>{formatCurrency(transaction.cijena)}</TableCell>
                      <TableCell>{formatCurrency(currentPrice)}</TableCell>
                      <TableCell>{getProfitLossBadge(profitLoss)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: transaction.risk_type?.color || '#gray-500' }}
                          />
                          {transaction.risk_type?.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-row items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditModal({ open: true, transaction })}
                          >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTransaction.mutate(transaction.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={editModal.open} onOpenChange={(open) => !open && setEditModal({ open: false, transaction: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
          </DialogHeader>
          {editModal.transaction && (
            <TransactionForm
              portfolios={portfolios}
              cryptocurrencies={cryptocurrencies}
              riskTypes={riskTypes}
              onSubmit={handleEditTransaction}
              onCancel={() => setEditModal({ open: false, transaction: null })}
              isLoading={editTransaction.isPending}
              initialValues={editModal.transaction}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManager;

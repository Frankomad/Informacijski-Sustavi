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

interface TransactionManagerProps {
  selectedPortfolioId: string | null;
}

const TransactionManager = ({ selectedPortfolioId }: TransactionManagerProps) => {
  const { portfolios } = usePortfolios();
  const { cryptocurrencies } = useCryptocurrencies();
  const { riskTypes } = useRiskTypes();
  const { transactions, isLoading, createTransaction, deleteTransaction, editTransaction } = useTransactions(selectedPortfolioId);
  const { getCurrentPrice } = useLivePrices();
  const [showForm, setShowForm] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; transaction: any }>({ open: false, transaction: null });

  const handleCreateTransaction = async (data: any) => {
    await createTransaction.mutateAsync(data);
    setShowForm(false);
  };

  const handleEditTransaction = async (data: any) => {
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
    return currentValue - entryValue;
  };

  const clearAllTransactions = async () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      for (const transaction of transactions) {
        await deleteTransaction.mutateAsync(transaction.id);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Transactions
          </h2>
          {selectedPortfolioId && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Filtered by: {portfolios.find(p => p.id === selectedPortfolioId)?.naziv}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
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
            Add Transaction
          </Button>
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
            <CardTitle>Create New Transaction</CardTitle>
            <CardDescription>Add a new buy or sell transaction using current market prices</CardDescription>
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

      {portfolios.length > 0 && cryptocurrencies.length > 0 && riskTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {selectedPortfolioId 
                ? `Showing transactions for ${portfolios.find(p => p.id === selectedPortfolioId)?.naziv}`
                : "Showing all transactions with real-time profit/loss calculations"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No transactions found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Cryptocurrency</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Risk Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => {
                    const portfolio = transaction.portfolio;
                    const crypto = transaction.cryptocurrency;
                    const riskType = transaction.risk_type;
                    const currentValue = calculateCurrentValue(transaction);
                    const profitLoss = calculateProfitLoss(transaction);
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.datum).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {portfolio?.naziv || ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{crypto?.name || ''}</div>
                            <div className="text-sm text-gray-500">{crypto?.symbol || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.tip_transakcije === 'BUY' ? 'default' : 'secondary'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {transaction.tip_transakcije === 'BUY' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {transaction.tip_transakcije}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className="flex items-center gap-1 w-fit"
                            style={{ 
                              borderColor: riskType?.color || '#gray-500',
                              color: riskType?.color || '#gray-500'
                            }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: riskType?.color || '#gray-500' }}
                            />
                            {riskType?.name || ''}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatQuantity(transaction.kolicina)}</TableCell>
                        <TableCell>{formatCurrency(transaction.cijena)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{formatCurrency(currentValue)}</div>
                            <div className="text-xs text-gray-500">
                              @ {formatCurrency(getCurrentPrice(crypto?.symbol || ''))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction.mutate(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditModal({ open: true, transaction })}
                            className="text-blue-500 hover:text-blue-700 ml-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={editModal.open} onOpenChange={open => setEditModal(v => ({ ...v, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            portfolios={portfolios}
            cryptocurrencies={cryptocurrencies}
            riskTypes={riskTypes}
            onSubmit={handleEditTransaction}
            onCancel={() => setEditModal({ open: false, transaction: null })}
            isLoading={editTransaction.isPending}
            initialValues={editModal.transaction ? {
              portfolio_id: editModal.transaction.portfolio_id,
              cryptocurrency_id: editModal.transaction.cryptocurrency_id,
              tip_transakcije: editModal.transaction.tip_transakcije,
              kolicina: editModal.transaction.kolicina,
              cijena: editModal.transaction.cijena,
              datum: editModal.transaction.datum,
              risk_type_id: editModal.transaction.risk_type_id,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManager;

import { useState } from "react";
import { usePortfolios } from "@/hooks/usePortfolios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Briefcase, Edit2 } from "lucide-react";
import PortfolioForm from "./PortfolioForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "./ui/dialog";

interface PortfolioManagerProps {
  onPortfolioSelect: (portfolioId: string | null) => void;
  selectedPortfolioId: string | null;
}

const PortfolioManager = ({ onPortfolioSelect, selectedPortfolioId }: PortfolioManagerProps) => {
  const { portfolios, isLoading, createPortfolio, deletePortfolio, editPortfolio } = usePortfolios();
  const [showForm, setShowForm] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; portfolio: any }>({ open: false, portfolio: null });

  const handleCreatePortfolio = async (data: { naziv: string; strategija: string }) => {
    await createPortfolio.mutateAsync(data);
    setShowForm(false);
  };

  const handleDeletePortfolio = (id: string) => {
    if (selectedPortfolioId === id) {
      onPortfolioSelect(null);
    }
    deletePortfolio.mutate(id);
  };

  const handleEditPortfolio = async (data: { naziv: string; strategija: string }) => {
    if (editModal.portfolio) {
      await editPortfolio.mutateAsync({ id: editModal.portfolio.id, data });
      setEditModal({ open: false, portfolio: null });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading portfolios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Portfolios
        </h2>
        <div className="flex gap-2">
          {selectedPortfolioId && (
            <Button variant="outline" onClick={() => onPortfolioSelect(null)}>
              Deselect
            </Button>
          )}
          <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Portfolio
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioForm
              onSubmit={handleCreatePortfolio}
              onCancel={() => setShowForm(false)}
              isLoading={createPortfolio.isPending}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolios.map((portfolio) => (
          <Card 
            key={portfolio.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPortfolioId === portfolio.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onPortfolioSelect(portfolio.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{portfolio.naziv}</CardTitle>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePortfolio(portfolio.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={e => {
                      e.stopPropagation();
                      setEditModal({ open: true, portfolio });
                    }}
                    className="text-blue-500 hover:text-blue-700 ml-2"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-3">
                {portfolio.strategija || 'No strategy defined'}
              </CardDescription>
              <div className="flex justify-between items-center">
                <Badge variant="outline">
                  {new Date(portfolio.datum_kreiranja).toLocaleDateString()}
                </Badge>
                {selectedPortfolioId === portfolio.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {portfolios.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
            <p className="text-gray-500">Create your first portfolio to get started</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={editModal.open} onOpenChange={open => setEditModal(v => ({ ...v, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Portfolio</DialogTitle>
          </DialogHeader>
          <PortfolioForm
            onSubmit={handleEditPortfolio}
            onCancel={() => setEditModal({ open: false, portfolio: null })}
            isLoading={editPortfolio.isPending}
            initialValues={editModal.portfolio ? { naziv: editModal.portfolio.naziv, strategija: editModal.portfolio.strategija } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioManager;

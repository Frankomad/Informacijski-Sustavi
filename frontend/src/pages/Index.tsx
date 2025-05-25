import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioManager from "@/components/PortfolioManager";
import TransactionManager from "@/components/TransactionManager";
import LivePriceTracker from "@/components/LivePriceTracker";
import RiskTypeManager from "@/components/RiskTypeManager";

const Index = () => {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cryptocurrency Portfolio Tracker</h1>
          <p className="text-lg text-gray-600">Manage your investment portfolios and track real-time cryptocurrency prices</p>
        </div>

        <div className="mb-6">
          <LivePriceTracker />
        </div>

        <Tabs defaultValue="portfolios" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="risk-types">Risk Types</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolios" className="space-y-6">
            <PortfolioManager 
              onPortfolioSelect={setSelectedPortfolioId}
              selectedPortfolioId={selectedPortfolioId}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <TransactionManager selectedPortfolioId={selectedPortfolioId} />
          </TabsContent>

          <TabsContent value="risk-types" className="space-y-6">
            <RiskTypeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioManager from "@/components/PortfolioManager";
import TransactionManager from "@/components/TransactionManager";
import LivePriceTracker from "@/components/LivePriceTracker";
import RiskTypeManager from "@/components/RiskTypeManager";
import Statistics from "@/components/Statistics";
import AuthForm from "@/components/AuthForm";

const Index = () => {
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("access_token");
    if (stored) setToken(stored);
  }, []);

  const handleAuthSuccess = (accessToken: string) => {
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
  };

  if (!token) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Cryptocurrency Portfolio Tracker</h1>
            <p className="text-lg text-muted-foreground">Manage your investment portfolios and track real-time cryptocurrency prices</p>
          </div>
          <button onClick={handleLogout} className="ml-4 px-4 py-2 rounded bg-muted text-foreground hover:bg-muted/80">Logout</button>
        </div>

        <div className="mb-6">
          <LivePriceTracker />
        </div>

        <Tabs defaultValue="portfolios" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="portfolios" className="data-[state=active]:bg-background">Portfolios</TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-background">Transactions</TabsTrigger>
            <TabsTrigger value="risk-types" className="data-[state=active]:bg-background">Risk Types</TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-background">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolios" className="space-y-6 mt-6">
            <PortfolioManager 
              onPortfolioSelect={setSelectedPortfolioId}
              selectedPortfolioId={selectedPortfolioId}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6 mt-6">
            <TransactionManager selectedPortfolioId={selectedPortfolioId} />
          </TabsContent>

          <TabsContent value="risk-types" className="space-y-6 mt-6">
            <RiskTypeManager />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6 mt-6">
            <Statistics selectedPortfolioId={selectedPortfolioId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

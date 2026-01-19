import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/integrations/firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AddNewDialog } from '@/components/dialog/AddNewDialog';
import { StatCard } from '@/components/dashboard/StatCard';
import { PolicyCard } from '@/components/dashboard/PolicyCard';
import { InvestmentCard } from '@/components/dashboard/InvestmentCard';
import { AlertCard } from '@/components/dashboard/AlertCard';
import { PortfolioChart } from '@/components/dashboard/PorfolioChart';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { Tutorial } from '@/components/tutorial/Tutorial';
import { AlertsPage } from './Alerts';
import { DocumentsPage } from './Documents';
import { SettingsPage } from './Settings';
import { ProfilePage } from './Profile';
import { Shield, TrendingUp, AlertCircle, Wallet, Download } from 'lucide-react';
import { useMoneyVisibility, formatCurrency } from '@/hooks/useMoneyVisibility';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useDocuments } from '@/hooks/useDocuments';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { SessionTimeoutDialog } from '@/components/security/SessionTimeoutDialog';
import { exportToPDF } from '@/lib/exportPDF';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startTutorial, setStartTutorial] = useState(false);
  const navigate = useNavigate();
  const { isVisible } = useMoneyVisibility();
  const { policies, investments, alerts } = useFinancialData();
  const { documents } = useDocuments();
  const filtered = useGlobalSearch(searchQuery, policies, investments, alerts);
  const { showWarning, timeLeft, keepAlive, logout } = useSessionTimeout();

  const handleExport = () => {
    try {
      exportToPDF(policies, investments, alerts, user?.email || 'user');
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        navigate('/auth');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-warning flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalPolicyCoverage = policies.reduce((sum, p) => sum + p.coverage, 0);
  const totalInvestmentValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
  const monthlyPremiums = policies
    .filter(p => p.premiumFrequency === 'monthly')
    .reduce((sum, p) => sum + p.premium, 0);
  const avgReturn = investments.length > 0 
    ? investments.reduce((sum, i) => sum + i.returnPercentage, 0) / investments.length 
    : 0;

  const renderContent = () => {
    switch (activeTab) {
      case 'policies':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">Your Policies</h1>
                <p className="text-muted-foreground mt-1">Manage all your insurance policies in one place</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.policies.map((policy) => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
              {filtered.policies.length === 0 && searchQuery && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No policies found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        );

      case 'investments':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold">Your Investments</h1>
                <p className="text-muted-foreground mt-1">Track your portfolio performance and growth</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.investments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
              {filtered.investments.length === 0 && searchQuery && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No investments found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        );

      case 'alerts':
        return <AlertsPage />;

      case 'documents':
        return <DocumentsPage />;

      case 'settings':
        return <SettingsPage userEmail={user?.email} onStartTutorial={() => setStartTutorial(true)} />;

      case 'profile':
        return <ProfilePage userEmail={user?.email} />;

      default:
        return (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold">Welcome back</h1>
                <p className="text-muted-foreground mt-1">Here's your financial overview at a glance</p>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleDateString('en-ZA', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <QuickStats policies={policies} investments={investments} isVisible={isVisible} documentsCount={documents.length} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Policies"
                value={policies.length.toString()}
                subtitle="Active insurance policies"
                icon={<Shield className="w-5 h-5" />}
              />
              <StatCard
                title="Investment Value"
                value={formatCurrency(totalInvestmentValue, isVisible)}
                trend="up"
                trendValue={`+${avgReturn.toFixed(1)}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                isCurrency
              />
              <StatCard
                title="Monthly Premiums"
                value={formatCurrency(monthlyPremiums, isVisible)}
                subtitle="Total monthly payments"
                icon={<Wallet className="w-5 h-5" />}
                isCurrency
              />
              <StatCard
                title="Pending Alerts"
                value={alerts.filter(a => a.priority === 'high').length.toString()}
                subtitle={`${alerts.length} total alerts`}
                icon={<AlertCircle className="w-5 h-5" />}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Alerts Section */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-display font-semibold">Upcoming Actions</h2>
                <div className="space-y-3">
                  {filtered.alerts
                    .sort((a, b) => {
                      // Sort by due date (earliest first)
                      if (a.dueDate && b.dueDate) {
                        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                      }
                      return 0;
                    })
                    .slice(0, 3)
                    .map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  {filtered.alerts.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-muted-foreground">
                      No alerts found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>

              {/* Portfolio Chart */}
              <div>
                <PortfolioChart investments={investments} />
              </div>
            </div>

            {/* Policies & Investments Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold">Recent Policies</h2>
                  <button 
                    onClick={() => setActiveTab('policies')}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {filtered.policies.slice(0, 2).map((policy) => (
                    <PolicyCard key={policy.id} policy={policy} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-semibold">Top Investments</h2>
                  <button 
                    onClick={() => setActiveTab('investments')}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {filtered.investments.slice(0, 2).map((investment) => (
                    <InvestmentCard key={investment.id} investment={investment} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SessionTimeoutDialog 
        open={showWarning} 
        timeLeft={timeLeft} 
        onKeepAlive={keepAlive} 
        onLogout={logout} 
      />
      <Tutorial forceStart={startTutorial} onComplete={() => setStartTutorial(false)} />
      <AddNewDialog open={addNewOpen} onOpenChange={setAddNewOpen} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onAddNew={() => setAddNewOpen(true)}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            userEmail={user?.email} 
            onSearch={setSearchQuery}
            onProfileClick={() => setActiveTab('profile')}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;

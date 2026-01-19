import { Bell, Search, User, Menu, Eye, EyeOff, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMoneyVisibility } from '@/hooks/useMoneyVisibility';
import { useTheme } from '@/hooks/useTheme';
import { auth } from '@/integrations/firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HeaderProps {
  onMenuClick?: () => void;
  userEmail?: string;
  onSearch?: (query: string) => void;
  onProfileClick?: () => void;
}

export function Header({ onMenuClick, userEmail, onSearch, onProfileClick }: HeaderProps) {
  const { isVisible, toggle } = useMoneyVisibility();
  const { isDark, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-warning flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FA</span>
            </div>
            <span className="font-display font-semibold text-lg">FinAssist</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full" data-tutorial="search">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search policies, investments..." 
              className="pl-10 bg-secondary border-0"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            data-tutorial="theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggle}
            title={isVisible ? 'Hide amounts' : 'Show amounts'}
            data-tutorial="visibility"
          >
            {isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" data-tutorial="notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Button>
          {userEmail && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              title="Sign out"
              data-tutorial="logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onProfileClick}
            title="Profile"
            data-tutorial="profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

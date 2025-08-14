import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWallet } from '../../context/WalletContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  LogOut, 
  Wallet,
  Shield,
  Menu
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wallet, disconnectWallet } = useWallet();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'supplier':
        return <Shield className="h-4 w-4" />;
      case 'vendor':
        return <User className="h-4 w-4" />;
      case 'customer':
        return <User className="h-4 w-4" />;
      case 'expert':
        return <Shield className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to={user ? `/dashboard/${user.role}` : '/dashboard'} className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Supply Chain DApp
                </h1>
                <p className="text-xs text-gray-500">Blockchain Powered</p>
              </div>
            </Link>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Wallet Info */}
              <div className="hidden md:flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-lg">
                <Wallet className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'No wallet'}
                </span>
              </div>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


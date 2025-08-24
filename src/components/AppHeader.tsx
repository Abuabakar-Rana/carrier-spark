import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from 'lucide-react';

export const AppHeader: React.FC = () => {
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="glass-effect border-b border-border/50 sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in-up">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-glow animate-pulse-glow">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Carrier Data
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced carrier data analytics platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 animate-slide-in-right">
            {profile && (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {profile.username} ({profile.role})
                </span>
                <div className="h-8 w-px bg-border/50" />
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="glass-effect hover:shadow-accent transition-all duration-300 hover:scale-105"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
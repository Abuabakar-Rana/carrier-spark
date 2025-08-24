import React from 'react';
import { Download, Database, Filter, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AppHeader: React.FC = () => {
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
                Carrier Filter Pro
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced carrier data analytics platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 animate-slide-in-right">
            <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary" />
                <span>Smart Filtering</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span>Real-time Analytics</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-border/50 hidden md:block" />
            
            <Button
              variant="outline"
              size="sm"
              className="glass-effect hover:shadow-accent transition-all duration-300 hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
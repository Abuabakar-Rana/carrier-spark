import React from 'react';
import { Heart, Github, ExternalLink, Zap } from 'lucide-react';

export const AppFooter: React.FC = () => {
  return (
    <footer className="glass-effect border-t border-border/50 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-accent rounded-lg">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-lg">Carrier Filter Pro</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Revolutionizing carrier data management with advanced filtering, 
              real-time analytics, and beautiful user experiences.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-destructive animate-pulse" />
              <span>by developers, for developers</span>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-4 animate-fade-in-up [animation-delay:200ms]">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground transition-colors cursor-pointer">
                ✨ Smart Filtering Engine
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                📊 Real-time Analytics
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                📁 Data Export & Download
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                🎨 Beautiful Dark Theme
              </li>
              <li className="hover:text-foreground transition-colors cursor-pointer">
                📱 Responsive Design
              </li>
            </ul>
          </div>
          
          {/* Links & Stats */}
          <div className="space-y-4 animate-fade-in-up [animation-delay:400ms]">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="space-y-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:translate-x-1 group"
              >
                <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              
              <div className="pt-4 space-y-2">
                <div className="text-xs text-muted-foreground">
                  <span className="font-mono">v2.1.0</span> • Last updated: Today
                </div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>🚀 99.9% Uptime</span>
                  <span>⚡ Sub-100ms Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-xs text-muted-foreground">
            © 2024 Carrier Filter Pro. Crafted with precision and passion.
          </div>
          <div className="flex items-center space-x-6 text-xs text-muted-foreground">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
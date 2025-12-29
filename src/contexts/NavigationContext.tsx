import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Home,
  Hexagon, // Brands
  Car, // Vehicles  
  CircleDot, // Wheels
  Wrench, // Garage
  Plus, // Contribute
  User, // Profile
  Code, // Dev
  LogIn, // Login
  Package
} from 'lucide-react';

export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ElementType;
  timestamp: number;
}

interface NavigationContextType {
  history: NavigationItem[];
  clearHistory: () => void;
  removeFromHistory: (index: number, navigate?: (path: string) => void) => void;
  updateCurrentLabel: (label: string) => void;
  startNewHistory: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Helper to get icon for path
const getIconForPath = (path: string): React.ElementType => {
  if (path === '/') return Home;
  if (path.includes('/brands')) return Hexagon;
  if (path.includes('/vehicles')) return Car;
  if (path.includes('/wheels') || path.includes('/wheel/')) return CircleDot;
  if (path.includes('/garage')) return Wrench;
  if (path.includes('/contribute')) return Plus;
  if (path.includes('/profile')) return User;
  if (path.includes('/dev')) return Code;
  if (path.includes('/login')) return LogIn;
  return Home;
};

// Helper to get label for path
const getLabelForPath = (path: string, params?: any): string => {
  const segments = path.split('/').filter(Boolean);

  if (path === '/') return 'Home';

  // Main pages
  if (path === '/brands') return 'Brands';
  if (path === '/vehicles') return 'Vehicles';
  if (path === '/wheels') return 'Wheels';
  if (path === '/garage') return 'Garage';
  if (path === '/contribute') return 'Contribute';
  if (path === '/profile') return 'Profile';
  if (path === '/dev') return 'Dev';
  if (path === '/login') return 'Login';

  // Detail pages - extract from URL
  if (segments.length >= 2) {
    const lastSegment = decodeURIComponent(segments[segments.length - 1]);

    // Check if it's a detail page
    if (segments[0] === 'brands' && segments.length === 2) {
      // Clean up brand name
      return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (segments[0] === 'vehicles' && segments.length === 2) {
      // Clean up vehicle name
      return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (segments[0] === 'wheels' && segments.length === 2) {
      // Clean up wheel name
      return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    if (segments[0] === 'wheel' && segments.length === 2) {
      return `Wheel #${lastSegment}`; // Wheel ID
    }

    // Dev templates
    if (segments[0] === 'dev' && segments[1] === 'templates') {
      if (segments[2] === 'vehicles') return 'Vehicle Templates';
      if (segments[2] === 'vehicle-detail') return 'Vehicle Detail Template';
      if (segments[2] === 'brands') return 'Brand Templates';
      if (segments[2] === 'wheels') return 'Wheel Templates';
    }
  }

  // Fallback - clean up the last segment
  if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return 'Page';
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [history, setHistory] = useState<NavigationItem[]>([]);
  const [shouldResetOnNext, setShouldResetOnNext] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;

    // If we should reset (from sidebar click), start fresh
    if (shouldResetOnNext) {
      setHistory([{
        path: currentPath,
        label: getLabelForPath(currentPath),
        icon: getIconForPath(currentPath),
        timestamp: Date.now()
      }]);
      setShouldResetOnNext(false);
      return;
    }

    // Don't add duplicate - check if this path already exists anywhere in history
    const existingIndex = history.findIndex(item => item.path === currentPath);
    if (existingIndex !== -1) {
      // Path exists - just update its label and move it to the end
      setHistory(prev => {
        const updated = [...prev];
        const [existingItem] = updated.splice(existingIndex, 1);
        return [...updated, {
          ...existingItem,
          label: getLabelForPath(currentPath),
          timestamp: Date.now()
        }];
      });
      return;
    }

    // Main collection pages - smart reset logic
    const mainCollections = ['/brands', '/vehicles', '/wheels'];
    if (mainCollections.includes(currentPath)) {
      // Check if we're coming from a related detail page
      const isFromRelatedDetail = history.length > 0 &&
        history.some(item => {
          if (currentPath === '/brands') return item.path.startsWith('/brand/');
          if (currentPath === '/vehicles') return item.path.startsWith('/vehicle/');
          if (currentPath === '/wheels') return item.path.startsWith('/wheel/');
          return false;
        });

      // If coming from related detail, keep hierarchy; otherwise reset
      if (!isFromRelatedDetail) {
        setHistory([{
          path: currentPath,
          label: getLabelForPath(currentPath),
          icon: getIconForPath(currentPath),
          timestamp: Date.now()
        }]);
        return;
      }

      // Coming from related detail - check if parent already exists
      const hasParent = history.some(item => item.path === currentPath);
      if (!hasParent) {
        // Add parent to hierarchy
        setHistory(prev => [...prev, {
          path: currentPath,
          label: getLabelForPath(currentPath),
          icon: getIconForPath(currentPath),
          timestamp: Date.now()
        }]);
      }
      return;
    }

    // For detail pages, ensure parent exists
    const detailRoutes = {
      '/brand/': { parent: '/brands', label: 'Brands', icon: Hexagon },
      '/vehicle/': { parent: '/vehicles', label: 'Vehicles', icon: Car },
      '/wheel/': { parent: '/wheels', label: 'Wheels', icon: CircleDot }
    };

    for (const [route, config] of Object.entries(detailRoutes)) {
      if (currentPath.startsWith(route)) {
        const hasParent = history.some(item => item.path === config.parent);
        const items: NavigationItem[] = [];

        if (!hasParent) {
          items.push({
            path: config.parent,
            label: config.label,
            icon: config.icon,
            timestamp: Date.now() - 1
          });
        }

        items.push({
          path: currentPath,
          label: getLabelForPath(currentPath),
          icon: getIconForPath(currentPath),
          timestamp: Date.now()
        });

        setHistory(prev => [...prev, ...items]);
        return;
      }
    }

    // Default behavior - just add to history
    const newItem: NavigationItem = {
      path: currentPath,
      label: getLabelForPath(currentPath),
      icon: getIconForPath(currentPath),
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, newItem]);
  }, [location.pathname, shouldResetOnNext]);

  const clearHistory = React.useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = React.useCallback((index: number, navigate?: (path: string) => void) => {
    setHistory(prev => {
      const newHistory = prev.filter((_, i) => i !== index);
      // If removing a middle item and navigate function provided, go to previous item
      if (navigate && index < prev.length - 1 && index > 0) {
        navigate(prev[index - 1].path);
      }
      return newHistory;
    });
  }, []);

  const updateCurrentLabel = React.useCallback((label: string) => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        label
      };
      return updated;
    });
  }, []);

  const startNewHistory = React.useCallback((path: string) => {
    setShouldResetOnNext(true);
  }, []);

  return (
    <NavigationContext.Provider value={{ history, clearHistory, removeFromHistory, updateCurrentLabel, startNewHistory }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
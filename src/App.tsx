/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Home as HomeIcon, CalendarDays, ShoppingCart, Heart, Settings, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Planner from "./pages/Planner";
import ShoppingList from "./pages/ShoppingList";
import Vision from "./pages/Vision";
import RecipeDetail from "./pages/RecipeDetail";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Planner", path: "/planner", icon: CalendarDays },
    { name: "Vision", path: "/vision", icon: Camera },
    { name: "Shopping", path: "/shopping", icon: ShoppingCart },
    { name: "Favorites", path: "/favorites", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 flex flex-col max-w-7xl mx-auto">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md h-16 flex justify-between items-center px-8 border-b border-green-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-on-primary font-black text-xl shadow-lg">V</div>
          <h1 className="text-2xl font-black tracking-tight text-primary">VeggiePlan <span className="text-green-500 font-normal underline decoration-green-200 decoration-4">Organic</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-primary hover:bg-green-50 rounded-xl transition-all">
            <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto pt-6 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-t border-green-100 px-6 py-4 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        <div className="max-w-2xl mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center transition-all duration-300 relative group",
                  isActive ? "text-primary pb-1" : "text-green-700/50 hover:text-primary"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-2xl transition-all duration-500 relative overflow-hidden",
                  isActive ? "bg-primary text-on-primary shadow-lg shadow-primary/20 -translate-y-2 scale-110" : "hover:bg-green-50"
                )}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[9px] font-black mt-1 uppercase tracking-[0.15em] transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-60"
                )}>{item.name}</span>
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/shopping" element={<ShoppingList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<div className="p-10 text-center text-outline">Your favorite recipes will appear here.</div>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

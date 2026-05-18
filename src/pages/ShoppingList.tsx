import { useState } from "react";
import { Search, PlusCircle, Leaf, Package, Milk, CheckCircle2, Circle, Trash2, Plus, ShoppingBasket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: "1", name: "Organic Baby Spinach", amount: "250g bag", category: "Produce", checked: false },
  { id: "2", name: "Avocados", amount: "2 ripe units", category: "Produce", checked: false },
  { id: "3", name: "Cherry Tomatoes", amount: "1 punnet", category: "Produce", checked: false },
  { id: "4", name: "Quinoa", amount: "500g", category: "Pantry", checked: true },
  { id: "5", name: "Extra Virgin Olive Oil", amount: "Cold pressed, 1L", category: "Pantry", checked: false },
  { id: "6", name: "Greek Yogurt", amount: "Plain, 500g", category: "Dairy", checked: false },
];

export default function ShoppingList() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="px-5 pt-8 pb-32 space-y-8">
      {/* Search Header */}
      <section className="relative">
        <div className="bg-surface-container rounded-2xl p-1 flex items-center shadow-inner">
          <Search className="ml-4 text-outline" size={20} />
          <input 
            className="w-full bg-transparent border-none focus:ring-0 py-4 px-4 text-sm font-medium placeholder:text-outline/40"
            placeholder="Add ingredients from a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-outline-variant/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 flex items-center gap-4 hover:bg-surface-container cursor-pointer transition-all border-b border-outline-variant/10">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary">
                <Plus size={24} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Add "{search}" to list</p>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Manual entry</p>
              </div>
              <PlusCircle className="text-primary" size={24} />
            </div>
          </motion.div>
        )}
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your List</h2>
        <span className="px-4 py-1.5 bg-primary-container text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
          {items.filter(i => !i.checked).length} ITEMS LEFT
        </span>
      </div>

      <div className="space-y-10">
        {categories.map(cat => (
          <section key={cat} className="space-y-4">
            <div className="flex items-center gap-3 text-primary/40 pl-1">
              {cat === "Produce" && <Leaf size={18} />}
              {cat === "Pantry" && <Package size={18} />}
              {cat === "Dairy" && <Milk size={18} />}
              <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">{cat}</h3>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {items.filter(i => i.category === cat).map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group relative overflow-hidden rounded-3xl bg-white p-5 flex items-center gap-5 shadow-sm border border-outline-variant/10 transition-all ${item.checked ? "opacity-60 bg-surface-container/50 grayscale" : "hover:shadow-md"}`}
                  >
                    <button onClick={() => toggleItem(item.id)} className="transition-transform active:scale-90">
                      {item.checked ? (
                        <CheckCircle2 size={24} className="text-primary" fill="currentColor" fillOpacity={0.1} />
                      ) : (
                        <Circle size={24} className="text-outline-variant" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`font-bold text-sm transition-all ${item.checked ? "line-through text-outline" : "text-on-surface"}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] font-bold text-outline uppercase tracking-wider">{item.amount}</p>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-outline hover:text-error hover:bg-error/5 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        ))}
      </div>

      {/* Floating Clear */}
      <div className="fixed bottom-28 right-8 z-50">
        <button 
          onClick={() => setItems([])}
          className="w-16 h-16 bg-primary text-white rounded-3xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        >
          <Trash2 size={28} />
        </button>
      </div>
    </div>
  );
}

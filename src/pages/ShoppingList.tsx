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
  { id: "1", name: "Bio bébispenót", amount: "250g tasak", category: "Zöldség", checked: false },
  { id: "2", name: "Avokádó", amount: "2 érett darab", category: "Zöldség", checked: false },
  { id: "3", name: "Koktélparadicsom", amount: "1 doboz", category: "Zöldség", checked: false },
  { id: "4", name: "Quinoa", amount: "500g", category: "Kamra", checked: true },
  { id: "5", name: "Extra szűz olívaolaj", amount: "Hidegen préselt, 1L", category: "Kamra", checked: false },
  { id: "6", name: "Görög joghurt", amount: "Natúr, 500g", category: "Tejtermék", checked: false },
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
    <div className="px-4 pt-10 pb-40 space-y-12 max-w-4xl mx-auto">
      {/* Search Header */}
      <header className="space-y-6">
        <div className="relative group">
          <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full h-16 pl-14 pr-6 bg-white/60 backdrop-blur shadow-inner border border-green-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-base font-medium placeholder:text-green-800/30"
            placeholder="Hozzávalók hozzáadása receptből..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mt-3 overflow-hidden absolute z-50 w-full"
          >
            <div className="p-5 flex items-center gap-5 hover:bg-green-50 cursor-pointer transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                <Plus size={24} strokeWidth={3} />
              </div>
              <div className="flex-1">
                <p className="font-black text-green-900 italic">"{search}" hozzáadása</p>
                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Kézi bevitel</p>
              </div>
              <PlusCircle className="text-primary" size={28} />
            </div>
          </motion.div>
        )}
      </header>

      <div className="flex items-center justify-between border-b-4 border-green-100 pb-4">
        <h2 className="text-3xl font-black text-green-900 tracking-tight">Vár ránk a bolt</h2>
        <span className="tag-green px-4 py-2 font-black">
          {items.filter(i => !i.checked).length} HIÁNYZIK
        </span>
      </div>

      <div className="space-y-12">
        {categories.map(cat => (
          <section key={cat} className="space-y-6">
            <div className="flex items-center gap-4 text-primary pl-1">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                {cat === "Zöldség" && <Leaf size={18} />}
                {cat === "Kamra" && <Package size={18} />}
                {cat === "Tejtermék" && <Milk size={18} />}
              </div>
              <h3 className="text-[12px] font-black tracking-[0.3em] uppercase text-green-800/40">{cat}</h3>
              <div className="flex-1 h-px bg-green-50" />
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.filter(i => i.category === cat).map(item => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group glass-card p-6 flex items-center gap-6 transition-all ${item.checked ? "opacity-40 grayscale scale-[0.98] border-transparent" : "hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"}`}
                  >
                    <button 
                      onClick={() => toggleItem(item.id)} 
                      className="transition-all transform active:scale-[0.8]"
                    >
                      {item.checked ? (
                        <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                          <CheckCircle2 size={20} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl border-3 border-green-200 group-hover:border-primary transition-colors flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </button>
                    
                    <div className="flex-1 select-none cursor-pointer" onClick={() => toggleItem(item.id)}>
                      <p className={`text-lg font-black transition-all ${item.checked ? "line-through text-green-900/40" : "text-green-900"}`}>
                        {item.name}
                      </p>
                      <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.2em]">{item.amount}</p>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-3 text-green-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        ))}
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-32 right-10 z-50 md:bottom-12 md:right-12">
        <button 
          onClick={() => setItems([])}
          className="w-20 h-20 bg-red-500 text-white rounded-[28px] shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center justify-center hover:scale-110 hover:bg-red-600 active:scale-95 transition-all transform border-4 border-white"
        >
          <Trash2 size={32} />
        </button>
      </div>
    </div>
  );
}

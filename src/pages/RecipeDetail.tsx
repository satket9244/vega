import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Flame, Users, CheckCircle2, ChevronRight, ShoppingBasket } from "lucide-react";
import { SAMPLE_RECIPES } from "./Home";
import { motion } from "motion/react";

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = SAMPLE_RECIPES.find(r => r.id === id);

  if (!recipe) return <div className="p-10 text-center">Recipe not found</div>;

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative h-[450px] md:h-[600px] overflow-hidden">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary shadow-2xl hover:bg-primary hover:text-white transition-all transform active:scale-90"
        >
          <ArrowLeft size={24} />
        </button>
        <img src={recipe.image} className="w-full h-full object-cover scale-105" alt={recipe.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-10 max-w-7xl mx-auto">
          <div className="flex gap-2 mb-4">
            <span className="tag-green bg-green-500 text-white">{recipe.category}</span>
            <span className="tag-green">Vegetarian</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 filter drop-shadow-xl">{recipe.name}</h1>
          <div className="flex flex-wrap gap-8 text-white/90 text-sm font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2.5"><Clock size={20} className="text-green-400" /> {recipe.time}</div>
            <div className="flex items-center gap-2.5"><Flame size={20} className="text-orange-400" /> {recipe.calories} kcal</div>
            <div className="flex items-center gap-2.5"><Users size={20} className="text-blue-400" /> 2 adag</div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-10">
            {/* Nutrients */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-black mb-8 text-green-900 border-b border-green-100 pb-4">Tápértékek</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Kalória", value: recipe.calories, unit: "kcal" },
                  { label: "Fehérje", value: recipe.nutrients.protein, unit: "" },
                  { label: "Szénhidrát", value: recipe.nutrients.carbs, unit: "" },
                  { label: "Zsír", value: recipe.nutrients.fat, unit: "" },
                ].map((stat, i) => (
                  <div key={i} className="p-5 bg-green-50/50 rounded-2xl text-center border border-green-100/50">
                    <span className="block text-2xl font-black text-primary">{stat.value}{stat.unit}</span>
                    <span className="text-[10px] font-black text-green-700/50 tracking-[0.15em] uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="glass-card p-8">
              <div className="flex justify-between items-center mb-8 border-b border-green-100 pb-4">
                <h3 className="text-xl font-black text-green-900">Hozzávalók</h3>
                <span className="text-[10px] font-black text-primary bg-green-100 px-3 py-1 rounded-full">{recipe.ingredients.length} TÉTEL</span>
              </div>
              <ul className="space-y-5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-6 h-6 rounded-lg border-2 border-green-200 group-hover:border-primary group-hover:bg-green-50 transition-all flex-shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-base font-bold text-green-900/80 group-hover:text-primary transition-colors">
                      <span className="text-primary font-black underline decoration-green-100">{ing.amount}</span> {ing.item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <div className="glass-card p-10 md:p-14">
              <h3 className="text-3xl font-black mb-10 text-green-900 flex items-center gap-4">
                Elkészítés 
                <div className="flex-1 h-px bg-green-100" />
              </h3>
              
              <div className="space-y-12">
                {recipe.instructions.map((step, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="flex gap-8 relative"
                  >
                    {i < recipe.instructions.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-[-48px] w-0.5 bg-green-100" />
                    )}
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xl shadow-xl shadow-primary/20 z-10">
                      {i + 1}
                    </div>
                    <p className="text-lg text-green-900/70 font-medium leading-relaxed pt-2">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action */}
      <div className="fixed bottom-32 right-10 z-50 md:bottom-12 md:right-12">
        <button className="bg-primary text-white h-20 px-10 rounded-[28px] shadow-[0_20px_50px_rgba(22,101,52,0.3)] flex items-center gap-4 hover:scale-105 hover:bg-green-700 active:scale-95 transition-all transform">
          <ShoppingBasket size={28} />
          <span className="font-black text-sm uppercase tracking-[0.25em]">Mindent a listára</span>
        </button>
      </div>
    </div>
  );
}

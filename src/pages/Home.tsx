import { useState } from "react";
import { Search, Filter, Clock, Flame, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Recipe } from "../types";

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "avocado-bowl",
    name: "Avokádó Buddha Tál",
    description: "Egy buja és vibráló Buddha-tál, tele friss avokádószeletekkel, sült édesburgonyával, kelkáposztával, csicseriborsóval és quinoával.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
    time: "15 perc",
    calories: 340,
    difficulty: "Easy",
    category: "Ebéd",
    nutrients: { protein: "12g", carbs: "42g", fat: "14g" },
    ingredients: [
      { item: "Avokádó", amount: "1/2 darab" },
      { item: "Kelkáposzta", amount: "1 csésze" },
      { item: "Sült édesburgonya", amount: "150g" },
      { item: "Csicseriborsó", amount: "100g" },
      { item: "Quinoa", amount: "1/2 csésze" }
    ],
    instructions: [
      "Masszírozzuk át a kelkáposztát egy kevés olívaolajjal.",
      "Állítsuk össze az összes hozzávalót egy tálba.",
      "Locsoljuk meg tahini öntettel."
    ]
  },
  {
    id: "spinach-pasta",
    name: "Krémes spenótos tészta",
    description: "Közeli felvétel krémes spenótos tésztáról, frissen reszelt parmezánnal és fekete borssal díszítve.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=2080&auto=format&fit=crop",
    time: "20 perc",
    calories: 450,
    difficulty: "Medium",
    category: "Vacsora",
    nutrients: { protein: "15g", carbs: "60g", fat: "18g" },
    ingredients: [
      { item: "Spagetti", amount: "200g" },
      { item: "Bébispenót", amount: "200g" },
      { item: "Fokhagyma", amount: "2 gerezd" },
      { item: "Tejszín", amount: "100ml" },
      { item: "Parmezán", amount: "30g" }
    ],
    instructions: [
      "Főzzük ki a spagettit al dente állagúra.",
      "Pároljuk meg a fokhagymát és a spenótot, amíg összeesik.",
      "Adjuk hozzá a tejszínt és a parmezánt, majd keverjük össze a tésztával."
    ]
  },
  {
    id: "feta-salad",
    name: "Kerti feta saláta",
    description: "Vibráló mediterrán saláta koktélparadicsommal, uborkával, olajbogyóval és friss feta sajtkockákkal.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1974&auto=format&fit=crop",
    time: "10 perc",
    calories: 280,
    difficulty: "Easy",
    category: "Ebéd",
    nutrients: { protein: "8g", carbs: "12g", fat: "22g" },
    ingredients: [
      { item: "Uborka", amount: "1 darab" },
      { item: "Koktélparadicsom", amount: "150g" },
      { item: "Feta sajt", amount: "100g" },
      { item: "Olajbogyó", amount: "50g" }
    ],
    instructions: [
      "Kockázzuk fel az uborkát és felezzük el a paradicsomokat.",
      "Keverjük össze egy tálban az olajbogyóval.",
      "Szórjuk meg morzsolt fetával és locsoljuk meg olívaolajjal."
    ]
  }
];

const CATEGORIES = ["Összes", "Reggeli", "Ebéd", "Vacsora", "Vegán", "Magas fehérje"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Összes");
  const [search, setSearch] = useState("");

  const filteredRecipes = SAMPLE_RECIPES.filter(r => 
    (selectedCategory === "Összes" || r.category === selectedCategory) &&
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-6 space-y-10 pb-20 max-w-6xl mx-auto">
      {/* Search & Categories */}
      <section className="space-y-6">
        <div className="relative group">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Keresés egészséges receptek között..."
            className="w-full h-16 pl-14 pr-6 bg-white/60 backdrop-blur shadow-inner border border-green-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-base font-medium placeholder:text-green-800/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 ${
                selectedCategory === cat 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                  : "bg-white/50 text-green-700/70 border border-green-100 hover:bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Card */}
      <Link to="/recipe/avocado-bowl">
        <section className="relative overflow-hidden rounded-[32px] shadow-2xl group cursor-pointer aspect-[16/9] border-4 border-white/50">
          <img 
            src={SAMPLE_RECIPES[0].image} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/30 to-transparent flex flex-col justify-end p-10">
            <div className="space-y-3">
              <span className="bg-green-500 text-white text-[9px] font-black px-5 py-1.5 rounded-full uppercase tracking-[0.25em]">Séf ajánlata</span>
              <h2 className="text-4xl font-black text-white leading-tight filter drop-shadow-lg">Avokádó Buddha Tál</h2>
              <div className="flex items-center gap-6 text-white/90 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Clock size={16} /> 15 perc</span>
                <span className="flex items-center gap-2 text-orange-400"><Flame size={16} /> 340 kcal</span>
              </div>
            </div>
          </div>
        </section>
      </Link>

      {/* Recommended Grid */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-green-100 pb-4">
          <h3 className="text-2xl font-black text-green-900">Neked ajánljuk</h3>
          <button className="text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:underline">Összes megtekintése</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group">
              <motion.div 
                whileHover={{ y: -8 }}
                className="glass-card overflow-hidden h-full flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={recipe.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={recipe.name} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="tag-green">{recipe.category}</span>
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-primary shadow-xl hover:bg-primary hover:text-white transition-all transform active:scale-90">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <h4 className="text-xl font-black leading-tight text-green-900 flex-1">{recipe.name}</h4>
                  <div className="flex flex-wrap gap-4 text-green-700/60 font-bold text-[10px] uppercase tracking-widest pt-4 border-t border-green-50">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {recipe.time}</span>
                    <span className="flex items-center gap-1.5 text-orange-500/70"><Flame size={14} /> {recipe.calories} kcal</span>
                    <span className="ml-auto px-2 py-0.5 bg-green-50 rounded italic font-medium lowercase">
                      {recipe.difficulty === 'Easy' ? 'Könnyű' : recipe.difficulty === 'Medium' ? 'Közepes' : 'Nehéz'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

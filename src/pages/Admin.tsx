import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRecipes } from '../hooks/useRecipes';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { profile } = useAuth();
  const { recipes, loading, addRecipe, editRecipe, removeRecipe } = useRecipes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    name: '',
    description: '',
    image: '',
    time: '20 perc',
    calories: 300,
    difficulty: 'Easy',
    category: 'Lunch',
    nutrients: { protein: '10g', carbs: '30g', fat: '10g' },
    ingredients: [{ item: 'Ingredient 1', amount: '100g' }],
    instructions: ['Step 1']
  });

  if (!profile?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
          <X size={40} />
        </div>
        <h2 className="text-3xl font-black text-green-900 italic">Hozzáférés Megtagadva</h2>
        <p className="text-green-600 font-bold">Nincs jogosultságod az admin felülethez.</p>
      </div>
    );
  }

  const handleEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setFormData({ ...recipe });
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (editingId) {
      await editRecipe(editingId, formData);
      setEditingId(null);
    } else if (isAdding) {
      await addRecipe(formData);
      setIsAdding(false);
    }
  };

  return (
    <div className="px-5 pt-10 pb-40 space-y-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-green-100 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="tag-green font-black">Menedzsment</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <h1 className="text-6xl font-black text-green-900 tracking-tighter">Admin <span className="text-primary italic">Központ</span></h1>
          <p className="text-green-600 font-bold max-w-md">Kezeld a receptgyűjteményt, szerkeszd a tartalmakat és állítsd be a képeket.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-green-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-green-600/40 hover:text-green-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-green-600/40 hover:text-green-600'}`}
            >
              <ListIcon size={20} />
            </button>
          </div>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({
              name: '',
              description: '',
              image: '',
              time: '20 perc',
              calories: 300,
              difficulty: 'Easy',
              category: 'Ebéd',
              nutrients: { protein: '10g', carbs: '30g', fat: '10g' },
              ingredients: [{ item: '', amount: '' }],
              instructions: ['']
            }); }}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Plus size={24} strokeWidth={3} />
            ÚJ RECEPT
          </button>
        </div>
      </header>

      {(isAdding || editingId) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 space-y-10 border-2 border-primary/20"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-green-900 italic">
              {isAdding ? 'Új Recept Létrehozása' : 'Recept Szerkesztése'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 text-green-300 hover:text-red-500 transition-colors">
              <X size={32} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Recept Neve</label>
                <input 
                  className="w-full h-16 px-6 bg-green-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 placeholder:text-green-800/20 font-bold"
                  placeholder="Pl. Medvehagymás Rizottó"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Leírás</label>
                <textarea 
                  className="w-full p-6 bg-green-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 placeholder:text-green-800/20 font-medium min-h-[150px]"
                  placeholder="Rövid kedvcsináló..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Idő</label>
                  <input 
                    className="w-full h-14 px-4 bg-green-50 border-none rounded-xl font-bold text-center"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Kalória</label>
                  <input 
                    type="number"
                    className="w-full h-14 px-4 bg-green-50 border-none rounded-xl font-bold text-center"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Kategória</label>
                  <select 
                    className="w-full h-14 px-4 bg-green-50 border-none rounded-xl font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Ebéd</option>
                    <option>Reggeli</option>
                    <option>Vacsora</option>
                    <option>Vegán</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Kép URL</label>
                <div className="flex gap-4">
                  <input 
                    className="flex-1 h-16 px-6 bg-green-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 font-mono text-xs"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-primary overflow-hidden border-2 border-primary/10">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-green-600 uppercase tracking-widest pl-1">Összetevők</label>
                  <button 
                    onClick={() => setFormData({ ...formData, ingredients: [...formData.ingredients, { item: '', amount: '' }] })}
                    className="p-2 bg-green-100 text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        className="flex-1 h-12 px-4 bg-white border border-green-50 rounded-xl text-sm font-bold"
                        placeholder="Név"
                        value={ing.item}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].item = e.target.value;
                          setFormData({ ...formData, ingredients: newIngs });
                        }}
                      />
                      <input 
                        className="w-24 h-12 px-4 bg-white border border-green-50 rounded-xl text-sm font-bold"
                        placeholder="Menny."
                        value={ing.amount}
                        onChange={(e) => {
                          const newIngs = [...formData.ingredients];
                          newIngs[idx].amount = e.target.value;
                          setFormData({ ...formData, ingredients: newIngs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-10 border-t border-green-50">
            <button 
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="px-10 h-16 rounded-2xl font-black text-green-400 hover:text-red-500 transition-colors"
            >
              MÉGSE
            </button>
            <button 
              onClick={handleSave}
              className="px-12 h-16 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Save size={24} />
              MENTÉS
            </button>
          </div>
        </motion.div>
      )}

      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : 'space-y-6'}>
        {recipes.map(recipe => (
          <motion.div 
            layout
            key={recipe.id}
            className={`glass-card overflow-hidden group transition-all ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'flex flex-col'}`}
          >
            <div className={`relative overflow-hidden bg-green-50 ${viewMode === 'list' ? 'w-24 h-24 rounded-2xl shrink-0' : 'aspect-video'}`}>
              <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={recipe.name} />
              <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[8px] font-black uppercase tracking-widest text-primary">
                {recipe.category}
              </div>
            </div>

            <div className={`flex-1 ${viewMode === 'list' ? '' : 'p-6 space-y-4'}`}>
              <h3 className="text-xl font-black text-green-900 truncate">{recipe.name}</h3>
              {viewMode === 'grid' && (
                <p className="text-sm font-medium text-green-600 line-clamp-2">{recipe.description}</p>
              )}
            </div>

            <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'px-4' : 'p-6 border-t border-green-50'}`}>
              <button 
                onClick={() => handleEdit(recipe)}
                className="w-12 h-12 rounded-xl bg-green-50 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center"
              >
                <Edit2 size={20} />
              </button>
              <button 
                onClick={() => removeRecipe(recipe.id)}
                className="w-12 h-12 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

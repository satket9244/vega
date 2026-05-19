import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Recipe } from '../types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('name'));
    return onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
      setRecipes(docs);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'recipes');
    });
  }, []);

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    try {
      await addDoc(collection(db, 'recipes'), recipe);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'recipes');
    }
  };

  const editRecipe = async (id: string, recipe: Partial<Recipe>) => {
    try {
      await updateDoc(doc(db, 'recipes', id), recipe);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `recipes/${id}`);
    }
  };

  const removeRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `recipes/${id}`);
    }
  };

  return { recipes, loading, addRecipe, editRecipe, removeRecipe };
}

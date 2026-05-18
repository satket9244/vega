export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  time: string;
  calories: number;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  nutrients: {
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: {
    item: string;
    amount: string;
  }[];
  instructions: string[];
}

export interface MealPlan {
  days: {
    day: string;
    meals: {
      breakfast: MealItem;
      lunch: MealItem;
      dinner: MealItem;
      dessert?: MealItem;
    };
  }[];
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  time: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: "Produce" | "Pantry" | "Dairy" | "Other";
  checked: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export let categories: Category[] = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
  { id: '3', name: 'Shopping' },
];

export const categoryModel = {
  getAll: () => categories,
  add: (name: string) => {
    // Prevent duplicates
    if (categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      return null;
    }
    const newCategory = {
      id: Math.random().toString(36).substring(2, 9),
      name,
    };
    categories.push(newCategory);
    return newCategory;
  },
  delete: (name: string) => {
    const index = categories.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (index === -1) return false;
    
    categories.splice(index, 1);

    // If we deleted the last category, re-initialize with "Personal"
    if (categories.length === 0) {
      categories.push({ id: '1', name: 'Personal' });
    }

    return true;
  }
};

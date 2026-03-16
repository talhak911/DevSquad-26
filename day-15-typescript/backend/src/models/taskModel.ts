export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  createdAt: Date;
}

export let tasks: Task[] = [];

export const taskModel = {
  getAll: () => tasks,
  getById: (id: string) => tasks.find((task) => task.id === id),
  add: (title: string, category: string = 'Personal') => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      category,
      completed: false,
      createdAt: new Date(),
    };
    tasks.push(newTask);
    return newTask;
  },
  update: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    return tasks[taskIndex];
  },
  delete: (id: string) => {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return false;
    tasks.splice(taskIndex, 1);
    return true;
  },
};

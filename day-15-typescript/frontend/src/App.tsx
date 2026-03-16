import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ListTodo, Loader2, Layout as LayoutIcon, ChevronRight, Menu, X } from "lucide-react";
import { taskApi, categoryApi, type Task, type Category } from "@/lib/api";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TodoForm } from "@/components/TodoForm";
import { TodoItem } from "@/components/TodoItem";
import { Stats } from "@/components/Stats";
import { ModeToggle } from "@/components/ModeToggle";
import { CategoryList } from "@/components/CategoryList";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "./components/ui/confirm-dialog";
import { Button } from "./components/ui/button";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("Personal");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal states
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [taskData, categoryData] = await Promise.all([
        taskApi.getTasks(),
        categoryApi.getCategories(),
      ]);
      setTasks(taskData);
      setCategories(categoryData);
      
      // Default to first category on load
      if (categoryData.length > 0) {
        setActiveCategory(categoryData[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed activeCategory dependency to prevent loop

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectCategory = (name: string) => {
    setActiveCategory(name);
  };

  // Calculate progress for each category
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach(cat => {
      const catTasks = tasks.filter(t => t.category === cat.name);
      if (catTasks.length === 0) {
        map[cat.name] = 0;
      } else {
        const completed = catTasks.filter(t => t.completed).length;
        map[cat.name] = (completed / catTasks.length) * 100;
      }
    });
    return map;
  }, [tasks, categories]);

  const addTask = async (title: string, category: string) => {
    setIsSubmitting(true);
    try {
      const newTask = await taskApi.createTask(title, category);
      setTasks((prev) => [newTask, ...prev]);
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const updatedTask = await taskApi.updateTask(id, { completed });
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      const newCat = await categoryApi.createCategory(name);
      setCategories(prev => [...prev, newCat]);
      setActiveCategory(name);
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryApi.deleteCategory(categoryToDelete);
      const freshCategories = await categoryApi.getCategories();
      setCategories(freshCategories);
      setTasks(prev => prev.filter(t => t.category !== categoryToDelete));
      if (activeCategory === categoryToDelete) {
        setActiveCategory(freshCategories[0]?.name || "Personal");
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setCategoryToDelete(null);
    }
  };

  const activeCategoryTasks = useMemo(() => 
    tasks.filter(t => t.category === activeCategory),
    [tasks, activeCategory]
  );

  const completedCount = activeCategoryTasks.filter((t) => t.completed).length;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="todo-theme">
      <div className="relative min-h-screen bg-background selection:bg-primary/20 transition-colors duration-700">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
        </div>

        {/* Mobile Sidebar (Drawer) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r p-8 lg:hidden flex flex-col gap-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <ListTodo className="h-5 w-5" />
                    </div>
                    <span className="font-bold">Lists</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <CategoryList
                  categories={categories}
                  activeCategory={activeCategory}
                  progressMap={progressMap}
                  onSelect={handleSelectCategory}
                  onAdd={handleAddCategory}
                  onDelete={(name) => setCategoryToDelete(name)}
                  onCloseMobile={() => setIsSidebarOpen(false)}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            {/* Desktop Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block space-y-12"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
                  <ListTodo className="h-5 w-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight">TodoApp</h1>
              </div>

              <CategoryList
                categories={categories}
                activeCategory={activeCategory}
                progressMap={progressMap}
                onSelect={handleSelectCategory}
                onAdd={handleAddCategory}
                onDelete={(name) => setCategoryToDelete(name)}
              />
            </motion.aside>

            {/* Main Content */}
            <motion.main
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-12 w-12 rounded-2xl bg-card border"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                      <span>Lists</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-foreground/60">{activeCategory}</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter line-clamp-1">{activeCategory}</h2>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border shadow-sm shrink-0">
                  <ModeToggle />
                </div>
              </header>

              <Stats completed={completedCount} total={activeCategoryTasks.length} />

              <Card className="border-none bg-card/50 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] ring-1 ring-white/5 overflow-hidden">
                <CardContent className="p-8 md:p-10 space-y-10">
                  <TodoForm onAdd={addTask} isLoading={isSubmitting} activeCategory={activeCategory} />

                  <div className="min-h-[400px] space-y-4">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing data...</p>
                      </div>
                    ) : activeCategoryTasks.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-32 text-center text-muted-foreground opacity-30">
                         <LayoutIcon className="h-12 w-12 mb-4" />
                         <p className="text-sm font-bold uppercase tracking-widest leading-relaxed">
                           No tasks found in {activeCategory}.
                         </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <AnimatePresence mode="popLayout" initial={false}>
                          {activeCategoryTasks.map((task) => (
                            <TodoItem
                              key={task.id}
                              task={task}
                              onToggle={toggleTask}
                              onDelete={deleteTask}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.main>
          </div>
        </div>
      </div>

      {/* Category Deletion Confirmation */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category?"
        description={`This will permanently delete the "${categoryToDelete}" list and all its tasks. This action cannot be undone.`}
      />
    </ThemeProvider>
  );
}

export default App;

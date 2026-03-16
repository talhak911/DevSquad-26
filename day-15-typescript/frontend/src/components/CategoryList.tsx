import { useState, useMemo } from "react";
import { Plus, X, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category } from "@/lib/api";
import { cn } from "@/lib/utils";

interface CategoryListProps {
  categories: Category[];
  activeCategory: string;
  progressMap: Record<string, number>;
  onSelect: (name: string) => void;
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
  onCloseMobile?: () => void;
}

const SUGGESTIONS = ["Work", "Health", "Shopping", "Finance", "Ideas", "Travel"];

// Premium color palette for category progress
const CATEGORY_COLORS: Record<string, string> = {
  Personal: "bg-blue-500",
  Work: "bg-purple-500",
  Shopping: "bg-pink-500",
  Health: "bg-emerald-500",
  Finance: "bg-amber-500",
  Ideas: "bg-indigo-500",
  Travel: "bg-cyan-500",
  default: "bg-primary",
};

const getCategoryColor = (name: string) => CATEGORY_COLORS[name] || CATEGORY_COLORS.default;

export function CategoryList({
  categories,
  activeCategory,
  progressMap,
  onSelect,
  onAdd,
  onDelete,
  onCloseMobile,
}: CategoryListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const availableSuggestions = useMemo(() => {
    const existingNames = new Set(categories.map(c => c.name.toLowerCase()));
    return SUGGESTIONS.filter(s => !existingNames.has(s.toLowerCase()));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
      setIsAdding(false);
    }
  };

  const handleSelect = (name: string) => {
    onSelect(name);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">My Lists</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsAdding(!isAdding)}
          className="h-7 w-7 rounded-lg hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
        >
          <Plus className={cn("h-3.5 w-3.5 transition-transform duration-300", isAdding && "rotate-45")} />
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="px-2 overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-3 pb-4">
              <div className="flex gap-2">
                <Input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="List name..."
                  className="h-10 rounded-xl border-2 bg-background/50 text-xs font-bold uppercase tracking-wider focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <Button type="submit" size="sm" className="rounded-xl px-4 shadow-lg shadow-primary/20">
                  Add
                </Button>
              </div>

              {availableSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {availableSuggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setNewName(suggestion)}
                        className="px-2 py-1 rounded-md bg-muted/30 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col gap-1.5 p-1">
        <AnimatePresence mode="popLayout">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            const progress = progressMap[cat.name] || 0;
            const colorClass = getCategoryColor(cat.name);

            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group relative"
              >
                {/* Fixed Border Container */}
                <div className={cn(
                  "relative w-full overflow-hidden rounded-2xl border transition-all duration-300",
                  isActive ? "border-primary/50 shadow-lg shadow-primary/5" : "border-transparent hover:border-muted-foreground/10"
                )}>
                  
                  {/* Progress Fill Layer */}
                  <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                    className={cn(
                      "absolute inset-y-0 left-0 opacity-[0.15] transition-colors duration-500",
                      colorClass
                    )}
                  />

                  {/* Active Indicator (Overlay) */}
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(cat.name)}
                    className={cn(
                      "relative w-full flex items-center justify-between px-4 py-4 text-[11px] font-black uppercase tracking-widest min-w-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/70 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 mr-2">
                      <Tag className={cn("h-3.5 w-3.5 shrink-0", isActive ? "opacity-100" : "opacity-30")} />
                      <div className="flex flex-col items-start gap-0.5 min-w-0">
                        <span className="truncate w-full text-left">{cat.name}</span>
                        <span className="text-[8px] font-bold opacity-40 shrink-0">{Math.round(progress)}% done</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(cat.name);
                        }}
                        className={cn(
                          "h-7 w-7 rounded-lg transition-all active:scale-90",
                          isActive 
                            ? "hover:bg-primary/10 text-primary/50 hover:text-primary" 
                            : "opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                        )}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

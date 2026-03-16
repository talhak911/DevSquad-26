import { useState } from "react";
import { Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { Task } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "./ui/confirm-dialog";

interface TodoItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "group relative flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
          task.completed && "bg-muted/30 border-primary/5 shadow-inner"
        )}
      >
        <div className="flex flex-1 items-center gap-4">
          <Checkbox
            id={`task-${task.id}`}
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
            className="h-6 w-6 rounded-lg border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />

          <div className="flex flex-col gap-1 overflow-hidden">
            <span
              className={cn(
                "text-base font-semibold transition-all duration-500",
                task.completed && "text-muted-foreground line-through decoration-primary/50"
              )}
            >
              {task.title}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
              <Calendar className="h-3 w-3" />
              {new Date(task.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsConfirmOpen(true)}
          className="h-10 w-10 rounded-xl text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive active:scale-95"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </motion.div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => onDelete(task.id)}
        title="Delete Task"
        description="Are you sure? This will remove the task permanently."
      />
    </>
  );
}

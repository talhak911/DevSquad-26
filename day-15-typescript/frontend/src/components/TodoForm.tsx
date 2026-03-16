import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { createTaskSchema, type CreateTaskInput } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoFormProps {
  onAdd: (title: string, category: string) => void;
  isLoading: boolean;
  activeCategory: string;
}

export function TodoForm({ onAdd, isLoading, activeCategory }: TodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    mode: "onChange",
    defaultValues: {
      category: activeCategory,
    },
  });

  const onSubmit = (data: CreateTaskInput) => {
    onAdd(data.title, activeCategory);
    reset({ title: "", category: activeCategory });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-2">
      <div className="group relative flex gap-2">
        <div className="relative flex-1">
          <Input
            {...register("title")}
            placeholder={`Add to ${activeCategory}...`}
            disabled={isLoading}
            className="h-14 rounded-2xl border-2 bg-background/50 pl-12 pr-4 transition-all duration-300 focus-visible:ring-primary/20 focus-visible:border-primary group-hover:border-primary/50 text-base font-medium"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
            <Plus className="h-5 w-5" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="h-14 px-8 rounded-2xl bg-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 active:scale-95 disabled:grayscale"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Add Task</span>
              <Sparkles className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      {errors.title && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold text-destructive pl-4"
        >
          {errors.title.message}
        </motion.p>
      )}
    </form>
  );
}

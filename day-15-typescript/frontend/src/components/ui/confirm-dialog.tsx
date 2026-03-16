import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2, X } from "lucide-react";
import { Button } from "./button";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/60 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-card p-8 shadow-3xl ring-1 ring-primary/10"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-inner">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3">
                <Button
                  variant="destructive"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="h-12 rounded-xl font-bold shadow-lg shadow-destructive/20 active:scale-95 transition-all"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Confirm Deletion
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="h-12 rounded-xl font-bold border-2 active:scale-95 transition-all hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

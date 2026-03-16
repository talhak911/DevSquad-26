import { CheckCircle2, CircleDashed, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface StatsProps {
  completed: number;
  total: number;
}

export function Stats({ completed, total }: StatsProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-background to-background shadow-xl ring-1 ring-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-primary uppercase tracking-wider">Completion</p>
              <Award className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">{percentage}%</span>
                <span className="text-xs text-muted-foreground font-medium">of goals achieved</span>
              </div>
              <Progress value={percentage} className="h-3 bg-primary/5" />
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <CheckCircle2 size={100} strokeWidth={1} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg transition-all hover:bg-card/60 hover:shadow-primary/5">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="mb-2 h-6 w-6 text-green-500" />
            <div className="text-2xl font-bold">{completed}</div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Done</p>
          </CardContent>
        </Card>
        <Card className="border-none bg-card/40 backdrop-blur-md shadow-lg transition-all hover:bg-card/60 hover:shadow-primary/5">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <CircleDashed className="mb-2 h-6 w-6 text-orange-500 animate-[spin_3s_linear_infinite]" />
            <div className="text-2xl font-bold">{total - completed}</div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Pending</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

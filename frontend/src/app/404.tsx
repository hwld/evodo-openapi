import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import { defaultTaskSearchParams } from "@/routes";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center relative">
      <div className="flex flex-col items-center gap-5">
        <motion.div
          className="fixed -top-[400px] -right-[400px] opacity-20 -z-10"
          transition={{ duration: 3, repeat: Infinity }}
        >
          <AppLogo size={1000} />
        </motion.div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-foreground text-2xl font-bold">404 Not found</p>
          <p className="text-muted-foreground">ページが存在しません</p>
        </div>
        <Button asChild>
          <Link search={defaultTaskSearchParams} to="/tasks">
            ホームへ戻る
          </Link>
        </Button>
      </div>
    </div>
  );
};

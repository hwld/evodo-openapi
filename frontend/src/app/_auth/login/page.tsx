import { AppLogo } from "@/components/ui/app-logo";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/ui/google-icon";
import { LOGIN_URL } from "@/lib/login-url";
import { motion } from "framer-motion";

export const LoginPage: React.FC = () => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <AppLogo size={150} />
          </motion.div>
          <p className="text-lg text-muted-foreground">Evodo OpenAPI</p>
        </div>
        <Button className="gap-2" asChild>
          <a href={LOGIN_URL}>
            <GoogleIcon />
            Googleでログイン
          </a>
        </Button>
      </div>
    </div>
  );
};

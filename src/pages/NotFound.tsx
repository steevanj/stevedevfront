import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="mb-4 text-5xl font-heading font-bold text-destructive">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">
          Oops! The page <span className="font-mono">{location.pathname}</span> doesn’t exist.
        </p>
        <Link
          to="/"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

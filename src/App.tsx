// src/App.tsx
import "./index.css";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ensureIconStyles = () => {
  if (typeof document === "undefined") return;
  if (!document.getElementById("fa-cdn-stylesheet")) {
    const fa = document.createElement("link");
    fa.id = "fa-cdn-stylesheet";
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    fa.crossOrigin = "anonymous";
    fa.referrerPolicy = "no-referrer";
    document.head.appendChild(fa);
  }
  if (!document.getElementById("devicon-cdn-stylesheet")) {
    const dev = document.createElement("link");
    dev.id = "devicon-cdn-stylesheet";
    dev.rel = "stylesheet";
    dev.href = "https://cdn.jsdelivr.net/gh/devicons/devicon@master/devicon.min.css";
    dev.crossOrigin = "anonymous";
    dev.referrerPolicy = "no-referrer";
    document.head.appendChild(dev);
  }
};

const App = () => {
  useEffect(() => {
    ensureIconStyles();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

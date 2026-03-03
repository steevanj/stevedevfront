import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import apiClient from "@/api/apiClient"; // axios instance

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      // Real API call
      await apiClient.post("/api/profiles/contactmessages/", {
        ...form,
        is_resolved: false, // optional field
      });

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact message:", error);
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Get in Touch
        </h1>
        <p className="mb-12 text-muted-foreground">
          Have a question or want to work together? Drop me a message.
        </p>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-5">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-5 md:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
            <Input
              placeholder="What's this about?"
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
            />
            {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
            <Textarea
              placeholder="Your message..."
              rows={6}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" size="lg" disabled={loading} className="shadow-primary">
            {loading ? "Sending..." : (
              <>
                Send Message <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6 md:col-span-2"
        >
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <Mail className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground">steevan.dev@gmail.com</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <MessageSquare className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-heading text-sm font-semibold text-foreground">Response Time</h3>
            <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;

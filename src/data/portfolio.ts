export interface Profile {
  full_name: string;
  title: string;
  bio: string;
  about: string;
  experience_years: number;
  email: string;
  social_links: { platform: string; url: string; icon: string }[];
}

export interface Skill {
  name: string;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string;
  featured: boolean;
  status: "published" | "draft";
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  tags: string[];
  published_at: string;
  status: "published" | "draft";
  reading_time: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const profile: Profile = {
  full_name: "John Doe",
  title: "Backend Engineer",
  bio: "Passionate Django and DRF developer with 5+ years of experience building scalable web applications.",
  about: `I'm a backend engineer specializing in building robust, scalable server-side applications. With over 5 years of professional experience, I've worked across startups and enterprise environments, designing RESTful APIs, optimizing database performance, and architecting microservices.

My journey started with Python and Django, and I've since expanded into containerization with Docker, CI/CD pipelines, and cloud infrastructure. I'm passionate about clean code, test-driven development, and mentoring junior developers.

When I'm not coding, you'll find me writing technical blog posts, contributing to open-source projects, or exploring new technologies that push the boundaries of web development.`,
  experience_years: 5,
  email: "john@example.com",
  social_links: [
    { platform: "GitHub", url: "https://github.com", icon: "github" },
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
  ],
};

export const skills: Skill[] = [
  { name: "Django", category: "Framework" },
  { name: "Django REST Framework", category: "Framework" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Docker", category: "DevOps" },
  { name: "REST APIs", category: "Architecture" },
  { name: "Python", category: "Language" },
  { name: "Celery", category: "Task Queue" },
  { name: "Redis", category: "Cache" },
  { name: "Git", category: "Version Control" },
  { name: "Linux", category: "OS" },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce API",
    slug: "e-commerce-api",
    description: "A fully-featured RESTful API for e-commerce platforms built with Django REST Framework and PostgreSQL. Includes authentication, product management, cart system, order processing, and payment integration.",
    tech_stack: ["Django REST Framework", "PostgreSQL", "Stripe", "Docker", "Redis"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    status: "published",
  },
  {
    id: "2",
    title: "Task Manager App",
    slug: "task-manager-app",
    description: "A collaborative task management application with real-time updates, recurring tasks, and team workspace support. Features async task processing with Celery and Redis.",
    tech_stack: ["Django", "Celery", "Redis", "WebSockets", "PostgreSQL"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: false,
    status: "published",
  },
  {
    id: "3",
    title: "Portfolio Website",
    slug: "portfolio-website",
    description: "A dynamic portfolio website with admin panel for managing projects, blog posts, and contact messages. Built with Django templates and Bootstrap for a clean, professional look.",
    tech_stack: ["Django", "Bootstrap", "SQLite", "JavaScript"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: false,
    status: "published",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Django",
    slug: "getting-started-with-django",
    summary: "A comprehensive beginner's guide to building web applications with Django, covering project setup, models, views, and templates.",
    content: `Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. In this post, we'll walk through everything you need to know to get started.

## Why Django?

Django follows the "batteries included" philosophy. It comes with an ORM, authentication system, admin panel, and much more out of the box. This means you can focus on building your application instead of reinventing the wheel.

## Setting Up Your First Project

\`\`\`bash
pip install django
django-admin startproject myproject
cd myproject
python manage.py runserver
\`\`\`

## Understanding the MVC Pattern

Django uses the MVT (Model-View-Template) pattern, which is similar to MVC. Models define your data structure, views handle the business logic, and templates render the HTML.

## Key Takeaways

- Django's ORM makes database operations intuitive
- The admin panel saves hours of development time
- URL routing is clean and maintainable
- Security features are built-in by default`,
    tags: ["Django", "Python", "Web Development", "Tutorial"],
    published_at: "2025-12-15",
    status: "published",
    reading_time: 8,
  },
  {
    id: "2",
    title: "Building REST APIs with DRF",
    slug: "building-rest-apis-with-drf",
    summary: "Learn how to build production-ready REST APIs using Django REST Framework with serializers, viewsets, and authentication.",
    content: `Django REST Framework (DRF) is the go-to toolkit for building Web APIs in Django. Let's explore how to build a production-ready API.

## Serializers

Serializers allow complex data types like querysets and model instances to be converted to native Python datatypes that can then be rendered into JSON.

\`\`\`python
from rest_framework import serializers

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description']
\`\`\`

## ViewSets

ViewSets combine the logic for a set of related views into a single class, reducing boilerplate significantly.

## Authentication & Permissions

DRF provides flexible authentication including Token, JWT, and Session-based auth. Permissions can be set globally or per-view.

## Best Practices

- Use versioning for your API endpoints
- Implement proper pagination
- Write comprehensive tests
- Document your API with tools like drf-spectacular`,
    tags: ["DRF", "REST API", "Django", "Backend"],
    published_at: "2026-01-20",
    status: "published",
    reading_time: 12,
  },
  {
    id: "3",
    title: "Optimizing PostgreSQL Performance",
    slug: "optimizing-postgresql-performance",
    summary: "Practical tips and techniques for optimizing PostgreSQL database performance in Django applications.",
    content: `Database performance is critical for any application. Here are proven strategies for optimizing PostgreSQL in your Django projects.

## Indexing Strategy

The most impactful optimization is proper indexing. Analyze your query patterns and create indexes accordingly.

\`\`\`sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
\`\`\`

## Query Optimization in Django

Use \`select_related\` and \`prefetch_related\` to minimize database hits:

\`\`\`python
# Bad: N+1 queries
orders = Order.objects.all()
for order in orders:
    print(order.user.name)

# Good: Single query with JOIN
orders = Order.objects.select_related('user').all()
\`\`\`

## Connection Pooling

Use PgBouncer or Django's persistent connections to reduce connection overhead.

## Monitoring

Use tools like pg_stat_statements and Django Debug Toolbar to identify slow queries and optimize them.`,
    tags: ["PostgreSQL", "Performance", "Django", "Database"],
    published_at: "2026-02-10",
    status: "published",
    reading_time: 10,
  },
];

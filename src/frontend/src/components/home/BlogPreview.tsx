import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@tanstack/react-router';
import { blogPosts } from '../blog/blogPosts';
import { ArrowRight } from 'lucide-react';

export function BlogPreview() {
  const navigate = useNavigate();

  return (
    <section className="container py-16">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="mb-2 text-3xl font-bold">Latest from Our Blog</h2>
          <p className="text-muted-foreground">Learn tips and tricks for working with PDFs and images</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/blog' })}>
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {blogPosts.slice(0, 2).map((post) => (
          <Card key={post.slug} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">{post.title}</CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={post.route}>
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

import { Seo } from '@/components/seo/Seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { blogPosts } from '@/components/blog/blogPosts';
import { Calendar } from 'lucide-react';

export default function BlogIndexPage() {
  return (
    <>
      <Seo
        title="Blog - PDF & Image Tips"
        description="Learn tips and tricks for working with PDFs and images. Guides, tutorials, and best practices for document management."
      />
      <div className="container py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Tips, guides, and tutorials for working with PDFs and images
            </p>
          </div>

          <div className="space-y-6">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(post.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={post.route}>
                    <Button variant="outline">Read Article</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

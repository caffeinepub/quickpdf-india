import { Seo } from '@/components/seo/Seo';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  useScrollToTop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real application, this would send the form data to a backend
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <Seo
        title="Contact Us - The Bharat PDF"
        description="Get in touch with The Bharat PDF. We're here to help with any questions, feedback, or support requests about our free PDF and image tools."
      />

      <div className="container mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>

        <div className="mb-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#22c55e]" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email us directly at:</p>
              <a
                href="mailto:support@thebharatpdf.com"
                className="text-lg font-semibold text-[#22c55e] hover:underline"
              >
                support@thebharatpdf.com
              </a>
            </div>
          </div>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg border border-[#22c55e] bg-[#22c55e]/10 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-[#22c55e]" />
              <p className="font-medium text-[#22c55e]">
                Thank you for your message! We'll respond within 24 hours.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className={errors.message ? 'border-destructive' : ''}
              placeholder="Tell us how we can help you..."
              rows={6}
            />
            {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-[#22c55e] hover:bg-[#27ae60] sm:w-auto">
            Send Message
          </Button>
        </form>

        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="mb-3 text-lg font-semibold">Response Time</h2>
          <p className="text-sm text-muted-foreground">
            We typically respond to all inquiries within 24 hours during business days. For urgent technical issues, please include detailed information about the problem you're experiencing.
          </p>
        </div>
      </div>
    </>
  );
}

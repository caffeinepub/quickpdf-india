import { Seo } from '@/components/seo/Seo';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ResizeImageUnder50KbPage() {
  return (
    <>
      <Seo
        title="Resize Image Under 50KB"
        description="Step-by-step guide to resize and compress images to meet 50KB file size requirements for forms, applications, and websites."
      />
      <article className="container py-12">
        <div className="prose prose-lg mx-auto max-w-3xl dark:prose-invert">
          <h1>Resize Image Under 50KB</h1>

          <p className="lead">
            Many online forms, job applications, and government websites require images to be under
            50KB. Learn how to resize and compress your images to meet these requirements easily.
          </p>

          <h2>Why Do Websites Require Small Image Sizes?</h2>
          <p>
            File size limits exist for several reasons:
          </p>
          <ul>
            <li>Faster upload and processing times</li>
            <li>Reduced server storage costs</li>
            <li>Better performance on slow internet connections</li>
            <li>Standardization across applications</li>
          </ul>

          <h2>How to Resize Image Under 50KB</h2>
          <p>Follow these steps to compress your image to under 50KB:</p>
          <ol>
            <li>
              <strong>Upload your image:</strong> Visit our{' '}
              <Link to="/resize-image" className="text-[#2ecc71]">
                Resize Image tool
              </Link>{' '}
              and select your photo
            </li>
            <li>
              <strong>Choose "Target Size":</strong> Select the target size option
            </li>
            <li>
              <strong>Enter 50KB:</strong> Type "50" in the target size field
            </li>
            <li>
              <strong>Process & Download:</strong> Click process and download your optimized image
            </li>
          </ol>

          <div className="not-prose my-8 rounded-lg border border-[#2ecc71] bg-[#2ecc71]/5 p-6">
            <h3 className="mb-4 text-xl font-semibold">Need to resize your image now?</h3>
            <Link to="/resize-image">
              <Button className="bg-[#2ecc71] hover:bg-[#27ae60]">
                Resize Image <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <h2>Common Use Cases for 50KB Images</h2>
          <ul>
            <li>
              <strong>Job Applications:</strong> Many job portals require profile photos under 50KB
            </li>
            <li>
              <strong>Government Forms:</strong> Passport, visa, and ID applications often have strict
              size limits
            </li>
            <li>
              <strong>Exam Applications:</strong> Entrance exams and competitive tests
            </li>
            <li>
              <strong>Social Media:</strong> Some platforms have upload size restrictions
            </li>
          </ul>

          <h2>Tips for Best Results</h2>
          <ul>
            <li>
              <strong>Start with good quality:</strong> Use a clear, well-lit photo
            </li>
            <li>
              <strong>Crop unnecessary areas:</strong> Remove extra background before resizing
            </li>
            <li>
              <strong>Use JPG format:</strong> JPG compresses better than PNG for photos
            </li>
            <li>
              <strong>Check requirements:</strong> Some forms specify exact dimensions (e.g., 200x200
              pixels)
            </li>
          </ul>

          <h2>Alternative Resize Options</h2>
          <p>Our tool also supports:</p>
          <ul>
            <li>
              <strong>Resize by pixels:</strong> Set exact width and height dimensions
            </li>
            <li>
              <strong>Resize by percentage:</strong> Scale your image by a percentage (e.g., 50%)
            </li>
            <li>
              <strong>Maintain aspect ratio:</strong> Keep your image proportions intact
            </li>
          </ul>

          <h2>Related Tools</h2>
          <p>You might also find these tools useful:</p>
          <ul>
            <li>
              <Link to="/image-to-pdf" className="text-[#2ecc71]">
                Convert Image to PDF
              </Link>{' '}
              for document submissions
            </li>
            <li>
              <Link to="/compress-pdf" className="text-[#2ecc71]">
                Compress PDF
              </Link>{' '}
              if you need to reduce PDF size
            </li>
          </ul>

          <div className="not-prose mt-12 rounded-lg bg-muted p-6">
            <p className="text-sm text-muted-foreground">
              <strong>Privacy Note:</strong> Your images are processed in your browser and
              automatically deleted. We never store or share your files.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}

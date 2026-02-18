import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function HomeFaq() {
  const faqs = [
    {
      question: 'Is QuickPDF India really free?',
      answer:
        'Yes! All our tools are 100% free to use. There are no hidden charges, subscriptions, or premium features.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No account needed! You can use all our tools without signing up or logging in. Just upload your files and start processing.',
    },
    {
      question: 'Are my files secure?',
      answer:
        'Absolutely. Your files are processed securely and automatically deleted after processing. We never store or share your files.',
    },
    {
      question: 'What file size limits do you have?',
      answer:
        'Most tools support files up to 50MB. For larger files, you may need to compress them first or split them into smaller parts.',
    },
    {
      question: 'Can I use these tools on mobile?',
      answer:
        'Yes! Our website is fully responsive and works great on mobile devices, tablets, and desktops.',
    },
  ];

  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

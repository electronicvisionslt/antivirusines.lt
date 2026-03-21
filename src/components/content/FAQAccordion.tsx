import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQAccordionProps {
  items: { q: string; a: string }[];
  title?: string;
}

const FAQAccordion = ({ items, title = 'Dažnai užduodami klausimai' }: FAQAccordionProps) => (
  <section className="my-10" itemScope itemType="https://schema.org/FAQPage">
    <h2 className="font-heading text-xl font-bold text-foreground mb-4">{title}</h2>
    <Accordion type="single" collapsible className="space-y-1.5">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-lg px-4 bg-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
          <AccordionTrigger className="text-left text-sm font-medium py-3.5 hover:no-underline hover:text-primary transition-colors duration-200">
            <span itemProp="name">{item.q}</span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-3.5 leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
            <span itemProp="text">{item.a}</span>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FAQAccordion;

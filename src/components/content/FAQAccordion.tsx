import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQAccordionProps {
  items: { q: string; a: string }[];
  title?: string;
}

const FAQAccordion = ({ items, title = 'Dažnai užduodami klausimai' }: FAQAccordionProps) => (
  <section className="my-10" itemScope itemType="https://schema.org/FAQPage">
    <h2 className="font-heading text-2xl font-bold text-foreground mb-5">{title}</h2>
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border border-border/60 rounded-xl px-5 bg-card glow-border" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
          <AccordionTrigger className="text-left text-sm font-medium py-4 hover:no-underline hover:text-primary transition-colors duration-200">
            <span itemProp="name">{item.q}</span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
            <span itemProp="text">{item.a}</span>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FAQAccordion;
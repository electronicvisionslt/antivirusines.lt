import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQAccordionProps {
  items: { q: string; a: string }[];
  title?: string;
}

const FAQAccordion = ({ items, title = 'Dažnai užduodami klausimai' }: FAQAccordionProps) => (
  <section className="my-10" itemScope itemType="https://schema.org/FAQPage">
    <h2 className="text-2xl font-bold text-foreground mb-5">{title}</h2>
    <Accordion type="single" collapsible className="space-y-2">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4 bg-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
          <AccordionTrigger className="text-left text-sm font-medium py-4 hover:no-underline">
            <span itemProp="name">{item.q}</span>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
            <span itemProp="text">{item.a}</span>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);

export default FAQAccordion;

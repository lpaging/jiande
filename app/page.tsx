import { Author } from "@/components/sections/Author";
import { Entrance } from "@/components/sections/Entrance";
import { Entry } from "@/components/sections/Entry";
import { Form } from "@/components/sections/Form";
import { Light } from "@/components/sections/Light";
import { Variation } from "@/components/sections/Variation";
import { siteData } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-canvas text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[32rem] h-[52rem] bg-[radial-gradient(circle_at_center,rgba(233,231,227,0.72),transparent_65%)]" />
      <Entrance hero={siteData.hero} />
      <Form section={siteData.form} />
      <Light section={siteData.light} />
      <Variation section={siteData.variation} />
      <Author section={siteData.author} />
      <Entry section={siteData.entry} />
    </main>
  );
}

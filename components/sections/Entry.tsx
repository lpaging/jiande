import { Reveal } from "@/components/Reveal";

type EntryProps = {
  section: {
    label: string;
    hint: string;
  };
};

export function Entry({ section }: EntryProps) {
  return (
    <section className="pb-24 pt-4 md:pb-28">
      <div className="page-shell">
        <Reveal className="border-t border-line pt-10">
          <a
            href="#"
            className="group inline-flex items-center gap-4 font-serifDisplay text-[2rem] leading-none tracking-[0.02em] text-ink md:text-[2.6rem]"
          >
            <span>{section.label}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
          </a>
          <p className="mt-4 max-w-[24rem] text-sm leading-7 text-subtle">{section.hint}</p>
        </Reveal>
      </div>
    </section>
  );
}

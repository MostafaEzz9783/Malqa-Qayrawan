import { memo } from "react";
import { motion } from "framer-motion";
import { Handshake, LineChart, ShieldCheck, Wrench } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

const CARD_ICONS = [LineChart, Wrench, ShieldCheck, Handshake];

// The closing page of the presentation - deliberately not interactive. No
// buttons/links/forms here by design: this is the board-level financial
// proposal itself, not a marketing page asking for a click.
function ExecutiveClosing({ t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <GlassCard glow tilt={false} className="p-8 sm:p-12">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <img src="/logo.png" alt={t.nav.brandAlt} className="h-12 mx-auto mb-6 object-contain" />
          <h2
            className="font-black tracking-tight mb-5"
            style={{ color: "#F5F3EF", fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
          >
            {t.closing.headline}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: "#9C99AE" }}>
            {t.closing.paragraph1}
          </p>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#9C99AE" }}>
            {t.closing.paragraph2}
            <br />
            <span className="font-semibold" style={{ color: "#E0A876" }}>
              {t.closing.paragraph3}
            </span>
          </p>
        </div>

        <p
          className="text-center text-[11px] font-bold uppercase tracking-[0.2em] mb-5"
          style={{ color: "#BF7C4A" }}
        >
          {t.closing.cardsTitle}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {t.closing.cards.map((card, index) => {
            const Icon = CARD_ICONS[index];
            return (
              <GlassCard key={card.title} tilt={false} className="p-5">
                <div
                  className="inline-flex items-center justify-center rounded-2xl mb-3"
                  style={{ width: 36, height: 36, backgroundColor: "rgba(191,124,74,0.14)", color: "#E0A876" }}
                >
                  <Icon size={17} />
                </div>
                <h3 className="text-sm font-black mb-1.5" style={{ color: "#F5F3EF" }}>
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#9C99AE" }}>
                  {card.description}
                </p>
              </GlassCard>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
          <p className="text-sm sm:text-base font-semibold leading-relaxed mb-3" style={{ color: "#F5F3EF" }}>
            &ldquo;{t.closing.closingStatement}&rdquo;
          </p>
          <p className="text-xs" style={{ color: "#6f6c82" }}>
            {t.closing.attribution}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default memo(ExecutiveClosing);

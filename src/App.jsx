import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Dashboard from "@/pages/Dashboard";
import SplashScreen from "@/components/SplashScreen";
import { translations } from "@/i18n/translations";

const LANGUAGE_STORAGE_KEY = "mathwaa_malqa_qayrawan_language";
const LEGACY_LANGUAGE_STORAGE_KEY = "arqa_language";

function App() {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY) || "ar",
  );
  const [isReady, setIsReady] = useState(false);
  const t = useMemo(() => translations[language], [language]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "ar" ? "en" : "ar"));
  };

  // Fires once per page load (this effect only ever runs on mount) - the
  // splash never re-triggers from language toggles or any other state change.
  const handleSplashDone = useCallback(() => setIsReady(true), []);

  return (
    <>
      <AnimatePresence>
        {!isReady && (
          <SplashScreen key="splash" text={t.splash.loadingText} brandAlt={t.nav.brandAlt} onDone={handleSplashDone} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
        transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Dashboard language={language} t={t} onToggleLanguage={toggleLanguage} />
      </motion.div>
    </>
  );
}

export default App;

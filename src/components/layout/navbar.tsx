import { Link } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  // true => eng
  // false => عربي
  const [lang, setLang] = useState("en");
  function handleClick() {
    if (lang === "en") {
      setLang("ar");
      i18n.changeLanguage("ar");
    } else {
      setLang("en");
      i18n.changeLanguage("en");
    }
  }

  return (
    <nav className="w-full shadow-md bg-slate/100/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 py-4.5 h-20">
      <div className="flex items-center justify-around">
        {/* left */}
        <div className="flex items-center space-x-4 ">
          <div className="flex-shrink-0 text-slate-600 dark:text-slate-200 text-2xl font-bold">
            <Link to="/">{t("appName")}</Link>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* center */}
        <div className="hidden sm:flex space-x-6">
          <Link to="/">
            <p className="text-slate-600 dark:text-slate-200 hover:underline hover:decoration-indigo-600 hover:decoration-2 font-medium">
              {t("nav.home")}
            </p>{" "}
          </Link>
          <Link to="/">
            <p className="text-slate-600 dark:text-slate-200 hover:underline hover:decoration-indigo-600 hover:decoration-2 font-medium">
              {t("nav.about")}
            </p>{" "}
          </Link>
          <Link to="/">
            <p className="text-slate-600 dark:text-slate-200 hover:underline hover:decoration-indigo-600 hover:decoration-2 font-medium">
              {t("nav.contact")}
            </p>{" "}
          </Link>
        </div>

        <div className="w-px h-6 bg-gray-300 hidden md:flex"></div>

        {/* right */}
        <div className="flex items-center space-x-3">
          <Button>{t("auth.login")}</Button>
          <div className="text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/80">
            <ModeToggle />
          </div>
          <div className="text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/80">
            <Button variant="outline" size="icon" onClick={handleClick}>
              {lang === "en" ? "عربي" : "eng"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

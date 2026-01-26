import { useState } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

export default function LangToggle() {
  const { i18n } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  function handleClick() {
    if (lang === "en") {
      setLang("ar");
      i18n.changeLanguage("ar");
      localStorage.setItem("lang", "ar");
    } else {
      setLang("en");
      i18n.changeLanguage("en");
      localStorage.setItem("lang", "en");
    }
  }

  return (
    <div>
      <Button variant="outline" size="icon" onClick={handleClick}>
        {lang === "en" ? "عربي" : "eng"}
      </Button>
    </div>
  );
}

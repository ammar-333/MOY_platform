import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function DirectionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return <>{children}</>;
}

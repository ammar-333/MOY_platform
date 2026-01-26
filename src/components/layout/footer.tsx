import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="h-full bg-slate-100 dark:bg-slate-800 py-6">
      {t("footer.name")}
    </div>
  );
}

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="h-20 bg-slate-200 dark:bg-slate-800 py-6 flex-1">
      <div className="flex flex-col md:flex-row text-muted-foreground gap-1 px-9">
        <p>{t("footer.rights")}</p>
        <span className="flex gap-1">
          <span className="text-xs text-muted-foreground relative">©</span>
          {new Date().getFullYear()}
          <p>{t("appName")}</p>
        </span>
      </div>
    </div>
  );
}

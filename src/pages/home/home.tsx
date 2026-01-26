import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return <div className="h-90">{t("nav.home")}</div>;
}

import { Link, useNavigate } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";
import { Button } from "../ui/button";
import LangToggle from "../common/lang-toggle";
import { useTranslation } from "react-i18next";
import { Hotel } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleLoginBtn() {
    navigate("/login");
  }

  return (
    <nav className="w-full min-h-fit shadow-md bg-slate/100/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 py-3 h-20">
      <div className="flex items-center justify-between flex-wrap content-between gap-y-5">
        {/* left */}
        <div className="flex items-center space-x-3">
          <Hotel className="size-10 text-primary relative top-1" />
          <div className="flex shrink-0 text-2xl font-bold">
            <div>
              <Link to="/">{t("appName")}</Link>
              <p className="relative top-1 text-[13px] text-slate-700 dark:text-slate-300 opacity-90">
                {t("form.reservation")}
              </p>
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 hidden md:flex"></div>

        {/* center */}
        <div className="flex space-x-6 ">
          <Link to="/">
            <p className="hover:underline hover:decoration-primary hover:decoration-2 font-medium">
              {t("nav.home")}
            </p>{" "}
          </Link>
          <Link to="/user/Service-Requests">
            <p className="hover:underline hover:decoration-primary hover:decoration-2 font-medium">
              {t("nav.Requests")}
            </p>{" "}
          </Link>
          <Link to="/">
            <p className="hover:underline hover:decoration-primary hover:decoration-2 font-medium">
              {t("nav.about")}
            </p>{" "}
          </Link>
          <Link to="/">
            <p className="hover:underline hover:decoration-primary hover:decoration-2 font-medium">
              {t("nav.contact")}
            </p>{" "}
          </Link>
        </div>

        <div className="w-px h-6 bg-gray-300 hidden md:flex"></div>

        {/* right */}
        <div className="flex items-center space-x-3">
          <Button onClick={handleLoginBtn}>{t("auth.login")}</Button>
          <div className="text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/80">
            <ModeToggle />
          </div>
          <div className="text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-900/80">
            <LangToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

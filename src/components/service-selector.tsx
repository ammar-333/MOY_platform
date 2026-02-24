import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

type servicesType = {
  title: string;
  desc: string;
  action: () => void;
};

export default function ServiceSelector({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isRtl = i18n.language?.toLowerCase().startsWith("ar");
  const Arrow = isRtl ? ChevronLeft : ChevronRight;

  const services: servicesType[] = [
    {
      title: t("services.cards.youthHouse.title"),
      desc: t("services.cards.youthHouse.desc"),
      action: () => navigate("/user/youthHouse"),
    },
    {
      title: t("services.cards.sportsComplex.title"),
      desc: t("services.cards.sportsComplex.desc"),
      action: () => navigate("/user/sportComplex"),
    },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  function clearQuery() {
    setSearchParams({}, { replace: true });
  }
  useEffect(() => {
    if (token) {
      // Store the token in localStorage or a cookie
      localStorage.setItem("authToken", token);

      // Clear the query parameters from the URL
      clearQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-center justify-center p-4 md:p-8",
        className,
      )}
      {...props}
    >
      <Card className="w-full max-w-5xl rounded-2xl shadow-lg overflow-hidden p-0">
        <div className="bg-primary text-white text-center px-6 md:px-10 py-10 md:py-12 rounded-t-2xl">
          <h1 className="text-2xl md:text-3xl font-bold">
            {t("services.pageTitle")}
          </h1>
          <p className="mt-3 text-sm md:text-base opacity-90">
            {t("services.pageSubtitle")}
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 md:px-10 py-6 md:py-8 space-y-6 dark:bg-slate-900">
          {/* ABOUT */}
          <div>
            <h2 className="text-sm md:text-base font-semibold text-foreground">
              {t("services.aboutTitle")}
            </h2>
            <p className="mt-2 text-xs md:text-sm text-muted-foreground leading-relaxed">
              {t("services.aboutDesc")}
            </p>
          </div>

          <hr className="border-border" />

          {/* AVAILABLE SERVICES */}
          <div className="space-y-3">
            <h3 className="text-sm md:text-base font-semibold text-foreground">
              {t("services.availableTitle")}
            </h3>

            {/* MAIN SERVICE */}
            {services.map((service, index) => (
              <button
                key={index}
                type="button"
                onClick={service.action}
                className={cn(
                  "w-full rounded-xl border border-border",
                  "bg-primary/10 hover:bg-primary/15 transition-colors",
                  "px-4 md:px-6 py-4 md:py-5",
                  "flex items-center justify-between gap-4",
                )}
              >
                <div
                  className={cn(
                    "flex-1 min-w-0",
                    isRtl ? "text-right" : "text-left",
                  )}
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <div className="text-sm md:text-base font-semibold text-foreground">
                    {service.title}
                  </div>
                  <div className="mt-1 text-xs md:text-sm text-primary/90">
                    {service.desc}
                  </div>
                </div>

                <span className="shrink-0 inline-flex size-10 items-center justify-center rounded-full bg-white shadow-sm border">
                  <Arrow className="h-5 w-5 text-primary" />
                </span>
              </button>
            ))}

            {/* OTHER SERVICES */}
            <div className="w-full rounded-xl border border-border bg-muted px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 opacity-70">
              <div className="min-w-0">
                <div className="text-sm md:text-base font-semibold text-foreground">
                  {t("services.cards.other.title")}
                </div>
                <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                  {t("services.cards.other.desc")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

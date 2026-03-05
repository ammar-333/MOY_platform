import React from "react";
import sanad from "@/assets/sanad.png";
import sanadLogo from "@/assets/sanad-logo.png";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";
import { Field, FieldDescription } from "@/components/ui/field";
import { Link } from "react-router-dom";

export default function SandSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();

  function handleSanad(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.location.assign(
      "http://10.0.82.105:1125/api/SanadSignleSignon/Auth?returnUrl=/auth/signup",
    );
  }
  return (
    <div
      className={cn("mx-auto w-full max-w-xl px-4 md:px-0", className)}
      {...props}
    >
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        {/* HEADER */}
        <div className="bg-primary text-white text-center px-6 pt-4 pb-4">
          <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-white/20">
            <LogIn className="h-6 w-6" />
          </div>

          <h1 className="text-lg font-bold">{t("form.gate")}</h1>
          <p className="mt-1 text-sm opacity-90">{t("form.reservation")}</p>
        </div>

        {/* FORM */}
        <Card className="rounded-none shadow-none dark:bg-slate-900">
          <CardContent className="px-6 py-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              {t("auth.OrgsignupSanad")}{" "}
              <span className="text-emerald-600">{t("auth.sanad")}</span>
            </h1>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {t("auth.orgSignupDesc")}{" "}
            </p>

            <hr className="border-muted" />

            <div className="mt-4">
              <div className="flex flex-col items-center justify-center rounded-2xl">
                <img
                  className="text-center w-4/5 dark:hidden"
                  src={sanad}
                  alt="sanad-logo"
                />
                <img
                  className="text-center w-4/5 hidden dark:block"
                  src={sanadLogo}
                  alt="sanad-logo"
                />
              </div>

              <Field className="md:col-span-2">
                <button
                  className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 dark:bg-primary dark:hover:bg-blue-800  text-white py-3 px-6 rounded-lg transition-colors w-full mt-4"
                  type="button"
                  onClick={handleSanad}
                >
                  <span className="w-14 h-6 rounded-full flex items-center justify-center text-white text-xs">
                    <img
                      className="text-center"
                      src={sanadLogo}
                      alt="sanad-logo"
                    />
                  </span>
                  <span>{t("auth.sanadSignOn")}</span>
                </button>
                <FieldDescription className="text-center">
                  {t("auth.account")}{" "}
                  <Link
                    to="/auth/login"
                    className="text-primary hover:underline"
                  >
                    {t("auth.login")}
                  </Link>
                </FieldDescription>
              </Field>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

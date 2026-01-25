import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        {/* HEADER */}
        <div className="bg-[#3B2AF6] text-white text-center p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
            <LogIn className="h-6 w-6" />
          </div>

          <h1 className="text-2xl font-bold">{t("form.gate")}</h1>
          <p className="mt-2 text-sm opacity-90">{t("form.reservation")}</p>
        </div>

        {/* form */}
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{t("auth.email")}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">
                    {t("auth.password")}
                  </FieldLabel>
                </div>
                <Input id="password" type="password" required />
                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {t("auth.forgotPassword")}
                </a>
              </Field>
              <Field>
                <Button type="submit">{t("auth.login")}</Button>
                <FieldDescription className="text-center">
                  {t("auth.noaccount")} <a href="#">{t("auth.signup")}</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

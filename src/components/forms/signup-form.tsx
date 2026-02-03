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
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

type companySectorType = "government" | "private";

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companySector, setCompanySector] =
    useState<companySectorType>("government");

  useEffect(() => {
    console.log(companySector);
  }, [companySector]);

  const handleSubmit = () => {
    navigate("/organization-profile");
  };

  return (
    <div
      className={cn("rounded-2xl shadow-lg overflow-hidden", className)}
      {...props}
    >
      {/* HEADER */}
      <div className="bg-primary text-white text-center px-6 pt-10 pb-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <LogIn className="h-6 w-6" />
        </div>

        <h1 className="text-xl font-bold">{t("form.gate")}</h1>
        <p className="mt-1 text-sm opacity-90">{t("form.reservation")}</p>
      </div>

      {/* FORM */}
      <Card className="rounded-none shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <form>
            <FieldGroup>
              {/*  ID */}
              <Field>
                <FieldLabel htmlFor="orgNationalId">
                  {t("auth.orgNationalId")}{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="orgNationalId"
                  placeholder={t("auth.orgNationalIdPlaceholder")}
                  required
                />
              </Field>

              {/*  name */}
              <Field>
                <FieldLabel htmlFor="orgNationalName">
                  {t("auth.organizationName")}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="orgNationalName"
                  placeholder={t("auth.organizationNamePlaceholder")}
                  required
                />
              </Field>

              {/* company sector */}
              <RadioGroup
                defaultValue="goverment"
                onValueChange={setCompanySector}
                dir={t("dir")}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="goverment" id="goverment" />
                  <Label htmlFor="goverment">{t("auth.government")}</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">{t("auth.private")}</Label>
                </div>
              </RadioGroup>

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PASSWORD */}
                <Field>
                  <FieldLabel htmlFor="password">
                    {t("auth.password")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    required
                  />
                </Field>

                {/* Confirm PASSWORD */}
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    {t("auth.confirmPassword")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    required
                  />
                </Field>
              </FieldGroup>

              {/* SUBMIT */}
              <Field>
                <Button className="w-full" onClick={handleSubmit}>
                  {t("auth.signup")}
                </Button>

                <FieldDescription className="text-center">
                  {t("auth.account")}{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    {t("auth.login")}
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

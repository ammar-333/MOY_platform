import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sanad from "@/assets/sanad.png";
import sanadLogo from "@/assets/sanad-logo.png";
import { z } from "zod";
import { login } from "@/api/api";
import toast from "react-hot-toast";

type UserType = "individual" | "organization" | "government";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formSchema = (t: any) =>
  z.object({
    ID: z
      .string()
      .length(9, t("errors.length", { len: 9 }))
      .regex(/^\d*$/, t("errors.digitsOnly")),

    password: z.string().min(6, t("errors.min", { len: 6 })),
  });

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>("individual");

  const schema = formSchema(t);
  type formType = z.infer<typeof schema>;
  type FormErrors = Partial<Record<keyof formType, string>>;

  const [form, setForm] = useState<formType>({
    ID: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  {
    /* Submit */
  }
  function validate(): boolean {
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof formType;
        fieldErrors[field] = issue.message;
      });

      setFormErrors(fieldErrors);
      return false;
    }

    setFormErrors({});
    return true;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("Institutions_NID", form.ID);
    formData.append("Password", form.password);
    try {
      const res = await login(formData);
      if (res?.token) localStorage.setItem("authToken", res.token);
      toast.success(t("auth.loginSuccess"));
      navigate("/user/business-profile");
    } catch (error) {
      toast.error(t("auth.loginFailed"));
      console.log(error);
    }
  }

  function handleSanad(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    window.location.assign(
      "http://10.0.82.105:1125/api/SanadSignleSignon/Auth?returnUrl=/user/individual-profile",
    );
  }

  return (
    <div
      className={cn("rounded-2xl shadow-lg overflow-hidden", className)}
      {...props}
    >
      {/* HEADER */}
      <div className="bg-primary text-white text-center px-6 pt-6 pb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
          <LogIn className="h-6 w-6" />
        </div>

        <h1 className="text-xl font-bold">{t("form.gate")}</h1>
        <p className="mt-1 text-sm opacity-90">{t("form.reservation")}</p>
      </div>

      {/* FORM */}
      <Card className="rounded-none shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <form onSubmit={handleLogin}>
            <FieldGroup>
              {/* USER TYPE TOGGLE */}
              <Field>
                <FieldLabel>{t("form.userType")}</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType("individual")}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition",
                      userType === "individual"
                        ? "bg-primary text-white"
                        : "bg-muted",
                    )}
                  >
                    {t("form.individual")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType("organization")}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition",
                      userType === "organization"
                        ? "bg-primary text-white"
                        : "bg-muted",
                    )}
                  >
                    {t("form.organization")}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType("government")}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm transition",
                      userType === "government"
                        ? "bg-primary text-white"
                        : "bg-muted",
                    )}
                  >
                    {t("form.government")}
                  </button>
                </div>
              </Field>

              {/* CONDITIONAL FIELDS */}
              {userType === "individual" && (
                <div>
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
                  <button
                    className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 dark:bg-primary dark:hover:bg-blue-800  text-white py-3 px-6 rounded-lg transition-colors w-full mt-6"
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
                </div>
              )}

              {userType === "organization" && (
                <>
                  {/* ID */}
                  <Field>
                    <FieldLabel htmlFor="ID">
                      {t("auth.orgNationalId")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="ID"
                      type="text"
                      value={form.ID}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          ID: e.target.value,
                        }))
                      }
                      maxLength={9}
                      placeholder={t("auth.orgNationalIdPlaceholder")}
                    />
                    <FieldError>{formErrors.ID}</FieldError>
                  </Field>

                  {/* PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="password">
                      {t("auth.password")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      type="password"
                      placeholder={t("auth.passwordPlaceholder")}
                    />
                    <FieldError>{formErrors.password}</FieldError>
                  </Field>

                  {/* SUBMIT */}
                  <Field>
                    <Button className="w-full" type="submit">
                      {t("auth.login")}
                    </Button>

                    <FieldDescription className="text-center">
                      {t("auth.noaccount")}{" "}
                      <Link
                        to="/sanad_signup"
                        className="text-primary hover:underline"
                      >
                        {t("auth.signup")}
                      </Link>
                    </FieldDescription>
                  </Field>
                </>
              )}

              {userType === "government" && (
                <>
                  {/* ID */}
                  <Field>
                    <FieldLabel htmlFor="ID">
                      {t("auth.govId")} <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="ID"
                      type="text"
                      value={form.ID}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          ID: e.target.value,
                        }))
                      }
                      maxLength={9}
                      placeholder={t("auth.orgNationalIdPlaceholder")}
                    />
                    <FieldError>{formErrors.ID}</FieldError>
                  </Field>

                  {/* PASSWORD */}
                  <Field>
                    <FieldLabel htmlFor="password">
                      {t("auth.password")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      type="password"
                      placeholder={t("auth.passwordPlaceholder")}
                    />
                    <FieldError>{formErrors.password}</FieldError>
                  </Field>

                  {/* SUBMIT */}
                  <Field>
                    <Button className="w-full" type="submit">
                      {t("auth.login")}
                    </Button>

                    <FieldDescription className="text-center">
                      {t("auth.noaccount")}{" "}
                      <Link
                        to="/gov_signup"
                        className="text-primary hover:underline"
                      >
                        {t("auth.signup")}
                      </Link>
                    </FieldDescription>
                  </Field>
                </>
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

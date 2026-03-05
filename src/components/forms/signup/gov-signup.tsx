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
import { CalendarIcon, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { z } from "zod";
import { register } from "@/api/authApi";
import { toast } from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formSchema = (t: any) =>
  z.object({
    delegateName: z.string().min(1, t("errors.required")),

    delegateNationalId: z
      .string()
      .length(10, t("errors.length", { len: 10 }))
      .regex(/^\d*$/, t("errors.digitsOnly")),

    RegistrationNumber: z
      .string()
      .length(6, t("errors.length", { len: 6 }))
      .regex(/^\d*$/, t("errors.digitsOnly")),

    IdentificationNumber: z
      .string()
      .length(10, t("errors.length", { len: 10 }))
      .regex(/^\d*$/, t("errors.digitsOnly")),

    delegateDateOfBirth: z.date().optional(),

    JobTitle: z.string().min(1, t("errors.required")),
    orgEmail: z.string().email(t("errors.invalidEmail")),
    orgPhone: z
      .string()
      .length(9, t("errors.length", { len: 9 }))
      .regex(/^\d*$/, t("errors.digitsOnly"))
      .regex(/^7/, t("errors.jordanNumber")),

    password: z
      .string()
      .min(6, t("errors.min", { len: 6 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
        t("errors.passwordStrength"),
      ),
  });
export default function GovSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = formSchema(t);
  type formType = z.infer<typeof schema>;
  type FormErrors = Partial<Record<keyof formType, string>>;

  const [open, setOpen] = useState(false);

  // Form state
  const [form, setForm] = useState<formType>({
    delegateName: "",
    delegateNationalId: "",
    RegistrationNumber: "",
    IdentificationNumber: "",
    delegateDateOfBirth: undefined,

    JobTitle: "",
    orgEmail: "",
    orgPhone: "",

    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhone = (num: string | undefined) => `+962${num}`;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("commissioner_NID", form.delegateNationalId);

      formData.append("institutions_PhonNum", formatPhone(form.orgPhone));
      formData.append("institutions_Email", form.orgEmail);
      formData.append("password", form.password);

      console.log(form);
      await register(formData);

      toast.success(t("auth.registerSuccess"));
      navigate("/auth/login");
    } catch (error) {
      toast.error(t("auth.registerFailed"));
      console.log("error" + error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 md:px-0", className)}
      {...props}
    >
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        {/* HEADER */}
        <div className="bg-primary text-white px-6 md:px-8 py-7">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <LogIn className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {t("form.gate")}
              </h1>
              <p className="mt-1 text-sm opacity-90">{t("form.reservation")}</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <Card className="rounded-none shadow-none dark:bg-slate-900">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                {/* Name */}
                <Field>
                  <FieldLabel htmlFor="delegateName">
                    {t("auth.delegateName")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="delegateName"
                    type="text"
                    value={form.delegateName}
                    readOnly
                    className="bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                  />
                  <FieldError>{formErrors.delegateName}</FieldError>
                </Field>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Delegate National ID */}
                  <Field>
                    <FieldLabel htmlFor="delegateNationalId">
                      {t("auth.delegateNationalId")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="delegateNationalId"
                      type="text"
                      value={form.delegateNationalId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          delegateNationalId: e.target.value,
                        }))
                      }
                      maxLength={10}
                    />

                    <FieldError>{formErrors.delegateNationalId}</FieldError>
                  </Field>

                  {/* Delegate Registration number */}
                  <Field>
                    <FieldLabel htmlFor="RegistrationNumber">
                      {t("auth.RegistrationNumber")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="RegistrationNumber"
                      type="text"
                      value={form.RegistrationNumber}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          RegistrationNumber: e.target.value,
                        }))
                      }
                      maxLength={6}
                    />

                    <FieldError>{formErrors.RegistrationNumber}</FieldError>
                  </Field>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Delegate Identification number */}
                  <Field>
                    <FieldLabel htmlFor="IdentificationNumber">
                      {t("auth.IdentificationNumber")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="IdentificationNumber"
                      type="text"
                      value={form.IdentificationNumber}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          IdentificationNumber: e.target.value,
                        }))
                      }
                      maxLength={10}
                    />

                    <FieldError>{formErrors.IdentificationNumber}</FieldError>
                  </Field>

                  {/* Organization date */}
                  <Field className="mx-auto">
                    <FieldLabel htmlFor="date">
                      {t("auth.dateofEstablishment")}
                    </FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="justify-start font-normal bg-white"
                        >
                          <CalendarIcon />
                          {form.delegateDateOfBirth
                            ? form.delegateDateOfBirth.toLocaleDateString()
                            : t("reservation.fields.PickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={form.delegateDateOfBirth}
                          defaultMonth={form.delegateDateOfBirth}
                          captionLayout="dropdown"
                          onSelect={(value) => {
                            setForm((prev) => ({
                              ...prev,
                              delegateDateOfBirth:
                                value as formType["delegateDateOfBirth"],
                            }));
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </FieldGroup>

                {/* Divider */}
                <hr className="border-primary" />

                <Field>
                  <FieldLabel htmlFor="JobTitle">
                    {t("auth.JobTitle")}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="JobTitle"
                    type="text"
                    value={form.JobTitle}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        JobTitle: e.target.value,
                      }))
                    }
                  />
                  <FieldError>{formErrors.JobTitle}</FieldError>
                </Field>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="orgEmail">
                      {t("auth.orgEmail")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="orgEmail"
                      type="email"
                      value={form.orgEmail}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          orgEmail: e.target.value,
                        }))
                      }
                    />
                    <FieldError>{formErrors.orgEmail}</FieldError>
                  </Field>

                  {/* Phone */}
                  <Field>
                    <FieldLabel htmlFor="orgPhone">
                      {t("auth.orgPhone")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <div dir="ltr" className="flex items-center">
                      <span className="px-3 py-1 border border-r-0 rounded-l-md">
                        +962
                      </span>
                      <Input
                        id="orgPhone"
                        type="tel"
                        value={form.orgPhone}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            orgPhone: e.target.value,
                          }))
                        }
                        maxLength={9}
                        placeholder="7XXXXXXXX"
                      />
                    </div>
                    <FieldError>{formErrors.orgPhone}</FieldError>
                  </Field>
                </FieldGroup>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">
                    {t("auth.password")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  <FieldError>{formErrors.password}</FieldError>
                </Field>

                {/* Submit */}
                <Field className="md:col-span-2">
                  <Button
                    type="submit"
                    className="w-full py-6 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("auth.signingup") : t("auth.signup")}
                  </Button>

                  <FieldDescription className="text-center mt-3">
                    {t("auth.account")}{" "}
                    <Link
                      to="/auth/login"
                      className="text-primary hover:underline"
                    >
                      {t("auth.login")}
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
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
import { Checkbox } from "@/components/ui/checkbox";

const formatRegistration = (value: string) => {
  const numbers = value.replace(/\D/g, "").slice(0, 6);

  if (numbers.length <= 3) return numbers;
  return numbers.slice(0, 3) + "/" + numbers.slice(3);
};

// Schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formSchema = (t: any) =>
  z
    .object({
      delegateName: z.string().min(1, t("errors.required")),

      delegateNationalId: z
        .string()
        .length(10, t("errors.length", { len: 10 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),

      RegistrationNumber: z
        .string()
        .length(6, t("errors.length", { len: 6 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      delegateDateOfBirth: z.date().optional(),
      JobTitle: z.string().min(1, t("errors.required")),

      IdentificationNumber: z
        .string()
        .length(10, t("errors.length", { len: 10 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      orgEmail: z.string().email(t("errors.invalidEmail")),
      orgPhone: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly"))
        .regex(/^7/, t("errors.jordanNumber")),
    })
    .superRefine((data, ctx) => {
      if (!data.delegateDateOfBirth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["delegateDateOfBirth"],
          message: t("errors.date"),
        });
      }
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
    JobTitle: "",
    delegateDateOfBirth: undefined,

    IdentificationNumber: "",
    orgEmail: "",
    orgPhone: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

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
    if (!isChecked) {
      setShowError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("delegateName", form.delegateName);
      formData.append("commissioner_NID", form.delegateNationalId);
      formData.append("RegistrationNumber", form.RegistrationNumber);
      formData.append("JobTitle", form.JobTitle);
      formData.append(
        "delegateDateOfBirth",
        form.delegateDateOfBirth?.toString() ?? "",
      );

      formData.append(
        "IdentificationNumber",
        formatPhone(form.IdentificationNumber),
      );
      formData.append("institutions_PhonNum", formatPhone(form.orgPhone));
      formData.append("institutions_Email", form.orgEmail);

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
        <div className="bg-primary text-white text-center px-6 pt-4 pb-4">
          <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-white/20">
            <LogIn className="h-6 w-6" />
          </div>

          <h1 className="text-lg font-bold">{t("form.gate")}</h1>
          <p className="mt-1 text-sm opacity-90">{t("form.reservation")}</p>
        </div>

        {/* FORM */}
        <Card className="rounded-none shadow-none dark:bg-slate-900">
          <CardContent className="px-6 py-2 md:px-8 md:py-4">
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
                    className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
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
                      dir="ltr"
                      type="text"
                      value={form.RegistrationNumber}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          RegistrationNumber: formatRegistration(
                            e.target.value,
                          ),
                        }))
                      }
                      placeholder="123/456"
                      maxLength={7}
                      className="text-center tracking-[0.5em]"
                    />
                    <FieldError>{formErrors.RegistrationNumber}</FieldError>
                  </Field>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                  {/* birth date */}
                  <Field className="mx-auto">
                    <FieldLabel htmlFor="date">
                      {t("auth.dateofBirth")}
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
                    <FieldError>{formErrors.delegateDateOfBirth}</FieldError>
                  </Field>
                </FieldGroup>

                {/* Divider */}
                <hr className="border-primary" />

                {/*  Identification number */}
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

                {/* terms checkBox */}
                <FieldGroup className="mx-auto" dir={t("dir")}>
                  <Field
                    orientation="horizontal"
                    data-invalid={!isChecked && showError}
                  >
                    <Checkbox
                      id="terms-checkbox-desc"
                      name="terms-checkbox-desc"
                      checked={isChecked}
                      onCheckedChange={(value) => {
                        const checked = value === true;
                        setIsChecked(checked);

                        if (checked) {
                          setShowError(false); // remove red when user fixes it
                        }
                      }}
                      aria-invalid={!isChecked && showError}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor="terms-checkbox-desc">
                        {t("auth.terms")}
                      </FieldLabel>
                      <FieldDescription>{t("auth.termsDesc")}</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>

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

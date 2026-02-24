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
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { register } from "@/api/api";
import type { registerData } from "../../Types/signup_types";

type companySectorType =
  | "charity"
  | "cooperative"
  | "sole_establishment"
  | "company";
type delegateRoleType = "owner" | "authorizedOnRegistry" | "written";
type delegateNationalityType = "jordanian" | "nonJordanian";
type Option<T extends string> = { value: T; label: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formSchema = (t: any) =>
  z
    .object({
      delegateName: z.string().min(1, t("errors.required")),
      delegatePhone: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      delegateEmail: z.string().email(t("errors.invalidEmail")),
      delegateNationality: z.enum(["jordanian", "nonJordanian"]),
      delegateRole: z
        .enum(["owner", "authorizedOnRegistry", "written"])
        .optional(),
      delegateNationalId: z
        .string()
        .length(10, t("errors.length", { len: 10 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      companySector: z
        .enum(["charity", "cooperative", "sole_establishment", "company"])
        .optional(),
      orgNationalName: z.string().min(1, t("errors.required")),
      orgNationalId: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      orgEmail: z.string().email(t("errors.invalidEmail")),
      orgPhone: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      orgAddress: z.string().min(1, t("errors.required")),
      password: z.string().min(6, t("errors.min", { len: 6 })),
      file: z
        .instanceof(File)
        .refine(
          (file) => file.size <= 5_000_000,
          t("errors.maxFileSize", { size: 5 }),
        )
        .refine(
          (file) =>
            ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
          t("errors.invalidFileType", { types: "PNG, JPG, JPEG, PDF" }),
        )
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (!data.companySector) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companySector"],
          message: t("errors.required"),
        });
      }

      if (data.delegateRole === "written" && !data.file) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["file"],
          message: t("errors.required"),
        });
      }
    });

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = formSchema(t);
  type formType = z.infer<typeof schema>;
  type FormErrors = Partial<Record<keyof formType, string>>;

  const [form, setForm] = useState<formType>({
    delegateName: "",
    delegatePhone: "",
    delegateEmail: "",
    delegateNationality: "jordanian",
    delegateRole: "written",
    delegateNationalId: "",

    companySector: undefined,
    orgNationalName: "",
    orgNationalId: "",
    orgEmail: "",
    orgPhone: "",
    orgAddress: "",

    password: "",

    file: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const showWrittenAttachment = form.delegateRole === "written";
  const showCharityRole =
    form.companySector === "charity" || form.companySector === "cooperative";

  const sectorOptions: Option<companySectorType>[] = useMemo(
    () => [
      { value: "company", label: t("auth.company") },
      { value: "sole_establishment", label: t("auth.sole_establishment") },
      { value: "cooperative", label: t("auth.cooperative") },
      { value: "charity", label: t("auth.charity") },
    ],
    [t],
  );

  const roleOptions: Option<delegateRoleType>[] = useMemo(
    () => [
      { value: "owner", label: t("auth.owner") },
      { value: "authorizedOnRegistry", label: t("auth.authorizedOnRegistry") },
      { value: "written", label: t("auth.writtenDelegate") },
    ],
    [t],
  );

  const charityRoleOptions: Option<delegateRoleType>[] = useMemo(
    () => [{ value: "written", label: t("auth.writtenDelegate") }],
    [t],
  );

  const nationalityOptions: Option<delegateNationalityType>[] = useMemo(
    () => [
      { value: "jordanian", label: t("auth.jordanian") },
      { value: "nonJordanian", label: t("auth.nonJordanian") },
    ],
    [t],
  );

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
    const formData = new FormData();
    formData.append("commissioner_Name", form.delegateName);
    formData.append("commissioner_NID", form.delegateNationalId);
    formData.append("commissioner_PhonNum", formatPhone(form.delegatePhone));
    formData.append("commissioner_Mail", form.delegateEmail);
    formData.append("commissioner_nationality", form.delegateNationality);
    formData.append("institutions_Name", form.orgNationalName);
    formData.append("institutions_Type", form.companySector ?? "");
    formData.append("institutions_NID", form.orgNationalId);
    formData.append("institutions_Address", form.orgAddress);
    formData.append("institutions_PhonNum", formatPhone(form.orgPhone));
    formData.append("institutions_Email", form.orgEmail);
    formData.append("applicant", form.delegateRole ?? "written");
    formData.append("delegation", form.delegateRole ?? "written");
    formData.append("password", form.password);
    if (form.file) {
      formData.append("file", form.file);
    }

    try {
      await register(formData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-3xl px-4 md:px-0", className)}
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
                {/* Company Sector */}
                <Field>
                  <FieldLabel>
                    {t("auth.companySector")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.companySector}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        companySector: value as companySectorType,
                        delegateRole: "written",
                      }))
                    }
                    dir={t("dir")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("reservation.placeholders.select")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {sectorOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError>{formErrors.companySector}</FieldError>
                </Field>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Organization Name */}
                  <Field>
                    <FieldLabel htmlFor="orgNationalName">
                      {t("auth.organizationName")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="orgNationalName"
                      type="string"
                      value={form.orgNationalName}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          orgNationalName: e.target.value,
                        }))
                      }
                    />
                    <FieldError>{formErrors.orgNationalName}</FieldError>
                  </Field>

                  {/* Organization National ID */}
                  <Field>
                    <FieldLabel htmlFor="orgNationalId">
                      {t("auth.orgNationalId")}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="orgNationalId"
                      type="text"
                      value={form.orgNationalId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          orgNationalId: e.target.value,
                        }))
                      }
                      maxLength={10}
                    />
                    <FieldError>{formErrors.orgNationalId}</FieldError>
                  </Field>
                </FieldGroup>

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

                {/* address */}
                <Field>
                  <FieldLabel htmlFor="orgAddress">
                    {t("auth.orgAddress")}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="orgAddress"
                    type="string"
                    value={form.orgAddress}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        orgAddress: e.target.value,
                      }))
                    }
                  />
                  <FieldError>{formErrors.orgAddress}</FieldError>
                </Field>

                {/* Divider */}
                <hr className="border-primary" />

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
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        delegateName: e.target.value,
                      }))
                    }
                  />
                  <FieldError>{formErrors.delegateName}</FieldError>
                </Field>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Delegate Role */}
                  <Field>
                    <FieldLabel>
                      {t("auth.delegateRole")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.delegateRole}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          delegateRole: value as formType["delegateRole"],
                        }))
                      }
                      dir={t("dir")}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {showCharityRole
                            ? charityRoleOptions.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))
                            : roleOptions.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* Nationality */}
                  <Field>
                    <FieldLabel>
                      {t("auth.delegateNationality")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.delegateNationality}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          delegateNationality:
                            value as formType["delegateNationality"],
                        }))
                      }
                      dir={t("dir")}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {nationalityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>

                {/* Delegate National ID */}
                <Field>
                  <FieldLabel htmlFor="delegateNationalId">
                    {form.delegateNationality === "nonJordanian"
                      ? t("auth.delegatePersonalId")
                      : t("auth.delegateNationalId")}
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

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="delegateEmail">
                        {t("auth.delegateEmail")}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id="delegateEmail"
                        type="email"
                        value={form.delegateEmail}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            delegateEmail: e.target.value,
                          }))
                        }
                      />
                      <FieldError>{formErrors.delegateEmail}</FieldError>
                    </Field>
                  </FieldGroup>

                  {/* Phone */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="delegatePhone">
                        {t("auth.delegatePhone")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <div dir="ltr" className="flex items-center">
                        <span className="px-3 py-1 border border-r-0 rounded-l-md">
                          +962
                        </span>
                        <Input
                          id="delegatePhone"
                          type="tel"
                          value={form.delegatePhone}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              delegatePhone: e.target.value,
                            }))
                          }
                          maxLength={9}
                          placeholder="7XXXXXXXX"
                        />
                      </div>
                      <FieldError>{formErrors.delegatePhone}</FieldError>
                    </Field>
                  </FieldGroup>
                </FieldGroup>

                {/* Attachment */}
                {showWrittenAttachment && (
                  <Field>
                    <FieldLabel htmlFor="writtenAuthorizationFile">
                      {t("auth.powerOfAttorney")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>

                    <label
                      htmlFor="writtenAuthorizationFile"
                      className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-primary rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition"
                    >
                      <div className="flex flex-col items-center gap-2 text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-8m0 0l-3 3m3-3l3 3m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1"
                          />
                        </svg>

                        <span className="text-sm font-medium">
                          {t("auth.chooseFile")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PDF, JPG, PNG
                        </span>
                        {form.file && (
                          <p className="mt-2 text-sm text-gray-700">
                            Selected file: <strong>{form.file.name}</strong>
                          </p>
                        )}
                      </div>
                    </label>

                    <Input
                      id="writtenAuthorizationFile"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setForm((prev) => ({
                          ...prev,
                          file,
                        }));
                      }}
                      className="hidden"
                    />
                    <FieldError>{formErrors.file}</FieldError>
                  </Field>
                )}

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
                  <Button type="submit" className="w-full py-6 text-base">
                    {t("auth.signup")}
                  </Button>

                  <FieldDescription className="text-center mt-3">
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
    </div>
  );
}

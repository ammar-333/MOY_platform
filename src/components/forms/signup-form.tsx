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

type companySectorType = "government" | "private";
type delegateRoleType = "owner" | "authorizedOnRegistry" | "written";
type delegateNationalityType = "jordanian" | "nonJordanian";
type Option<T extends string> = { value: T; label: string };

const formSchema = z.object({
  delegatePhone: z.string().optional(),
  delegateEmail: z.string().email().optional(),
  delegateNationality: z.enum(["jordanian", "nonJordanian"]).optional(),
  delegateRole: z.enum(["owner", "authorizedOnRegistry", "written"]).optional(),
  delegateNationalId: z.string().optional(),

  companySector: z.enum(["government", "private"]).optional(),
  orgNationalName: z.string().optional(),
  orgNationalId: z.string().optional(),
  orgEmail: z.string().email().optional(),
  orgPhone: z.string().optional(),
  orgAddress: z.string().optional(),

  password: z.string().min(6).optional(),

  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5_000_000, "Max size is 5MB")
    .refine(
      (file) =>
        ["image/png", "image/jpeg", "application/pdf"].includes(file.type),
      "Only PNG, JPG, JPEG, or PDF files are allowed",
    )
    .optional(),
});
type formType = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof formType, string>>;

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<formType>({
    delegatePhone: undefined,
    delegateEmail: undefined,
    delegateNationality: undefined,
    delegateRole: undefined,
    delegateNationalId: undefined,

    companySector: "government",
    orgNationalName: undefined,
    orgNationalId: undefined,
    orgEmail: undefined,
    orgPhone: undefined,
    orgAddress: undefined,

    password: undefined,

    file: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const showDelegateNationalId = form.delegateNationality === "jordanian";
  const showWrittenAttachment = form.delegateRole === "written";

  // Dynamic labels based on sector
  const orgIdLabel =
    form.companySector === "government"
      ? t("auth.govOrgNationalId")
      : t("auth.orgNationalId");

  const orgNameLabel =
    form.companySector === "government"
      ? t("auth.govOrganizationName")
      : t("auth.organizationName");

  const orgEmailLabel =
    form.companySector === "government"
      ? t("auth.govOrgEmail")
      : t("auth.orgEmail");

  const orgPhoneLabel =
    form.companySector === "government"
      ? t("auth.govOrgPhone")
      : t("auth.orgPhone");

  const orgAddressLabel =
    form.companySector === "government"
      ? t("auth.govOrgAddress")
      : t("auth.orgAddress");

  const sectorOptions: Option<companySectorType>[] = useMemo(
    () => [
      { value: "government", label: t("auth.government") },
      { value: "private", label: t("auth.private") },
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

  const nationalityOptions: Option<delegateNationalityType>[] = useMemo(
    () => [
      { value: "jordanian", label: t("auth.jordanian") },
      { value: "nonJordanian", label: t("auth.nonJordanian") },
    ],
    [t],
  );

  {
    /* Submit */
  }
  function validate(): boolean {
    const result = formSchema.safeParse(form);

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

    if (!validate()) {
      console.log(formErrors);
      return;
    }
    try {
      // API call
      console.log(form);
      navigate("/services");
    } catch (error) {
      console.error(error);
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
          <div className="flex items-center gap-4">
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
                        {sectorOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Organization Name */}
                  <Field>
                    <FieldLabel htmlFor="orgNationalName">
                      {orgNameLabel}
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
                      required
                    />
                  </Field>

                  {/* Organization National ID */}
                  <Field>
                    <FieldLabel htmlFor="orgNationalId">
                      {orgIdLabel}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="orgNationalId"
                      type="number"
                      value={form.orgNationalId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          orgNationalId: e.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="orgEmail">
                      {orgEmailLabel}
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
                      required
                    />
                    {formErrors.orgEmail && (
                      <p className="text-red-500">{formErrors.orgEmail}</p>
                    )}
                  </Field>

                  {/* Phone */}
                  <Field>
                    <FieldLabel htmlFor="orgPhone">
                      {orgPhoneLabel}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
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
                      required
                    />
                  </Field>
                </FieldGroup>

                {/* address */}
                <Field>
                  <FieldLabel htmlFor="orgAddress">
                    {orgAddressLabel}
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
                    required
                  />
                </Field>

                {/* Divider */}
                <hr className="border-primary" />

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
                          {roleOptions.map((o) => (
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
                {showDelegateNationalId && (
                  <Field>
                    <FieldLabel htmlFor="delegateNationalId">
                      {t("auth.delegateNationalId")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="delegateNationalId"
                      type="number"
                      value={form.delegateNationalId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          delegateNationalId: e.target.value,
                        }))
                      }
                      required
                    />
                  </Field>
                )}

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
                        required
                      />
                      {formErrors.delegateEmail && (
                        <p className="text-red-500">
                          {formErrors.delegateEmail}
                        </p>
                      )}
                    </Field>
                  </FieldGroup>

                  {/* Phone */}
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="delegatePhone">
                        {t("auth.delegatePhone")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
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
                        required
                      />
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
                      required
                    />
                    {formErrors.file && (
                      <p className="text-red-500">{formErrors.file}</p>
                    )}
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
                    required
                  />
                  {formErrors.password && (
                    <p className="text-red-500">{formErrors.password}</p>
                  )}
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

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
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Types
type companySectorType =
  | "association"
  | "cooperative"
  | "sole_establishment"
  | "company"
  | "free_zone";
type delegateRoleType = "owner" | "authorizedOnRegistry" | "written";
// type delegateNationalityType = "jordanian" | "nonJordanian";
type Option<T extends string> = { value: T; label: string };

// Schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formSchema = (t: any) =>
  z
    .object({
      delegateRole: z.enum(["owner", "authorizedOnRegistry", "written"]),

      // delegateName: z.string().min(1, t("errors.required")),
      // delegatePhone: z
      //   .string()
      //   .length(9, t("errors.length", { len: 9 }))
      //   .regex(/^\d*$/, t("errors.digitsOnly"))
      //   .regex(/^7/, t("errors.jordanNumber")),
      // delegateEmail: z.string().email(t("errors.invalidEmail")),
      // delegateNationality: z.enum(["jordanian", "nonJordanian"]),

      // delegateNationalId: z
      //   .string()
      //   .length(10, t("errors.length", { len: 10 }))
      //   .regex(/^\d*$/, t("errors.digitsOnly")),
      // delegateDateOfBirth: z.string().optional(),

      delegateName: z.string().optional(),
      delegatePhone: z.string().optional(),
      delegateEmail: z.string().optional(),
      delegateNationality: z.string().optional(),
      delegateNationalId: z.string().optional(),
      delegateDateOfBirth: z.string().optional(),

      companySector: z
        .enum([
          "association",
          "cooperative",
          "sole_establishment",
          "company",
          "free_zone",
        ])
        .optional(),
      orgNationalName: z.string().optional(),
      orgNationalId: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly")),
      orgEmail: z.string().email(t("errors.invalidEmail")),
      orgDate: z.date().optional(),
      orgPhone: z
        .string()
        .length(9, t("errors.length", { len: 9 }))
        .regex(/^\d*$/, t("errors.digitsOnly"))
        .regex(/^7/, t("errors.jordanNumber")),

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

      if (!data.orgDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["orgDate"],
          message: t("errors.date"),
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

  const [open, setOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryToken = searchParams.get("token");

  // Local state to keep token even after clearing query params
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);

  function clearQuery() {
    setSearchParams({}, { replace: true });
  }

  useEffect(() => {
    if (queryToken) {
      setLocalToken(queryToken);
      localStorage.setItem("signUpToken", queryToken);
      clearQuery();
    }
    setTokenReady(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryToken]);

  // Form state
  const [form, setForm] = useState<formType>({
    delegateName: "",
    delegatePhone: "",
    delegateEmail: "",
    delegateNationality: "",
    delegateRole: "owner",
    delegateNationalId: "",
    delegateDateOfBirth: undefined,

    companySector: undefined,
    orgNationalName: "",
    orgNationalId: "",
    orgDate: undefined,
    orgEmail: "",
    orgPhone: "",
    file: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile fetched from API
  interface Profile {
    data: {
      dateOfBirth: string;
      mail: string;
      mobile: string;
      nationalId: string;
    };
    userType: string;
  }
  const [profile, setProfile] = useState<Profile | null>(null);

  // Redirect if token ready but missing
  useEffect(() => {
    if (tokenReady && !localToken) {
      navigate("/auth/sanad_signup", { replace: true });
    }
  }, [tokenReady, localToken, navigate]);

  // Fetch profile if token exists
  useEffect(() => {
    if (!localToken) return;

    fetch("http://10.0.82.105:1125/api/Login/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((json) => {
        setProfile(json);
        console.log(json);
      })
      .catch(() => navigate("/auth/sanad_signup", { replace: true }));
  }, [localToken, navigate]);

  // Populate form from profile
  useEffect(() => {
    if (!profile?.data) return;

    const { mail, mobile, nationalId } = profile.data;
    const phoneWithoutCode = mobile?.startsWith("+962")
      ? mobile.replace("+962", "")
      : mobile;

    setForm((prev) => ({
      ...prev,
      delegateEmail: mail || "",
      delegateNationalId: nationalId || "",
      delegatePhone: phoneWithoutCode || "",
    }));
  }, [profile]);

  // Options
  const sectorOptions: Option<companySectorType>[] = useMemo(
    () => [
      { value: "company", label: t("auth.company") },
      { value: "association", label: t("auth.association") },
      { value: "sole_establishment", label: t("auth.sole_establishment") },
      { value: "cooperative", label: t("auth.cooperative") },
      { value: "free_zone", label: t("auth.free_zones_establishments") },
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
  const associationRoleOptions: Option<delegateRoleType>[] = useMemo(
    () => [{ value: "written", label: t("auth.writtenDelegate") }],
    [t],
  );
  // const nationalityOptions: Option<delegateNationalityType>[] = useMemo(
  //   () => [
  //     { value: "jordanian", label: t("auth.jordanian") },
  //     { value: "nonJordanian", label: t("auth.nonJordanian") },
  //   ],
  //   [t],
  // );

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

      formData.append("commissioner_Name", form.delegateName ?? "");
      formData.append("commissioner_NID", form.delegateNationalId ?? "");
      formData.append("commissioner_PhonNum", formatPhone(form.delegatePhone));
      formData.append("commissioner_Mail", form.delegateEmail ?? "");
      formData.append(
        "commissioner_nationality",
        form.delegateNationality ?? "jordanian",
      );
      formData.append("institutions_Name", form.orgNationalName ?? "");
      formData.append("applicant", form.delegateRole);

      formData.append("institutions_Type", form.companySector ?? "company");
      formData.append("institutions_NID", form.orgNationalId);
      formData.append("institutions_PhonNum", formatPhone(form.orgPhone));
      formData.append("institutions_Email", form.orgEmail);
      if (form.file) {
        formData.append("delegation", form.file);
      }

      console.log(form);
      await register(formData);

      toast.success(t("auth.orgSuccessDelay"), {
        duration: 20000, // 20 second
      });
      navigate("/auth/login");
    } catch (error) {
      toast.error(t("auth.registerFailed"));
      console.log("error" + error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const showWrittenAttachment = form.delegateRole === "written";
  const showAssociationRole =
    form.companySector === "association" ||
    form.companySector === "cooperative";

  useEffect(() => {
    console.log(form.orgDate);
  }, [form.orgDate]);

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
          <CardContent className="px-6 py-2 md:p-8 md:py-4">
            <form onSubmit={handleSubmit}>
              <FieldGroup>
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
                        {showAssociationRole
                          ? associationRoleOptions.map((o) => (
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

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      readOnly
                      maxLength={10}
                      className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                    />
                    <FieldError>{formErrors.delegateNationalId}</FieldError>
                  </Field>
                </FieldGroup>

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
                        readOnly
                        className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
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
                          readOnly
                          maxLength={9}
                          className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                        />
                      </div>
                      <FieldError>{formErrors.delegatePhone}</FieldError>
                    </Field>
                  </FieldGroup>
                </FieldGroup>

                <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nationality */}
                  {/* <Field>
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
                  </Field> */}

                  <Field>
                    <FieldLabel>
                      {t("auth.delegateNationality")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="delegateEmail"
                      // value={form.delegateNationality}
                      readOnly
                      className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                    />
                    <FieldError>{formErrors.delegateEmail}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>
                      {t("auth.dateofBirth")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="dateofBirth"
                      value={form.delegateDateOfBirth}
                      readOnly
                      className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                    />
                    <FieldError>{formErrors.delegateEmail}</FieldError>
                  </Field>
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

                {/* Divider */}
                <hr className="border-primary" />

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

                        delegateRole:
                          value === "cooperative" || value === "association"
                            ? "written"
                            : prev.delegateRole,
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
                      maxLength={9}
                    />
                    <FieldError>{formErrors.orgNationalId}</FieldError>
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
                          {form.orgDate
                            ? form.orgDate.toLocaleDateString()
                            : t("reservation.fields.PickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={form.orgDate}
                          defaultMonth={form.orgDate}
                          captionLayout="dropdown"
                          onSelect={(value) => {
                            setForm((prev) => ({
                              ...prev,
                              orgDate: value as formType["orgDate"],
                            }));
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldError>{formErrors.orgDate}</FieldError>
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

                <Field>
                  <FieldLabel htmlFor="orgNationalName">
                    {t("auth.organizationName")}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="orgNationalName"
                    type="string"
                    value={form.orgNationalName}
                    readOnly
                    className="bg-muted dark:bg-muted border-dashed text-muted-foreground cursor-default focus-visible:ring-0"
                  />
                </Field>

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

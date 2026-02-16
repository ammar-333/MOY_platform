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
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type companySectorType = "government" | "private";
type delegateRoleType = "owner" | "authorizedOnRegistry" | "written";
type delegateNationalityType = "jordanian" | "nonJordanian";
type Option<T extends string> = { value: T; label: string };

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const [companySector, setCompanySector] =
    useState<companySectorType>("government");
  const [delegateRole, setDelegateRole] = useState<delegateRoleType>("owner");
  const [delegateNationality, setDelegateNationality] =
    useState<delegateNationalityType>("jordanian");

  useEffect(() => {
    console.log({ companySector, delegateRole, delegateNationality });
  }, [companySector, delegateRole, delegateNationality]);

  const showDelegateNationalId = delegateNationality === "jordanian";
  const showWrittenAttachment = delegateRole === "written";

  // Dynamic labels based on sector
  const orgIdLabel =
    companySector === "government"
      ? t("auth.govOrgNationalId")
      : t("auth.orgNationalId");

  const orgNameLabel =
    companySector === "government"
      ? t("auth.govOrganizationName")
      : t("auth.organizationName");

  const handleSubmit = () => {
    navigate("/organization-profile");
  };

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
              <div className="mb-6">
                <h2 className="text-lg font-semibold">{t("auth.signup")}</h2>
              </div>

              {/* Company Sector */}
              <Field>
                <FieldLabel>
                  {t("auth.companySector")}{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={companySector}
                  onValueChange={(v) =>
                    setCompanySector(v as companySectorType)
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
              </Field>
              <br></br>

              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Organization National ID */}
                <Field>
                  <FieldLabel htmlFor="orgNationalId">
                    {orgIdLabel} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input id="orgNationalId" required />
                </Field>

                {/* Organization Name */}
                <Field>
                  <FieldLabel htmlFor="orgNationalName">
                    {orgNameLabel} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input id="orgNationalName" required />
                </Field>

                {/* Divider */}
                <div className="md:col-span-2">
                  <div className="my-2 h-px w-full bg-border" />
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    {t("auth.delegateRole")}
                  </h3>
                </div>

                {/* Delegate Role */}
                <Field>
                  <FieldLabel>
                    {t("auth.delegateRole")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={delegateRole}
                    onValueChange={(v) =>
                      setDelegateRole(v as delegateRoleType)
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
                    value={delegateNationality}
                    onValueChange={(v) =>
                      setDelegateNationality(v as delegateNationalityType)
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
                        {nationalityOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Delegate National ID */}
                {showDelegateNationalId && (
                  <Field>
                    <FieldLabel htmlFor="delegateNationalId">
                      {t("auth.delegateNationalId")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="delegateNationalId"
                      required
                      inputMode="numeric"
                    />
                  </Field>
                )}

                {/* Phone */}
                <Field
                  className={
                    delegateNationality === "nonJordanian"
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <FieldLabel htmlFor="delegatePhone">
                    {t("auth.delegatePhone")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input id="delegatePhone" required inputMode="numeric" />
                </Field>

                {/* Email */}
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="delegateEmail">
                    {t("auth.delegateEmail")}
                  </FieldLabel>
                  <Input id="delegateEmail" type="email" />
                </Field>

                {/* Attachment */}
                {showWrittenAttachment && (
                  <Field className="md:col-span-2">
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
                      </div>
                    </label>

                    <Input
                      id="writtenAuthorizationFile"
                      type="file"
                      className="hidden"
                      required
                    />
                  </Field>
                )}

                {/* Divider */}
                <div className="md:col-span-2">
                  <div className="my-2 h-px w-full bg-border" />
                  <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                    {t("auth.password")}
                  </h3>
                </div>

                {/* Password */}
                <Field>
                  <FieldLabel htmlFor="password">
                    {t("auth.password")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input id="password" type="password" required />
                </Field>

                {/* Confirm Password */}
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    {t("auth.confirmPassword")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input id="confirmPassword" type="password" required />
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

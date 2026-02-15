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
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Label } from "../ui/label";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  orgNationalId: z.number(),
  orgName: z.string(),
  capacity: z.enum(["owner", "Written", "register"]),
  nationality: z.enum(["jordanian", "non-jordanian"]),
  commissionerID: z.number(),
  email: z.string().email().optional(),
  phone: z.string(),
  commissionerFile: z.instanceof(File).optional(),
});
type Option = { value: string; label: string };
// type companySectorType = "government" | "private";
type formType = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof formType, string>>;

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const [companySector, setCompanySector] =
  //   useState<companySectorType>("government");
  const [form, setForm] = useState<formType>({
    orgNationalId: undefined,
    orgName: undefined,
    capacity: undefined,
    nationality: undefined,
    commissionerID: undefined,
    email: undefined,
    phone: undefined,
    commissionerFile: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const capacityOptions: Option[] = useMemo(
    () => [
      {
        value: "owner",
        label: t("reservation.options.commissionerCapicity.owner"),
      },
      {
        value: "Written",
        label: t("reservation.options.commissionerCapicity.Written"),
      },
      {
        value: "register",
        label: t("reservation.options.commissionerCapicity.register"),
      },
    ],
    [t],
  );

  const nationalityOptions: Option[] = useMemo(
    () => [
      {
        value: "jordanian",
        label: t("reservation.options.nationality.jordanian"),
      },
      {
        value: "non-jordanian",
        label: t("reservation.options.nationality.non-jordanian"),
      },
    ],
    [t],
  );

  {
    /* submit */
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(form);
      navigate("/organization-profile");
    } catch (error) {
      console.error(error);
    }
  }

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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {/*  ID */}
              <Field>
                <FieldLabel htmlFor="orgNationalId">
                  {t("auth.orgNationalId")}{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="orgNationalId"
                  type="number"
                  value={form.orgNationalId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      orgNationalId: Number(e.target.value),
                    }))
                  }
                  placeholder={t("auth.orgNationalIdPlaceholder")}
                  required
                />
              </Field>

              {/*  name */}
              <Field>
                <FieldLabel htmlFor="orgName">
                  {t("auth.organizationName")}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="orgName"
                  value={form.orgName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      orgName: e.target.value,
                    }))
                  }
                  placeholder={t("auth.organizationNamePlaceholder")}
                  required
                />
              </Field>

              {/* company sector */}
              {/* <RadioGroup
                defaultValue="goverment"
                onValueChange={(value) =>
                  setCompanySector(value as companySectorType)
                }
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
              </RadioGroup> */}

              {/* commissioner */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* capacity */}
                <Field>
                  <FieldLabel htmlFor="capacity">
                    {t("auth.capacity")} <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.capacity}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        capacity: value as formType["capacity"],
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
                        {capacityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* nationality */}
                <Field>
                  <FieldLabel htmlFor="nationality">
                    {t("auth.nationality")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.nationality}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        nationality: value as formType["nationality"],
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

              {/* commissioner ID */}
              <Field>
                <FieldLabel htmlFor="commissionerID">
                  {t("auth.commissionerID")}{" "}
                  <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="commissionerID"
                  type="number"
                  value={form.commissionerID}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      commissionerID: Number(e.target.value),
                    }))
                  }
                  placeholder={t("auth.commissionerIDPlaceholder")}
                  required
                />
              </Field>

              {/* email and pass */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* email */}
                <Field>
                  <FieldLabel htmlFor="email">
                    {t("auth.email")}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder={t("auth.emailPlaceholder")}
                    required
                  />
                </Field>

                {/* phone number */}
                <Field>
                  <FieldLabel htmlFor="phone">
                    {t("auth.phoneNumber")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder={t("auth.phoneNumberPlaceholder")}
                    required
                  />
                </Field>
              </FieldGroup>

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

              <Field>
                <label className="block space-y-2">
                  <span className="text-sm font-medium block">
                    {t("auth.file")}
                  </span>

                  <span className="flex gap-2">
                    <Button type="button" asChild>
                      <label>
                        {t("profile.chooseFile")}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              commissionerFile: e.target.files
                                ? e.target.files[0]
                                : undefined,
                            }))
                          }
                        />
                      </label>
                    </Button>

                    {form.commissionerFile && (
                      <p className="text-sm text-muted-foreground">
                        {form.commissionerFile.name}
                      </p>
                    )}
                  </span>
                </label>
              </Field>

              {/* SUBMIT */}
              <Field>
                <Button className="w-full" type="submit">
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

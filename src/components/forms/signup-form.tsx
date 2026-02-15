// imports
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
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// schema
const formSchema = z.object({
  orgNationalId: z.string().min(1),
  orgName: z.string().min(1),
  companySector: z.enum(["government", "private"]),
  delegateRole: z.enum(["owner", "authorizedOnRegistry", "written"]),
  nationality: z.enum(["jordanian", "nonJordanian"]),
  delegateNationalId: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email().optional(),
});

type FormType = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormType, string>>;
type Option = { value: string; label: string };

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormType>({
    orgNationalId: "",
    orgName: "",
    companySector: "government",
    delegateRole: "owner",
    nationality: "jordanian",
    delegateNationalId: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const sectorOptions: Option[] = useMemo(
    () => [
      { value: "government", label: t("auth.government") },
      { value: "private", label: t("auth.private") },
    ],
    [t],
  );

  const roleOptions: Option[] = useMemo(
    () => [
      { value: "owner", label: t("auth.owner") },
      { value: "authorizedOnRegistry", label: t("auth.authorizedOnRegistry") },
      { value: "written", label: t("auth.writtenDelegate") },
    ],
    [t],
  );

  const nationalityOptions: Option[] = useMemo(
    () => [
      { value: "jordanian", label: t("auth.jordanian") },
      { value: "nonJordanian", label: t("auth.nonJordanian") },
    ],
    [t],
  );

  function validate() {
    const result = formSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormType;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    console.log(form);
    navigate("/organization-profile");
  }

  const showDelegateNationalId = form.nationality === "jordanian";
  const showWrittenAttachment = form.delegateRole === "written";

  return (
    <div className={cn("mx-auto w-full max-w-3xl px-4", className)} {...props}>
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">

        <div className="bg-primary text-white px-6 py-7 flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <LogIn className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t("form.gate")}</h1>
            <p className="text-sm opacity-90">{t("form.reservation")}</p>
          </div>
        </div>

        <Card className="rounded-none shadow-none">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit}>
              <FieldGroup className="grid gap-4">

                {/* sector */}
                <Field>
                  <FieldLabel>{t("auth.companySector")} *</FieldLabel>
                  <Select
                    value={form.companySector}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, companySector: v as any }))
                    }
                    dir={t("dir")}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

                {/* org id */}
                <Field>
                  <FieldLabel>{t("auth.orgNationalId")} *</FieldLabel>
                  <Input
                    value={form.orgNationalId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, orgNationalId: e.target.value }))
                    }
                  />
                </Field>

                {/* org name */}
                <Field>
                  <FieldLabel>{t("auth.organizationName")} *</FieldLabel>
                  <Input
                    value={form.orgName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, orgName: e.target.value }))
                    }
                  />
                </Field>

                {/* role */}
                <Field>
                  <FieldLabel>{t("auth.delegateRole")} *</FieldLabel>
                  <Select
                    value={form.delegateRole}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, delegateRole: v as any }))
                    }
                    dir={t("dir")}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

                {/* nationality */}
                <Field>
                  <FieldLabel>{t("auth.delegateNationality")} *</FieldLabel>
                  <Select
                    value={form.nationality}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, nationality: v as any }))
                    }
                    dir={t("dir")}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
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

                {/* delegate ID */}
                {showDelegateNationalId && (
                  <Field>
                    <FieldLabel>{t("auth.delegateNationalId")} *</FieldLabel>
                    <Input
                      value={form.delegateNationalId}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          delegateNationalId: e.target.value,
                        }))
                      }
                    />
                  </Field>
                )}

                {/* phone */}
                <Field>
                  <FieldLabel>{t("auth.delegatePhone")} *</FieldLabel>
                  <Input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </Field>

                {/* email */}
                <Field>
                  <FieldLabel>{t("auth.delegateEmail")}</FieldLabel>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                  />
                </Field>

                {/* submit */}
                <Field>
                  <Button className="w-full" type="submit">
                    {t("auth.signup")}
                  </Button>

                  <FieldDescription className="text-center mt-2">
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

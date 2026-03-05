import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

const fileValidation = (t: any) =>
  z.instanceof(File).refine((file) => allowedTypes.includes(file.type), {
    message: t("errors.invalidFileType", {
      types: "PDF, JPG, PNG",
    }),
  });

const formSchema = (t: any) =>
  z.object({
    investmentType: z.string().min(1, t("errors.required")),
    investmentLocation: z
      .string()
      .min(1, t("errors.required"))
      .max(200, t("errors.max", { len: 200 })),
    investmentDuration: z.string().regex(/^\d{1,4}$/, t("errors.digitsOnly")),
    financialProposal: z.string().regex(/^\d{1,15}$/, t("errors.digitsOnly")),
    operationalPlan: fileValidation(t),
    feasibilityStudy: fileValidation(t),
    presentation: fileValidation(t),
    financialSolvency: fileValidation(t),
  });

type InvestmentFormData = z.infer<ReturnType<typeof formSchema>>;

export default function InvestmentForm({ className }: { className?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const schema = formSchema(t);

  const [form, setForm] = useState<Partial<InvestmentFormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const result = schema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((r) => setTimeout(r, 1500));

    navigate("/user/confirmation-message", {
      state: {
        descKey: "confirmationMassage.descForInvestment",
        step1Key: "confirmationMassage.step1ForInvestment",
      },
    });

    setIsSubmitting(false);
  }

  return (
    <div
      dir={t("dir")}
      className={cn(
        "rounded-2xl shadow-xl overflow-hidden bg-background",
        className,
      )}
    >
      {/* HEADER */}
      <div className="flex items-center gap-4 bg-primary text-white px-6 py-6">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Briefcase className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold">
            {t("reservation.investment.title")}
          </h1>
          <p className="text-sm opacity-90 mt-1">
            {t("reservation.investment.subtitle")}
          </p>
        </div>
      </div>

      <Card className="rounded-none shadow-none border-0">
        <CardContent className="p-6 bg-muted/30">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-6">
              {/* DETAILS */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h2 className="text-lg font-semibold mb-6">
                  {t("reservation.investment.sections.details")}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <Field>
                    <FieldLabel>
                      {t("reservation.investment.fields.investmentType")}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>

                    <Select
                      dir={t("dir")}
                      onValueChange={(v) =>
                        setForm({ ...form, investmentType: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(
                            t("reservation.investment.options.investmentType", {
                              returnObjects: true,
                            }) as any,
                          ).map(([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value as string}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <FieldError>{errors.investmentType}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>
                      {t("reservation.investment.fields.investmentLocation")}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      maxLength={200}
                      onChange={(e) =>
                        setForm({ ...form, investmentLocation: e.target.value })
                      }
                    />
                    <FieldError>{errors.investmentLocation}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>
                      {t("reservation.investment.fields.investmentDuration")}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex rounded-lg overflow-hidden border">
                      <Input
                        inputMode="numeric"
                        className="border-0 focus-visible:ring-0"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            investmentDuration: e.target.value,
                          })
                        }
                      />
                      <span className="flex items-center px-4 bg-muted text-sm">
                        {t("reservation.investment.units.months")}
                      </span>
                    </div>
                    <FieldError>{errors.investmentDuration}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>
                      {t("reservation.investment.fields.financialProposal")}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <div className="flex rounded-lg overflow-hidden border">
                      <Input
                        inputMode="numeric"
                        className="border-0 focus-visible:ring-0"
                        onChange={(e) =>
                          setForm({
                            ...form,
                            financialProposal: e.target.value,
                          })
                        }
                      />
                      <span className="flex items-center px-4 bg-muted text-sm">
                        {t("reservation.investment.units.jod")}
                      </span>
                    </div>
                    <FieldError>{errors.financialProposal}</FieldError>
                  </Field>
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="bg-white rounded-xl p-5 shadow-sm border">
                <h2 className="text-lg font-semibold mb-6">
                  {t("reservation.investment.sections.documents")}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "operationalPlan",
                    "feasibilityStudy",
                    "presentation",
                    "financialSolvency",
                  ].map((field) => (
                    <Field key={field}>
                      <FieldLabel htmlFor={field}>
                        {t(`reservation.investment.fields.${field}`)}{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>

                      {/* Upload Box */}
                      <label
                        htmlFor={field}
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

                          {form[field as keyof InvestmentFormData] && (
                            <p className="mt-2 text-sm text-gray-700">
                              {t("common.selectedFile")}:{" "}
                              <strong>
                                {
                                  (
                                    form[
                                      field as keyof InvestmentFormData
                                    ] as File
                                  )?.name
                                }
                              </strong>
                            </p>
                          )}
                        </div>
                      </label>

                      {/* Hidden Input */}
                      <Input
                        id={field}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setForm((prev) => ({
                            ...prev,
                            [field]: file,
                          }));
                        }}
                        className="hidden"
                      />

                      <FieldError>{errors[field]}</FieldError>
                    </Field>
                  ))}
                </div>
              </div>
              {/* ACTIONS */}
              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  className="flex-1 h-11 text-base font-semibold"
                >
                  {isSubmitting
                    ? t("reservation.actions.isSubmitting")
                    : t("reservation.actions.submit")}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 px-8"
                  onClick={() => navigate(-1)}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

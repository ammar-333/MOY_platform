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
import { Briefcase, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

const fileValidation = (t: any) =>
  z
    .instanceof(File, { message: t("errors.required") })
    .refine((file) => allowedTypes.includes(file.type), {
      message: t("errors.invalidFileType", { types: "PDF, JPG, PNG" }),
    });

const formSchema = (t: any) =>
  z.object({
    investmentType: z.array(z.string()).min(1, t("errors.required")),
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

  const [form, setForm] = useState<Partial<InvestmentFormData>>({
    investmentType: [],
    investmentLocation: "",
    investmentDuration: "",
    financialProposal: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openTypes, setOpenTypes] = useState(false);

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
        title: "confirmationMassage.titleForInvestment",
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
      <div className="flex items-center gap-4 bg-primary text-white px-6 py-10">
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
              {/* ================= BENEFICIARY INFO CARD ================= */}
              <Card
                className="group relative overflow-hidden rounded-2xl 
                border border-blue-200/40 
                bg-gradient-to-br from-blue-50/70 via-white/60 to-blue-100/40 
                backdrop-blur-xl 
                shadow-lg 
                transition-all duration-500 ease-out
                hover:-translate-y-1 hover:shadow-2xl hover:border-primary/40"
              >
                {/* Glow Effects */}
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-30 transition-all duration-500 group-hover:opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:opacity-40" />

                <CardContent className="relative px-6 py-2">
                  <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="relative transition-all duration-500 group-hover:scale-105">
                      <div
                        className="w-16 h-16 rounded-full 
                      bg-white/60 backdrop-blur-md 
                      flex items-center justify-center 
                      ring-4 ring-primary/20 
                      shadow-md 
                      transition-all duration-500 
                      group-hover:ring-primary/40 group-hover:shadow-xl"
                      >
                        <User className="h-8 w-8 text-primary transition-all duration-500 group-hover:scale-110" />
                      </div>

                      <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-primary/80">
                        {t("reservation.sections.personal")}
                      </p>

                      <h3 className="text-xl font-bold text-slate-800 tracking-wide">
                        {t("shared.beneficiaryName")}
                      </h3>

                      <p className="text-sm text-slate-500">
                        ليث احمد ابراهيم تنيره
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

                    <div
                      className={cn(
                        "border rounded-xl overflow-hidden bg-background transition-all duration-300",
                        openTypes && "shadow-md",
                        errors.investmentType && "border-red-500",
                      )}
                    >
                      {/* Header */}
                      <button
                        type="button"
                        onClick={() => setOpenTypes(!openTypes)}
                        className="flex items-center justify-between w-full h-9  rounded-md px-3 bg-background cursor-pointer"
                      >
                        <span className="text-sm">
                          {form.investmentType?.length
                            ? `${form.investmentType.length} ${t("reservation.investment.selected")}`
                            : t("reservation.placeholders.select")}
                        </span>

                        <svg
                          className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            openTypes && "rotate-180",
                          )}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M5 8l5 5 5-5H5z" />
                        </svg>
                      </button>

                      {/* Animated Options */}
                      <div
                        className={cn(
                          "grid grid-cols-2 gap-3 px-4 transition-all duration-300 ease-in-out",
                          openTypes
                            ? "max-h-96 py-4 opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        {Object.entries(
                          t("reservation.investment.options.investmentType", {
                            returnObjects: true,
                          }) as Record<string, string>,
                        ).map(([key, value]) => {
                          const selected = form.investmentType?.includes(key);

                          return (
                            <label
                              key={key}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-md cursor-pointer border transition",
                                selected
                                  ? "bg-blue-50 border-blue-500"
                                  : "hover:bg-muted border-transparent",
                              )}
                            >
                              <input
                                type="checkbox"
                                className="accent-blue-600"
                                checked={selected}
                                onChange={(e) => {
                                  const checked = e.target.checked;

                                  setForm((prev) => {
                                    const current = prev.investmentType || [];

                                    return {
                                      ...prev,
                                      investmentType: checked
                                        ? [...current, key]
                                        : current.filter((v) => v !== key),
                                    };
                                  });
                                }}
                              />

                              <span className="text-sm">{value}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <FieldError>{errors.investmentType}</FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>
                      {t("reservation.investment.fields.investmentLocation")}{" "}
                      <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      maxLength={200}
                      className={cn(
                        errors.investmentLocation &&
                          "border-red-500 focus-visible:ring-red-500",
                      )}
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
                    <div
                      className={cn(
                        "flex rounded-lg overflow-hidden border",
                        errors.investmentDuration && "border-red-500",
                      )}
                    >
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
                    <div
                      className={cn(
                        "flex rounded-lg overflow-hidden border",
                        errors.financialProposal && "border-red-500",
                      )}
                    >
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
                        className={cn(
                          "flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition",
                          errors[field] ? "border-red-500" : "border-primary",
                        )}
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

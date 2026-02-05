// src/components/reservation-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CalendarDays, Hotel } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = { value: string; label: string };
type complexType = "" | "youthCenter" | "sportComplex";
type facilityType = "" | "court" | "swimmingPool" | "hall";

function daysBetween(from: string, to: string) {
  if (!from || !to) return 0;
  const d1 = new Date(from);
  const d2 = new Date(to);
  const diff = d2.getTime() - d1.getTime();
  if (Number.isNaN(diff)) return 0;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export default function SportComplex({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [complexType, setComplexType] = useState<complexType>("");
  const [serviceType, setServiceType] = useState("");
  const [facilityType, setFacilityType] = useState<facilityType>("");
  const [facilitys, setFacilitys] = useState("");
  const [center, setCenter] = useState("");
  const [complex, setComplex] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("1");

  const showFacilities = facilityType !== "";

  const courtOptions: Option[] = useMemo(
    () => [
      {
        value: "tennis",
        label: t("reservation.options.ComplexFacilitys.court.tennis"),
      },
      {
        value: "basketball",
        label: t("reservation.options.ComplexFacilitys.court.basketball"),
      },
      {
        value: "football",
        label: t("reservation.options.ComplexFacilitys.court.football"),
      },
    ],
    [t],
  );

  const hallOptions: Option[] = useMemo(
    () => [
      {
        value: "smallHall",
        label: t("reservation.options.ComplexFacilitys.hall.smallHall"),
      },
      {
        value: "largeHall",
        label: t("reservation.options.ComplexFacilitys.hall.largeHall"),
      },
    ],
    [t],
  );

  const swimpoolOptions: Option[] = useMemo(
    () => [
      {
        value: "pool",
        label: t("reservation.options.ComplexFacilitys.swimmingPool.pool"),
      },
    ],
    [t],
  );

  const serviceOptions: Option[] = useMemo(
    () => [
      { value: "activity", label: t("reservation.options.service.activity") },
    ],
    [t],
  );

  const facilityTypeOptions: Option[] = useMemo(
    () => [
      {
        value: "court",
        label: t("reservation.options.ComplexFacilitys.court.name"),
      },
      {
        value: "hall",
        label: t("reservation.options.ComplexFacilitys.hall.name"),
      },
      {
        value: "swimmingPool",
        label: t("reservation.options.ComplexFacilitys.swimmingPool.name"),
      },
    ],
    [t],
  );

  const facilityOptions = useMemo(() => {
    if (facilityType === "court") return courtOptions;
    if (facilityType === "hall") return hallOptions;
    if (facilityType === "swimmingPool") return swimpoolOptions;
  }, [facilityType, courtOptions, swimpoolOptions, hallOptions]);

  const centerOptions: Option[] = useMemo(
    () => [
      {
        value: "petra-wadi-musa",
        label: t("reservation.options.center.petraWadiMusa"),
      },
      { value: "ajloun", label: t("reservation.options.center.ajloun") },
      { value: "aqaba", label: t("reservation.options.center.aqaba") },
    ],
    [t],
  );

  const complexTypeOptions: Option[] = useMemo(
    () => [
      {
        value: "youthCenter",
        label: t("reservation.fields.youtCenter"),
      },
      { value: "sportComplex", label: t("reservation.fields.sportsComplex") },
    ],
    [t],
  );

  const complexOptions: Option[] = useMemo(
    () => [
      {
        value: "petra-wadi-musa",
        label: t("reservation.options.complex.ammanSportsCity"),
      },
      {
        value: "ajloun",
        label: t("reservation.options.complex.irbidSportsCity"),
      },
      {
        value: "aqaba",
        label: t("reservation.options.complex.aqabaSportsCity"),
      },
    ],
    [t],
  );

  const durationDays = useMemo(
    () => daysBetween(fromDate, toDate),
    [fromDate, toDate],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/confirmation-message");
  }

  return (
    <div
      className={cn("rounded-2xl shadow-lg overflow-hidden", className)}
      {...props}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between bg-primary text-white px-8 pt-6 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex size-15 items-center justify-center rounded-full bg-white/20">
            <Hotel className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {t("reservation.sportsComplex.title")}
            </h1>
            <p className="mt-1 text-sm opacity-90">
              {t("reservation.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <Card className="rounded-none shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    {t("reservation.sections.booking")}
                  </h2>
                </div>
              </div>

              {/* First row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* complex type */}
                <Field>
                  <FieldLabel htmlFor="complexType">
                    {t("reservation.fields.complexType")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={complexType}
                    onValueChange={(v: string) =>
                      setComplexType(v as complexType)
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
                        {complexTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Service Type */}
                <Field>
                  <FieldLabel htmlFor="serviceType">
                    {t("reservation.fields.serviceType")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={serviceType}
                    onValueChange={setServiceType}
                    dir={t("dir")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("reservation.placeholders.select")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              {/* complex type */}
              <FieldGroup>
                {complexType === "youthCenter" && (
                  <Field>
                    <FieldLabel htmlFor="center">
                      {t("reservation.fields.youtCenter")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={center}
                      onValueChange={setCenter}
                      dir={t("dir")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {centerOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {complexType === "sportComplex" && (
                  <Field>
                    <FieldLabel htmlFor="sportComplex">
                      {t("reservation.fields.sportsComplex")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={complex}
                      onValueChange={setComplex}
                      dir={t("dir")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {complexOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>

              {/* second row */}
              <FieldGroup>
                {/* facilitys type */}
                <Field>
                  <FieldLabel htmlFor="facilityType">
                    {t("reservation.fields.facilityType")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={facilityType}
                    onValueChange={(v: string) =>
                      setFacilityType(v as facilityType)
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
                        {facilityTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* facilitys */}
                {showFacilities && (
                  <Field>
                    <FieldLabel htmlFor="facilitys">
                      {t("reservation.fields.facilitys")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={facilitys}
                      onValueChange={setFacilitys}
                      dir={t("dir")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {facilityOptions?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </FieldGroup>

              <hr className="border-border" />

              {/* third row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="fromDate">
                    {t("reservation.fields.fromDate")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="toDate">
                    {t("reservation.fields.toDate")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="duration">
                    {t("reservation.fields.durationDays")}
                  </FieldLabel>
                  <Input
                    id="duration"
                    value={String(durationDays)}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* 4th row */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="beneficiaries">
                    {t("reservation.fields.beneficiaries")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="beneficiaries"
                    type="number"
                    min={1}
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(e.target.value)}
                    required
                  />
                </Field>
              </FieldGroup>

              {/* Buttons */}
              <Field>
                <div className="flex flex-wrap items-center gap-5">
                  <Button type="submit" className="flex-1 py-6 text-base">
                    {t("reservation.actions.submit")}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-10"
                    onClick={() => navigate(-1)}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

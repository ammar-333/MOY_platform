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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock2Icon } from "lucide-react";

type Option = { value: string; label: string };
type complexType = "" | "youthCenter" | "sportComplex";
type serviceType = "" | "activity";

function daysBetween(from?: Date, to?: Date) {
  if (!from || !to) return 0;
  const diff = to.getTime() - from.getTime();
  if (Number.isNaN(diff)) return 0;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days + 1;
}

function hoursBetween(startTime: string, endTime: string) {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const start = sh * 60 + sm; // minutes
  const end = eh * 60 + em;

  const diff = end - start;

  const hours = Math.floor(diff / 60);

  if (hours < 0) return 0;
  return hours;
}

export default function SportComplex({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [complexType, setComplexType] = useState<complexType>("");
  const [serviceType, setServiceType] = useState<serviceType>("");

  const [center, setCenter] = useState("");
  const [complex, setComplex] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [facilitys, setFacilitys] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("1");

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const today = new Date();
  const maxDate = addMonths(today, 2);
  const showFacilities = facilityType !== "";

  const durationDays = useMemo(
    () => daysBetween(dateRange?.from, dateRange?.to),
    [dateRange],
  );

  const durationHours = useMemo(
    () => hoursBetween(startTime, endTime),
    [startTime, endTime],
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

  const serviceOptions: Option[] = useMemo(
    () => [
      { value: "activity", label: t("reservation.options.service.activity") },
    ],
    [t],
  );

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
        label: t("reservation.options.ComplexFacilitys.hall.small"),
      },
      {
        value: "largeHall",
        label: t("reservation.options.ComplexFacilitys.hall.large"),
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

  const facilityOptions = useMemo(() => {
    if (facilityType === "court") return courtOptions;
    if (facilityType === "hall") return hallOptions;
    if (facilityType === "swimmingPool") return swimpoolOptions;
  }, [facilityType, courtOptions, swimpoolOptions, hallOptions]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/confirmation-message", {
      state: {
        descKey: "confirmationMassage.descForsportComplex",
        step1Key: "confirmationMassage.step1ForsportComplex",
      },
    });
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
                    onValueChange={(v) => setServiceType(v as serviceType)}
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

              {/* facilitys */}
              <FieldGroup>
                {/* facilitys type */}
                <Field>
                  <FieldLabel htmlFor="facilityType">
                    {t("reservation.fields.facilityType")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={facilityType}
                    onValueChange={(v: string) => setFacilityType(v)}
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

              {/* date */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field className="mx-auto">
                  <FieldLabel htmlFor="date-picker-range">
                    {t("reservation.fields.dateRange")}
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-picker-range"
                        className="justify-start px-2.5 font-normal bg-accent"
                      >
                        <CalendarIcon />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>{t("reservation.fields.PickDate")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 max-h-[55vh] overflow-y-auto"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        fromMonth={today}
                        toMonth={maxDate}
                        numberOfMonths={2}
                        disabled={{
                          before: today,
                          after: maxDate,
                        }}
                      />
                      <FieldGroup className="bg-card border-t py-3 px-7">
                        <Field>
                          <FieldLabel htmlFor="time-from">
                            {t("reservation.fields.startTime")}
                          </FieldLabel>
                          <InputGroup className="p-2">
                            <InputGroupInput
                              id="time-from"
                              type="time"
                              step={60}
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              onClick={(e) =>
                                (e.target as HTMLInputElement).showPicker()
                              }
                            />
                            <InputGroupAddon>
                              <Clock2Icon className="text-muted-foreground" />
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="time-to">
                            {t("reservation.fields.endTime")}
                          </FieldLabel>
                          <InputGroup className="p-2">
                            <InputGroupInput
                              id="time-to"
                              type="time"
                              step={60}
                              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                              onClick={(e) =>
                                (e.target as HTMLInputElement).showPicker()
                              }
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                            />
                            <InputGroupAddon>
                              <Clock2Icon className="text-muted-foreground" />
                            </InputGroupAddon>
                          </InputGroup>
                        </Field>
                      </FieldGroup>
                    </PopoverContent>
                  </Popover>
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

                <Field>
                  <FieldLabel htmlFor="durationHours">
                    {t("reservation.fields.durationHours")}
                  </FieldLabel>
                  <Input
                    id="durationHours"
                    value={String(durationHours)}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* people number */}
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
                <div className="flex flex-wrap items-center gap-5 mt-6">
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

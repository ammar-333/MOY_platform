// src/components/reservation-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Users, Hotel } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type Option = { value: string; label: string };
type FacilityType = "" | "room" | "tent" | "suite" | "chalet" | "bed";

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "border-input dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {placeholder ? (
        <option value="" className="dark:text-black">
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="dark:text-black">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function daysBetween(from: string, to: string) {
  if (!from || !to) return 0;
  const d1 = new Date(from);
  const d2 = new Date(to);
  const diff = d2.getTime() - d1.getTime();
  if (Number.isNaN(diff)) return 0;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export default function YouthHouse({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState("");
  const [house, setHouse] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("1");

  const [facility, setFacility] = useState<FacilityType>("");
  const [availableCapacity] = useState("15");

  const [requiredRooms, setRequiredRooms] = useState("1");
  const [requiredTents, setRequiredTents] = useState("1");
  const [requiredSuites, setRequiredSuites] = useState("1");
  const [requiredChalets, setRequiredChalets] = useState("1");
  const [requiredBeds, setRequiredBeds] = useState("1");

  const [activityPlan, setActivityPlan] = useState("");
  const [groupLeader, setGroupLeader] = useState("");
  const [participantsInfo, setParticipantsInfo] = useState("");

  const showFacilitySection =
    serviceType === "accommodation" || serviceType === "both";
  const showActivitySection =
    serviceType === "activity" || serviceType === "both";
  const showCapacity = showFacilitySection && facility !== "";

  const serviceOptions: Option[] = useMemo(
    () => [
      {
        value: "accommodation",
        label: t("reservation.options.service.accommodation"),
      },
      { value: "activity", label: t("reservation.options.service.activity") },
      { value: "both", label: t("reservation.options.service.both") },
    ],
    [t],
  );

  const houseOptions: Option[] = useMemo(
    () => [
      {
        value: "petra-wadi-musa",
        label: t("reservation.options.house.petraWadiMusa"),
      },
      { value: "ajloun", label: t("reservation.options.house.ajloun") },
      { value: "aqaba", label: t("reservation.options.house.aqaba") },
    ],
    [t],
  );

  const facilityOptions: Option[] = useMemo(
    () => [
      { value: "room", label: t("reservation.options.facility.room") },
      { value: "chalet", label: t("reservation.options.facility.chalet") },
      { value: "tent", label: t("reservation.options.facility.tent") },
      { value: "suite", label: t("reservation.options.facility.suite") },
      { value: "bed", label: t("reservation.options.facility.bed") },
    ],
    [t],
  );

  const durationDays = useMemo(
    () => daysBetween(fromDate, toDate),
    [fromDate, toDate],
  );

  const activeCountKey = useMemo(() => {
    if (!showFacilitySection) return "";
    if (facility === "room") return "room";
    if (facility === "tent") return "tent";
    if (facility === "suite") return "suite";
    if (facility === "chalet") return "chalet";
    if (facility === "bed") return "bed";
    return "";
  }, [facility, showFacilitySection]);

  const activeCountLabel = useMemo(() => {
    if (activeCountKey === "room") return t("reservation.fields.requiredRooms");
    if (activeCountKey === "tent") return t("reservation.fields.requiredTents");
    if (activeCountKey === "suite")
      return t("reservation.fields.requiredSuites");
    if (activeCountKey === "chalet")
      return t("reservation.fields.requiredChalets");
    if (activeCountKey === "bed") return t("reservation.fields.requiredBeds");
    return "";
  }, [activeCountKey, t]);

  const activeCountValue = useMemo(() => {
    if (activeCountKey === "room") return requiredRooms;
    if (activeCountKey === "tent") return requiredTents;
    if (activeCountKey === "suite") return requiredSuites;
    if (activeCountKey === "chalet") return requiredChalets;
    if (activeCountKey === "bed") return requiredBeds;
    return "";
  }, [
    activeCountKey,
    requiredRooms,
    requiredTents,
    requiredSuites,
    requiredChalets,
    requiredBeds,
  ]);

  function setActiveCountValue(v: string) {
    if (activeCountKey === "room") setRequiredRooms(v);
    else if (activeCountKey === "tent") setRequiredTents(v);
    else if (activeCountKey === "suite") setRequiredSuites(v);
    else if (activeCountKey === "chalet") setRequiredChalets(v);
    else if (activeCountKey === "bed") setRequiredBeds(v);
  }

  function resetFacilityCounts() {
    setRequiredRooms("1");
    setRequiredTents("1");
    setRequiredSuites("1");
    setRequiredChalets("1");
  }

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
            <h1 className="text-2xl font-bold">{t("reservation.title")}</h1>
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
                {/* Youth House */}
                <Field>
                  <FieldLabel htmlFor="house">
                    {t("reservation.fields.youthHouse")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    id="house"
                    value={house}
                    onChange={setHouse}
                    options={houseOptions}
                    placeholder={t("reservation.placeholders.select")}
                  />
                </Field>

                {/* Service Type */}
                <Field>
                  <FieldLabel htmlFor="serviceType">
                    {t("reservation.fields.serviceType")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    id="serviceType"
                    value={serviceType}
                    onChange={(v) => {
                      setServiceType(v);
                      if (v !== "accommodation") {
                        setFacility("");
                        resetFacilityCounts();
                      }
                    }}
                    options={serviceOptions}
                    placeholder={t("reservation.placeholders.select")}
                  />
                </Field>
              </FieldGroup>

              {/* Second row */}
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

              {/* Third row */}
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

              {/* SECTION: Facility */}
              {showFacilitySection && (
                <>
                  <hr className="border-border" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">
                        {t("reservation.sections.facility")}
                      </h2>
                    </div>
                  </div>

                  <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="facility">
                        {t("reservation.fields.facilityType")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        id="facility"
                        value={facility}
                        onChange={(v) => {
                          const fv = v as FacilityType;
                          setFacility(fv);
                          if (!fv) resetFacilityCounts();
                        }}
                        options={facilityOptions}
                        placeholder={t("reservation.placeholders.select")}
                      />
                    </Field>

                    {showCapacity && (
                      <Field>
                        <FieldLabel htmlFor="availableCapacity">
                          {t("reservation.fields.availableCapacity")}
                        </FieldLabel>
                        <Input
                          id="availableCapacity"
                          value={availableCapacity}
                          readOnly
                          className="bg-muted cursor-not-allowed"
                        />
                      </Field>
                    )}
                  </FieldGroup>

                  {activeCountKey !== "" && (
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="requiredCount">
                          {activeCountLabel}{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id="requiredCount"
                          type="number"
                          min={1}
                          value={activeCountValue}
                          onChange={(e) => setActiveCountValue(e.target.value)}
                          required
                        />
                      </Field>
                    </FieldGroup>
                  )}
                </>
              )}

              {/* SECTION: Activity */}
              {showActivitySection && (
                <>
                  <hr className="border-border" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">
                        {t("reservation.sections.activity")}
                      </h2>
                    </div>
                  </div>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="activityPlan">
                        {t("reservation.fields.activityPlan")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Textarea
                        id="activityPlan"
                        placeholder={t("reservation.placeholders.activityPlan")}
                        value={activityPlan}
                        onChange={(e) => setActivityPlan(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="groupLeader">
                        {t("reservation.fields.groupLeader")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id="groupLeader"
                        placeholder={t("reservation.placeholders.groupLeader")}
                        value={groupLeader}
                        onChange={(e) => setGroupLeader(e.target.value)}
                        required
                      />
                    </Field>
                  </FieldGroup>

                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="participantsInfo">
                        {t("reservation.fields.participantsInfo")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Textarea
                        id="participantsInfo"
                        placeholder={t(
                          "reservation.placeholders.participantsInfo",
                        )}
                        value={participantsInfo}
                        onChange={(e) => setParticipantsInfo(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                </>
              )}

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

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";

type Option = { value: string; label: string };
type FacilityType = "" | "room" | "tent" | "suite" | "chalet";
type houseOrCampType = "" | "house" | "camp";
type capacityType = "" | "normal" | "double" | "triple" | "four" | "five";

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
  const [houseOrCamp, setHouseOrCamp] = useState<houseOrCampType>("");
  const [house, setHouse] = useState("");
  const [camp, setCamp] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("1");

  const [sharedRoom, setSharedRoom] = useState(false);
  const [sharedTent, setSharedTent] = useState(false);
  const [capacity, setCapacity] = useState<capacityType>("");

  const [facility, setFacility] = useState<FacilityType>("");
  const [availableCapacity] = useState("15");

  const [requiredRooms, setRequiredRooms] = useState("1");
  const [requiredTents, setRequiredTents] = useState("1");
  const [requiredSuites, setRequiredSuites] = useState("1");
  const [requiredChalets, setRequiredChalets] = useState("1");

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

  const campOptions: Option[] = useMemo(
    () => [
      {
        value: "northCamp",
        label: t("reservation.options.camp.northCamp"),
      },
      { value: "southCamp", label: t("reservation.options.camp.southCamp") },
    ],
    [t],
  );

  const houseOrCampOptions: Option[] = useMemo(
    () => [
      {
        value: "house",
        label: t("reservation.fields.youthHouse"),
      },
      { value: "camp", label: t("reservation.fields.camp") },
    ],
    [t],
  );

  const capacityptions: Option[] = useMemo(
    () => [
      {
        value: "normal",
        label: t("reservation.options.capacity.normal"),
      },
      { value: "double", label: t("reservation.options.capacity.double") },
      { value: "triple", label: t("reservation.options.capacity.triple") },
      { value: "four", label: t("reservation.options.capacity.four") },
      { value: "five", label: t("reservation.options.capacity.five") },
    ],
    [t],
  );

  const facilityOptions: Option[] = useMemo(
    () => [
      { value: "room", label: t("reservation.options.facility.room") },
      { value: "chalet", label: t("reservation.options.facility.chalet") },
      { value: "tent", label: t("reservation.options.facility.tent") },
      { value: "suite", label: t("reservation.options.facility.suite") },
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
    return "";
  }, [facility, showFacilitySection]);

  const activeCountLabel = useMemo(() => {
    if (activeCountKey === "room") return t("reservation.fields.requiredRooms");
    if (activeCountKey === "tent") return t("reservation.fields.requiredTents");
    if (activeCountKey === "suite")
      return t("reservation.fields.requiredSuites");
    if (activeCountKey === "chalet")
      return t("reservation.fields.requiredChalets");
    return "";
  }, [activeCountKey, t]);

  const activeCountValue = useMemo(() => {
    if (activeCountKey === "room") return requiredRooms;
    if (activeCountKey === "tent") return requiredTents;
    if (activeCountKey === "suite") return requiredSuites;
    if (activeCountKey === "chalet") return requiredChalets;
    return "";
  }, [
    activeCountKey,
    requiredRooms,
    requiredTents,
    requiredSuites,
    requiredChalets,
  ]);

  function setActiveCountValue(v: string) {
    if (activeCountKey === "room") setRequiredRooms(v);
    else if (activeCountKey === "tent") setRequiredTents(v);
    else if (activeCountKey === "suite") setRequiredSuites(v);
    else if (activeCountKey === "chalet") setRequiredChalets(v);
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
            <h1 className="text-2xl font-bold">
              {t("reservation.youthHouse.title")}
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
                {/* House type */}
                <Field>
                  <FieldLabel htmlFor="houseOrCamp">
                    {t("reservation.fields.houseOrCamp")}{" "}
                    <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={houseOrCamp}
                    onValueChange={(v: string) =>
                      setHouseOrCamp(v as houseOrCampType)
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
                        {houseOrCampOptions.map((option) => (
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
                    onValueChange={(v) => {
                      setServiceType(v);
                      if (v !== "accommodation") {
                        setFacility("");
                        resetFacilityCounts();
                      }
                    }}
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

              {/* house type */}
              <FieldGroup>
                {/* Youth House */}
                {houseOrCamp === "house" && (
                  <Field>
                    <FieldLabel htmlFor="house">
                      {t("reservation.fields.youthHouse")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={house}
                      onValueChange={setHouse}
                      dir={t("dir")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {houseOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {/* camp */}
                {houseOrCamp === "camp" && (
                  <Field>
                    <FieldLabel htmlFor="camp">
                      {t("reservation.fields.camp")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={camp} onValueChange={setCamp} dir={t("dir")}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("reservation.placeholders.select")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {campOptions.map((option) => (
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

                  <FieldGroup>
                    {/* facility Type */}
                    <Field>
                      <FieldLabel htmlFor="facility">
                        {t("reservation.fields.facilityType")}{" "}
                        <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={facility}
                        onValueChange={(v) => {
                          const fv = v as FacilityType;
                          setFacility(fv);
                          if (!fv) resetFacilityCounts();
                        }}
                        dir={t("dir")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("reservation.placeholders.select")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {facilityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>

                    {/* capacity */}
                    <FieldGroup>
                      {activeCountKey === "room" && (
                        <Field orientation="horizontal">
                          <Checkbox
                            id="sharedRoom-checkbox"
                            name="sharedRoom"
                            checked={sharedRoom}
                            onCheckedChange={(value) =>
                              setSharedRoom(value as boolean)
                            }
                          />
                          <FieldLabel htmlFor="sharedRoom-checkbox">
                            {t("reservation.fields.sharedRoom")}
                          </FieldLabel>
                        </Field>
                      )}

                      {activeCountKey === "tent" && (
                        <Field orientation="horizontal">
                          <Checkbox
                            id="sharedTent-checkbox"
                            name="sharedTent"
                            checked={sharedTent}
                            onCheckedChange={(value) =>
                              setSharedTent(value as boolean)
                            }
                          />
                          <FieldLabel htmlFor="sharedTent-checkbox">
                            {t("reservation.fields.sharedTent")}
                          </FieldLabel>
                        </Field>
                      )}

                      {showCapacity && (
                        <Field>
                          <FieldLabel htmlFor="capacity">
                            {t("reservation.fields.capacity")}{" "}
                            <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={capacity}
                            onValueChange={(v: string) =>
                              setCapacity(v as capacityType)
                            }
                            dir={t("dir")}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={t(
                                  "reservation.placeholders.select",
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {capacityptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                      )}
                    </FieldGroup>

                    {/* number */}
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {showCapacity && (
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
                            onChange={(e) =>
                              setActiveCountValue(e.target.value)
                            }
                            required
                          />
                        </Field>
                      )}

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
                  </FieldGroup>
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

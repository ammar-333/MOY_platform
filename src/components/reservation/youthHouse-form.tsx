// src/components/reservation-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
// import { type DateRange } from "react-day-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock2Icon } from "lucide-react";
import { z } from "zod";

type Option = { value: string; label: string };
// type houseOrCampType = "" | "house" | "camp";
// type serviceType = "" | "activity" | "accommodation" | "both";
// type FacilityType = "" | "room" | "tent" | "suite" | "chalet";
// type capacityType = "normal" | "double" | "triple" | "four" | "five";

const formSchema = z.object({
  serviceType: z.enum(["activity", "accommodation", "both"]),
  houseOrCamp: z.enum(["house", "camp"]),

  house: z.string().optional(),
  camp: z.string().optional(),

  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),

  beneficiaries: z.string().min(1).max(50, "Too many beneficiaries"),

  facility: z.enum(["room", "tent", "suite", "chalet"]).optional(),
  capacity: z.enum(["normal", "double", "triple", "four", "five"]).optional(),
  isShared: z.boolean().optional(),

  activity: z.string().optional(),
});
type formType = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof formType, string>>;

function daysBetween(from?: Date, to?: Date) {
  if (!from || !to) return 0;
  const diff = to.getTime() - from.getTime();
  if (Number.isNaN(diff)) return 0;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days + 1;
}

export default function YouthHouse({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState<formType>({
    serviceType: undefined,
    houseOrCamp: undefined,

    house: undefined,
    camp: undefined,

    dateRange: undefined,
    startTime: undefined,
    endTime: undefined,

    beneficiaries: undefined,

    facility: undefined,
    capacity: undefined,
    isShared: undefined,

    activity: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [serviceType, setServiceType] = useState<serviceType>();
  // const [houseOrCamp, setHouseOrCamp] = useState<houseOrCampType>();
  // const [house, setHouse] = useState<string>();
  // const [camp, setCamp] = useState<string>();
  // const [beneficiaries, setBeneficiaries] = useState<string>();

  // const [facility, setFacility] = useState<FacilityType>();
  // const [capacity, setCapacity] = useState<capacityType>();
  // const [isShared, setIsShared] = useState(false);

  // const [activity, setActivity] = useState<string>();

  // const [dateRange, setDateRange] = useState<DateRange | undefined>();
  // const [startTime, setStartTime] = useState<string>();
  // const [endTime, setEndTime] = useState<string>();

  const today = new Date();
  const maxDate = addMonths(today, 2);
  const showFacilitySection =
    form.serviceType === "accommodation" || form.serviceType === "both";
  const showActivitySection =
    form.serviceType === "activity" || form.serviceType === "both";

  const durationDays = useMemo(
    () => daysBetween(form.dateRange?.from, form.dateRange?.to),
    [form.dateRange],
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

  const facilityOptions: Option[] = useMemo(
    () => [
      { value: "room", label: t("reservation.options.facility.room") },
      { value: "tent", label: t("reservation.options.facility.tent") },
      { value: "suite", label: t("reservation.options.facility.suite") },
      { value: "chalet", label: t("reservation.options.facility.chalet") },
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

  {
    /* from DB */
  }
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

  const activityOptions: Option[] = useMemo(
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

    setIsSubmitting(true);

    try {
      // API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log(form);
      navigate("/confirmation-message");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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
          <form onSubmit={handleSubmit}>
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
                    value={form.houseOrCamp}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        houseOrCamp: value as formType["houseOrCamp"],
                        house: undefined,
                        camp: undefined,
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
                    value={form.serviceType}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        serviceType: value as formType["serviceType"],
                        facility: undefined,
                        capacity: undefined,
                        isShared: undefined,
                        activity: undefined,
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
                {form.houseOrCamp === "house" && (
                  <Field>
                    <FieldLabel htmlFor="house">
                      {t("reservation.fields.youthHouse")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.house}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          house: value as formType["house"],
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
                {form.houseOrCamp === "camp" && (
                  <Field>
                    <FieldLabel htmlFor="camp">
                      {t("reservation.fields.camp")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.camp}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          camp: value as formType["camp"],
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

              {/* Date row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {form.dateRange?.from ? (
                          form.dateRange.to ? (
                            <>
                              {format(form.dateRange.from, "LLL dd, y")} -{" "}
                              {format(form.dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(form.dateRange.from, "LLL dd, y")
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
                        selected={form.dateRange}
                        onSelect={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            dateRange: value as formType["dateRange"],
                          }))
                        }
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
                              value={form.startTime}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  startTime: e.target.value,
                                }))
                              }
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
                              value={form.endTime}
                              onChange={(e) =>
                                setForm((prev) => ({
                                  ...prev,
                                  endTime: e.target.value,
                                }))
                              }
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
                    value={form.beneficiaries}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        beneficiaries: e.target.value,
                      }))
                    }
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
                        value={form.facility}
                        onValueChange={(value) =>
                          setForm((prev) => ({
                            ...prev,
                            facility: value as formType["facility"],
                            isShared:
                              value === "tent" || value === "room"
                                ? false
                                : undefined,
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
                      {form.facility === "room" && (
                        <Field orientation="horizontal">
                          <Checkbox
                            id="sharedRoom-checkbox"
                            name="sharedRoom"
                            checked={form.isShared}
                            onCheckedChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                isShared: value as formType["isShared"],
                              }))
                            }
                          />
                          <FieldLabel htmlFor="sharedRoom-checkbox">
                            {t("reservation.fields.sharedRoom")}
                          </FieldLabel>
                        </Field>
                      )}

                      {form.facility === "tent" && (
                        <Field orientation="horizontal">
                          <Checkbox
                            id="sharedTent-checkbox"
                            name="sharedTent"
                            checked={form.isShared}
                            onCheckedChange={(value) =>
                              setForm((prev) => ({
                                ...prev,
                                isShared: value as formType["isShared"],
                              }))
                            }
                          />
                          <FieldLabel htmlFor="sharedTent-checkbox">
                            {t("reservation.fields.sharedTent")}
                          </FieldLabel>
                        </Field>
                      )}

                      {form.facility && (
                        <Field>
                          <FieldLabel htmlFor="capacity">
                            {t("reservation.fields.capacity")}{" "}
                            <span className="text-red-500">*</span>
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

                  {/* activities type */}
                  <Field>
                    <FieldLabel htmlFor="facilityType">
                      {t("reservation.fields.facilityType")}{" "}
                      <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.activity}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          activity: value as formType["activity"],
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
                          {activityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              )}

              {/* Buttons */}
              <Field>
                <div className="flex flex-wrap items-center gap-5 mt-6">
                  <Button
                    type="submit"
                    className="flex-1 py-6 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("reservation.actions.isSubmitting")
                      : t("reservation.actions.submit")}
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

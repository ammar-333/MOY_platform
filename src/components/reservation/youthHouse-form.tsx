// src/components/reservation-form.tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { CalendarDays, Hotel, User, House, Volleyball } from "lucide-react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Clock2Icon } from "lucide-react";
import { z } from "zod";
import { Textarea } from "../ui/textarea";

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

  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
    },
    "please pick a date",
  ),
  startTime: z.string().optional(),
  endTime: z.string().optional(),

  beneficiaries: z
    .number()
    .min(1, "minumum number is 1")
    .max(50, "maximum number is 50"),

  facility: z.enum(["room", "tent", "suite", "chalet"]).optional(),
  capacity: z.enum(["normal", "double", "triple", "four", "five"]).optional(),
  isShared: z.boolean().optional(),

  membershipCheck: z.boolean().optional(),
  membershipType: z.enum(["jordanian", "arabic", "international"]).optional(),
  memberNumber: z.string().optional(),
  employeeCheck: z.boolean().optional(),
  employeeType: z.enum(["worker", "retired"]).optional(),
  employeeNumber: z.string().optional(),
  discountCheck: z.boolean().optional(),
  discountNumber: z.string().optional(),
  discountDate: z.date().optional(),

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

    beneficiaries: 0,

    facility: undefined,
    isShared: false,
    capacity: undefined,

    membershipCheck: false,
    membershipType: undefined,
    memberNumber: undefined,
    employeeCheck: false,
    employeeType: undefined,
    employeeNumber: undefined,
    discountCheck: false,
    discountNumber: undefined,
    discountDate: undefined,

    activity: undefined,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const membershipTypeOptions: Option[] = useMemo(
    () => [
      {
        value: "jordanian",
        label: t("reservation.options.membershipType.jordanian"),
      },
      {
        value: "arabic",
        label: t("reservation.options.membershipType.arabic"),
      },
      {
        value: "international",
        label: t("reservation.options.membershipType.international"),
      },
    ],
    [t],
  );

  const capacityptions: Option[] = useMemo(
    () => [
      { value: "double", label: t("reservation.options.capacity.double") },
      { value: "triple", label: t("reservation.options.capacity.triple") },
      { value: "four", label: t("reservation.options.capacity.four") },
      { value: "five", label: t("reservation.options.capacity.five") },
    ],
    [t],
  );

  const employeeTypeOptions: Option[] = useMemo(
    () => [
      {
        value: "worker",
        label: t("profile.individual.worker"),
      },
      {
        value: "retired",
        label: t("profile.individual.retired"),
      },
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
                  <User className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    {t("reservation.sections.personal")}
                  </h2>
                </div>
              </div>
              {/* user Data from API */}
              <FieldGroup>
                <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* name */}
                  <Field>
                    <FieldLabel htmlFor="name">
                      {t("profile.individual.name")}
                    </FieldLabel>
                    <Input
                      id="name"
                      value="name"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* email */}
                  <Field>
                    <FieldLabel htmlFor="email">
                      {t("profile.individual.email")}
                    </FieldLabel>
                    <Input
                      id="email"
                      value="example@gmail.com"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* phone number */}
                  <Field>
                    <FieldLabel htmlFor="phone">
                      {t("profile.individual.phone")}
                    </FieldLabel>
                    <Input
                      id="phone"
                      value="077"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* birth date */}
                  <Field>
                    <FieldLabel htmlFor="birth">
                      {t("profile.individual.birth")}
                    </FieldLabel>
                    <Input
                      id="birth"
                      value="11/03/1995"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* Social status */}
                  <Field>
                    <FieldLabel htmlFor="socialStatus">
                      {t("profile.individual.socialStatus")}
                    </FieldLabel>
                    <Input
                      id="socialStatus"
                      value="single"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* gender */}
                  <Field>
                    <FieldLabel htmlFor="gender">
                      {t("profile.individual.gender")}
                    </FieldLabel>
                    <Input
                      id="gender"
                      value="male"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* ID number */}
                  <Field>
                    <FieldLabel htmlFor="id">
                      {t("profile.individual.idNumber")}
                    </FieldLabel>
                    <Input
                      id="id"
                      value="123"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* civil number */}
                  <Field>
                    <FieldLabel htmlFor="civil">
                      {t("profile.individual.civil")}
                    </FieldLabel>
                    <Input
                      id="civil"
                      value="12312"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>
                </FieldGroup>

                <FieldGroup>
                  {/* Residence validity */}
                  <Field>
                    <FieldLabel htmlFor="residenceValidity">
                      {t("profile.individual.residenceValidity")}
                    </FieldLabel>
                    <Input
                      id="residenceValidity"
                      value="13/12/2025"
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* Residence details */}
                  <Field>
                    <FieldLabel htmlFor="ResidenceDetails">
                      {t("profile.individual.ResidenceDetails")}
                    </FieldLabel>
                    <Textarea
                      id="ResidenceDetails"
                      value=". . ."
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>

                  {/* Passport details */}
                  <Field>
                    <FieldLabel htmlFor="PassportDetails">
                      {t("profile.individual.PassportDetails")}
                    </FieldLabel>
                    <Textarea
                      id="PassportDetails"
                      value=". . ."
                      readOnly
                      className="bg-muted dark:bg-muted cursor-not-allowed"
                    />
                  </Field>
                </FieldGroup>
              </FieldGroup>

              <hr className="border-primary" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    {t("reservation.sections.booking")}
                  </h2>
                </div>
              </div>
              {/* Types */}
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
                        isShared: false,
                        activity: undefined,
                        membershipCheck: false,
                        membershipType: undefined,
                        memberNumber: undefined,
                        employeeCheck: false,
                        employeeType: undefined,
                        employeeNumber: undefined,
                        discountCheck: false,
                        discountNumber: undefined,
                        discountDate: undefined,
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
                    >
                      <SelectTrigger
                        className={cn(
                          formErrors.camp && "border-red-500",
                          "w-full",
                        )}
                      >
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
                    {formErrors.camp && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.camp}
                      </p>
                    )}
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
                        className="justify-start px-2.5 font-normal not-dark:bg-white"
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
                      className="w-auto p-0 max-h-[60vh] overflow-y-auto"
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
                        required
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
                  {formErrors.dateRange && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.dateRange}
                    </p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="duration">
                    {t("reservation.fields.durationDays")}
                  </FieldLabel>
                  <Input
                    id="duration"
                    value={String(durationDays)}
                    readOnly
                    className="bg-muted dark:bg-muted cursor-not-allowed"
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
                        beneficiaries: Number(e.target.value),
                      }))
                    }
                    required
                  />
                  {formErrors.beneficiaries && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.beneficiaries}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              {/* SECTION: Activity */}
              {showActivitySection && (
                <>
                  <hr className="border-primary" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volleyball className="h-5 w-5 text-primary" />
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

              {/* SECTION: Facility */}
              {showFacilitySection && (
                <>
                  <hr className="border-primary" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <House className="h-5 w-5 text-primary" />
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

                    <hr className="border-primary" />

                    {/* ckeckboxes */}
                    <FieldGroup>
                      {/* membership */}
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="member-checkbox"
                            name="member"
                            checked={form.membershipCheck}
                            onCheckedChange={(value) => {
                              setForm((prev) => ({
                                ...prev,
                                membershipCheck:
                                  value as formType["membershipCheck"],
                              }));
                            }}
                            className="dark:bg-slate-700"
                          />
                          <FieldLabel htmlFor="member-checkbox">
                            {t("profile.individual.membership")}
                          </FieldLabel>
                        </Field>

                        {form.membershipCheck && (
                          <FieldGroup>
                            {/* mempersip number */}
                            <Field>
                              <FieldLabel htmlFor="membership-number">
                                {t("profile.individual.membershipNumber")}
                              </FieldLabel>
                              <Input
                                id="membership-number"
                                type="number"
                                value={form.memberNumber}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    memberNumber: e.target.value,
                                  }))
                                }
                                placeholder="087712"
                                required
                              />
                            </Field>

                            {/* mempership type */}
                            <Field>
                              <FieldLabel htmlFor="membershipType">
                                {t("reservation.fields.membershipType")}{" "}
                                <span className="text-red-500">*</span>
                              </FieldLabel>
                              <Select
                                value={form.membershipType}
                                onValueChange={(value) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    membershipType:
                                      value as formType["membershipType"],
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
                                    {membershipTypeOptions.map((option) => (
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
                          </FieldGroup>
                        )}
                      </FieldGroup>

                      {/* ministry employees */}
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="employee-checkbox"
                            name="employee"
                            checked={form.employeeCheck}
                            onCheckedChange={(value) => {
                              setForm((prev) => ({
                                ...prev,
                                employeeCheck:
                                  value as formType["employeeCheck"],
                              }));
                            }}
                            className="dark:bg-slate-700"
                          />

                          <FieldLabel htmlFor="employee-checkbox">
                            {t("profile.individual.employee")}
                          </FieldLabel>
                        </Field>

                        {form.employeeCheck && (
                          <FieldGroup>
                            {/* employee number */}
                            <Field>
                              <FieldLabel htmlFor="employee-number">
                                {t("profile.individual.employeeNumber")}
                              </FieldLabel>
                              <Input
                                id="employee-number"
                                type="number"
                                value={form.employeeNumber}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    employeeNumber: e.target.value,
                                  }))
                                }
                                placeholder="676322"
                                required
                              />
                            </Field>

                            {/* employee type */}
                            <Field>
                              <FieldLabel htmlFor="employee-type">
                                {t("profile.individual.employeeType")}{" "}
                              </FieldLabel>
                              <Select
                                value={form.employeeType}
                                onValueChange={(value) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    employeeType:
                                      value as formType["employeeType"],
                                  }))
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
                                    {employeeTypeOptions.map((option) => (
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
                          </FieldGroup>
                        )}
                      </FieldGroup>

                      {/* Minister's discount */}
                      <FieldGroup>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="discount-checkbox"
                            name="employee"
                            checked={form.discountCheck}
                            onCheckedChange={(value) => {
                              setForm((prev) => ({
                                ...prev,
                                discountCheck:
                                  value as formType["discountCheck"],
                              }));
                            }}
                            className="dark:bg-slate-700"
                          />

                          <FieldLabel htmlFor="discount-checkbox">
                            {t("profile.individual.discount")}
                          </FieldLabel>
                        </Field>

                        {form.discountCheck && (
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor="discount-number">
                                {t("profile.individual.discountNumber")}
                              </FieldLabel>
                              <Input
                                id="discount-number"
                                type="number"
                                value={form.discountNumber}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    discountNumber: e.target.value,
                                  }))
                                }
                                placeholder="676322"
                                required
                              />
                            </Field>

                            <Field className="w-full md:w-1/3">
                              <FieldLabel htmlFor="discounfDate">
                                {t("reservation.fields.discountDate")}
                              </FieldLabel>
                              <Input
                                id="discounfDate"
                                type="date"
                                name="discountDate"
                                value={
                                  form.discountDate
                                    ? format(form.discountDate, "yyyy-MM-dd")
                                    : ""
                                }
                                onChange={(e) => {
                                  const selectedDate = e.target.value
                                    ? new Date(e.target.value)
                                    : undefined;
                                  setForm((prev) => ({
                                    ...prev,
                                    discountDate: selectedDate,
                                  }));
                                }}
                                required
                              />
                            </Field>
                          </FieldGroup>
                        )}
                      </FieldGroup>
                    </FieldGroup>
                  </FieldGroup>
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

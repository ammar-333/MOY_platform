import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../ui/checkbox";
import { useMemo, useState } from "react";
import { Textarea } from "../ui/textarea";
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

export default function PersonForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  const [membershipCheck, setMembershipCheck] = useState(false);
  const [employeeCheck, setEmployeeCheck] = useState(false);
  const [discountCheck, setDiscountCheck] = useState(false);
  const [employeeType, setEmployeeType] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [IdFile, setIdFile] = useState<File | null>(null);
  const [employeeIdFile, setEmployeeIdFile] = useState<File | null>(null);

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

  const handleEdit = () => {
    setEdit(true);
  };

  const handleEditFinish = () => {
    setEdit(false);
  };

  const handeleServiceBtn = () => {
    navigate("/services");
  };

  return (
    <div
      className={cn("rounded-2xl shadow-lg overflow-hidden", className)}
      {...props}
    >
      {/* HEADER */}
      <div className="flex gap-5 bg-primary text-white px-8 pt-6 pb-4">
        <div className="mx- mb-4 flex size-16 items-center justify-center rounded-full bg-white/20">
          <User className="h-10 w-10" />
        </div>

        <div className=" ">
          <h1 className="text-2xl font-bold">{t("profile.personal")}</h1>
          <p className="mt-1 text-sm opacity-90">
            {t("profile.individual.account")}
          </p>
        </div>
      </div>

      {/* FORM */}
      <Card className="rounded-none shadow-none dark:bg-slate-900">
        <CardContent className="p-6">
          <form>
            <FieldGroup>
              {/* first row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* name */}
                <Field>
                  <FieldLabel htmlFor="name">
                    {t("profile.individual.name")}
                  </FieldLabel>
                  <Input
                    id="name"
                    value="name"
                    readOnly
                    className="bg-muted cursor-not-allowed"
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
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* second row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* email */}
                <Field>
                  <FieldLabel htmlFor="email">
                    {t("profile.individual.email")}
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value=""
                    className={edit ? "dark:bg-slate-700" : ""}
                    readOnly={!edit}
                  />
                </Field>

                {/* phone number */}
                <Field>
                  <FieldLabel htmlFor="phone">
                    {t("profile.individual.phone")}
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    value=""
                    className={edit ? "dark:bg-slate-700" : ""}
                    readOnly={!edit}
                  />
                </Field>
              </FieldGroup>

              {/* 3rd row */}
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="member-checkbox"
                    name="member"
                    checked={membershipCheck}
                    onCheckedChange={(value) =>
                      setMembershipCheck(value as boolean)
                    }
                    className="dark:bg-slate-700"
                    disabled={!edit}
                  />
                  <FieldLabel htmlFor="member-checkbox">
                    {t("profile.individual.membership")}
                  </FieldLabel>
                </Field>

                {/* membership number */}
                {membershipCheck && (
                  <Field>
                    <FieldLabel htmlFor="membership-number">
                      {t("profile.individual.membershipNumber")}
                    </FieldLabel>
                    <Input
                      id="embership-number"
                      type="number"
                      required
                      className={edit ? "dark:bg-slate-700" : ""}
                      readOnly={!edit}
                    />
                  </Field>
                )}
              </FieldGroup>

              <hr className="border-border" />

              {/* 4th row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* birth date */}
                <Field>
                  <FieldLabel htmlFor="birth">
                    {t("profile.individual.birth")}
                  </FieldLabel>
                  <Input
                    id="birth"
                    value="11/03/1995"
                    readOnly
                    className="bg-muted cursor-not-allowed"
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
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* 5th row */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* gender */}
                <Field>
                  <FieldLabel htmlFor="gender">
                    {t("profile.individual.gender")}
                  </FieldLabel>
                  <Input
                    id="gender"
                    value="male"
                    readOnly
                    className="bg-muted cursor-not-allowed"
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
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* Residence details */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="ResidenceDetails">
                    {t("profile.individual.ResidenceDetails")}
                  </FieldLabel>
                  <Textarea
                    id="ResidenceDetails"
                    value=". . ."
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* Residence validity */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="residenceValidity">
                    {t("profile.individual.residenceValidity")}
                  </FieldLabel>
                  <Input
                    id="residenceValidity"
                    value="13/12/2025"
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              {/* Passport details */}
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="PassportDetails">
                    {t("profile.individual.PassportDetails")}
                  </FieldLabel>
                  <Textarea
                    id="PassportDetails"
                    value=". . ."
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

              <hr className="border-border" />

              {/* ministry employees */}
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="employee-checkbox"
                    name="employee"
                    checked={employeeCheck}
                    onCheckedChange={(value) =>
                      setEmployeeCheck(value as boolean)
                    }
                    className="dark:bg-slate-700"
                    disabled={!edit}
                  />

                  <FieldLabel htmlFor="employee-checkbox">
                    {t("profile.individual.employee")}
                  </FieldLabel>
                </Field>

                {/* membership number */}
                {employeeCheck && (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="employee-type">
                        {t("profile.individual.employeeType")}{" "}
                      </FieldLabel>
                      <Select
                        value={employeeType}
                        onValueChange={setEmployeeType}
                        dir={t("dir")}
                        disabled={!edit}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("reservation.placeholders.select")}
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

                    <Field>
                      <FieldLabel htmlFor="employee-number">
                        {t("profile.individual.employeeNumber")}
                      </FieldLabel>
                      <Input
                        id="employee-number"
                        type="number"
                        value={employeeNumber}
                        onChange={(e) => setEmployeeNumber(e.target.value)}
                        required
                        className={edit ? "dark:bg-slate-700" : ""}
                        readOnly={!edit}
                      />
                    </Field>

                    <Field>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium block">
                          {t("profile.individual.id")}
                        </span>

                        <span className="flex gap-2">
                          <Button type="button" asChild>
                            <label>
                              {t("profile.chooseFile")}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setIdFile(e.target.files?.[0] ?? null)
                                }
                                disabled={!edit}
                              />
                            </label>
                          </Button>

                          {IdFile && (
                            <p className="text-sm text-muted-foreground">
                              {IdFile.name}
                            </p>
                          )}
                        </span>
                      </label>
                    </Field>

                    <Field>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium block">
                          {t("profile.individual.ministryId")}
                        </span>

                        <span className="flex gap-2">
                          <Button type="button" asChild>
                            <label>
                              {t("profile.chooseFile")}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setEmployeeIdFile(e.target.files?.[0] ?? null)
                                }
                                disabled={!edit}
                              />
                            </label>
                          </Button>

                          {employeeIdFile && (
                            <p className="text-sm text-muted-foreground">
                              {employeeIdFile.name}
                            </p>
                          )}
                        </span>
                      </label>
                    </Field>
                  </FieldGroup>
                )}
              </FieldGroup>

              <hr className="border-border" />

              {/* Minister's discount */}
              <FieldGroup>
                <Field orientation="horizontal">
                  <Checkbox
                    id="discount-checkbox"
                    name="employee"
                    checked={discountCheck}
                    onCheckedChange={(value) =>
                      setDiscountCheck(value as boolean)
                    }
                    className="dark:bg-slate-700"
                    disabled={!edit}
                  />

                  <FieldLabel htmlFor="discount-checkbox">
                    {t("profile.individual.discount")}
                  </FieldLabel>
                </Field>

                {/* membership number */}
                {discountCheck && (
                  <FieldGroup>
                    <Field>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium block">
                          {t("profile.individual.discountFile")}
                        </span>

                        <span className="flex gap-2">
                          <Button type="button" asChild>
                            <label>
                              {t("profile.chooseFile")}
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  setIdFile(e.target.files?.[0] ?? null)
                                }
                                disabled={!edit}
                              />
                            </label>
                          </Button>

                          {IdFile && (
                            <p className="text-sm text-muted-foreground">
                              {IdFile.name}
                            </p>
                          )}
                        </span>
                      </label>
                    </Field>
                  </FieldGroup>
                )}
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
        {/* Buttons */}
        <CardFooter className="flex gap-5">
          {edit ? (
            <Button className="px-5 sm:px-10" onClick={handleEditFinish}>
              {t("profile.individual.finish")}
            </Button>
          ) : (
            <>
              <Button className="px-5 sm:px-10" onClick={handleEdit}>
                {t("profile.individual.edit")}
              </Button>
              <Button
                className="px-5 sm:px-10 bg-green-700 hover:bg-green-600"
                onClick={handeleServiceBtn}
              >
                {t("profile.individual.service")}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

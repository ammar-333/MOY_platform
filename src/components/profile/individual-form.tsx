import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";

export default function IndividualForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState("");
  const [Phone, setPhone] = useState("");

  const token = localStorage.getItem("authToken");
  useEffect(() => {
    fetch("http://10.0.82.105:1125/api/Login/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json) => {
        console.log(json);
      })
      .catch((err) => {
        console.log(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    setEdit(true);
  };

  const handeleServiceBtn = () => {
    navigate("/user/services");
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
              {/* user Data from API */}
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

              {/* birth and reg number */}
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

              {/* gender and social state */}
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

              {/* email and pass */}
              <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* email */}
                <Field>
                  <FieldLabel htmlFor="email">
                    {t("profile.individual.email")}
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("auth.emailPlaceholder")}
                    disabled={!edit}
                    required
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
                    value={Phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("auth.phoneNumberPlaceholder")}
                    disabled={!edit}
                    required
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
        {/* Buttons */}
        <CardFooter className="flex gap-5">
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
        </CardFooter>
      </Card>
    </div>
  );
}

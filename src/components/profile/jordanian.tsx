import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

export default function Jordanian() {
  const { t } = useTranslation();

  return (
    <>
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {/* name */}
        <Field>
          <FieldLabel htmlFor="name">{t("profile.individual.name")}</FieldLabel>
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
          <div dir="ltr">
            <Input
              id="phone"
              value="+962 719878548"
              readOnly
              className="bg-muted dark:bg-muted cursor-not-allowed"
            />
          </div>
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
    </>
  );
}

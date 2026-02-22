import { useTranslation } from "react-i18next";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function NonJordanian() {
  const { t } = useTranslation();

  return (
    <>
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
    </>
  );
}

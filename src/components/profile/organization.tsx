import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { Textarea } from "../ui/textarea";

export default function Organization() {
  const { t } = useTranslation();

  return (
    <>
      <FieldGroup>
        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Commercial name */}
          <Field>
            <FieldLabel htmlFor="commercial">
              {t("profile.organization.commercial")}
            </FieldLabel>
            <Input
              id="commercial"
              value=""
              readOnly
              className="bg-muted dark:bg-muted cursor-not-allowed"
            />
          </Field>

          {/* type */}
          <Field>
            <FieldLabel htmlFor="type">
              {t("profile.organization.type")}
            </FieldLabel>
            <Input
              id="type"
              value=""
              readOnly
              className="bg-muted dark:bg-muted cursor-not-allowed"
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* company capital */}
          <Field>
            <FieldLabel htmlFor="capital">
              {t("profile.organization.capital")}
            </FieldLabel>
            <Input
              id="capital"
              value=""
              readOnly
              className="bg-muted dark:bg-muted cursor-not-allowed"
            />
          </Field>

          {/* mail */}
          <Field>
            <FieldLabel htmlFor="mail">
              {t("profile.organization.mail")}
            </FieldLabel>
            <Input
              id="mail"
              value=""
              readOnly
              className="bg-muted dark:bg-muted cursor-not-allowed"
            />
          </Field>
        </FieldGroup>

        {/* signature */}
        <Field>
          <FieldLabel htmlFor="signature">
            {t("profile.organization.signature")}
          </FieldLabel>
          <Input
            id="signature"
            value=""
            readOnly
            className="bg-muted dark:bg-muted cursor-not-allowed"
          />
        </Field>

        {/* the address */}
        <Field>
          <FieldLabel htmlFor="adress">
            {t("profile.organization.title")}
          </FieldLabel>
          <Textarea
            id="adress"
            value=""
            readOnly
            className="bg-muted dark:bg-muted cursor-not-allowed"
          />
        </Field>
      </FieldGroup>
    </>
  );
}

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Textarea } from "../ui/textarea";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type dataType = {
  address: string;
  commissioner: string;
  delegation: string;
  email: string;
  name: string;
  type: string;
};

export default function BusinessForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState<dataType>();

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
        setData(json.data);
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
            {t("profile.organization.account")}
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
                {/* Commercial name */}
                <Field>
                  <FieldLabel htmlFor="commercial">
                    {t("profile.organization.commercial")}
                  </FieldLabel>
                  <Input
                    id="commercial"
                    value={data?.name}
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
                    value={data?.type}
                    readOnly
                    className="bg-muted dark:bg-muted cursor-not-allowed"
                  />
                </Field>
              </FieldGroup>

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

              {/* the title */}
              <Field>
                <FieldLabel htmlFor="title">
                  {t("profile.organization.title")}
                </FieldLabel>
                <Textarea
                  id="title"
                  value={data?.address}
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
                  value={data?.email}
                  readOnly
                  className="bg-muted dark:bg-muted cursor-not-allowed"
                />
              </Field>

              {/* signature */}
              <Field>
                <FieldLabel htmlFor="signature">
                  {t("profile.organization.signature")}
                </FieldLabel>
                <Input
                  id="signature"
                  value={data?.commissioner}
                  readOnly
                  className="bg-muted dark:bg-muted cursor-not-allowed"
                />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        {/* Buttons */}
        <CardFooter className="flex gap-5">
          <Button className="px-5 sm:px-10" onClick={handleEdit}>
            {t("profile.organization.edit")}
          </Button>
          <Button
            className="px-5 sm:px-10 bg-green-700 hover:bg-green-600"
            onClick={handeleServiceBtn}
          >
            {t("profile.organization.service")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

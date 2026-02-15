import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Message({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={cn("rounded-2xl shadow-lg overflow-hidden", className)}
      {...props}
    >
      <Card className="rounded-none shadow-none dark:bg-slate-900">
        {/* HEADER */}
        <CardHeader className="text-center px-6">
          <div className="text-white mx-auto mb-2 mt-2 flex size-18 items-center justify-center rounded-full bg-green-500">
            <CalendarDays className="h-10 w-10" />
          </div>

          <h1 className="text-2xl font-bold dark:">
            {t("confirmationMassage.title")}
          </h1>
          <p className="text-sm opacity-90">{t("confirmationMassage.desc")}</p>
        </CardHeader>

        <CardContent className="px-6 py-1">
          <div className="relative rounded-lg bg-blue-50 dark:bg-slate-800 p-4 text-blue-700 dark:text-slate-200 shadow-[3px_0_0_0_#2563eb] dark:shadow-[3px_0_0_0_#3b82f6]">
            <h3 className="mb-2 text-sm font-bold px-1 dark:text-blue-400">
              {t("confirmationMassage.nextSteps")}
            </h3>
            <ul className="list-disc space-y-1 px-5 text-sm">
              <li>{t("confirmationMassage.step1")}</li>
              <li>{t("confirmationMassage.step2")}</li>
              <li>{t("confirmationMassage.step3")}</li>
            </ul>
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex flex-wrap justify-center items-center gap-5">
          <Button
            className="px-5 sm:px-10 flex-1"
            onClick={() => navigate("/Service-Requests")}
          >
            {t("confirmationMassage.showApplications")}
          </Button>
          <Button
            className="px-5 sm:px-10 bg-green-500 hover:bg-green-400 flex-1"
            onClick={() => navigate("/services")}
          >
            {t("confirmationMassage.newReservation")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

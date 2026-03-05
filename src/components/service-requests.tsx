// src/components/service-requests.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Home,
  Hash,
  CalendarDays,
  Clock3,
  Tag,
  ClipboardList,
} from "lucide-react";

type RequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED"
  | "PENDING_PAYMENT"
  | "NOT_ATTENDED";

type ItemType = "SAMPLE" | "INVESTMENT";

type ServiceRequestItem = {
  id: string;
  type: ItemType;
  title: string;
  location: string;
  status: RequestStatus;
  requestNo?: string;
  submittedAt?: string;
  days?: number;
  fromDate?: string;
  toDate?: string;
  investmentType?: string;
  durationMonths?: number;
  proposedBudget?: number;
};

function StatusBadge({
  status,
  t,
}: {
  status: RequestStatus;
  t: (k: string) => string;
}) {
  const map: Record<RequestStatus, { label: string; cls: string }> = {
    PENDING: {
      label: t("requests.status.pending"),
      cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    APPROVED: {
      label: t("requests.status.approved"),
      cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    REJECTED: {
      label: t("requests.status.rejected"),
      cls: "bg-red-200 text-red-800 border-red-200",
    },
    CANCELED: {
      label: t("requests.status.canceled"),
      cls: "bg-slate-100 text-slate-800 border-slate-200",
    },
    PENDING_PAYMENT: {
      label: t("requests.status.pendingPayment"),
      cls: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    NOT_ATTENDED: {
      label: t("requests.status.notAttended"),
      cls: "bg-stone-300 text-stone-800 border-stone-200",
    },
  };
  const it = map[status] || map.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold",
        it.cls,
      )}
    >
      {it.label}
    </span>
  );
}

function MetaRow({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Icon className="h-4 w-4 shrink-0" />
      <div className="min-w-0 text-start">{children}</div>
    </div>
  );
}

function MiniField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="min-w-0 text-start">
        <div className="text-[11px] text-muted-foreground leading-4">
          {label}
        </div>
        <div className="text-xs font-semibold text-foreground leading-5">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function ServiceRequests({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 🔥 جلب البيانات من الترجمة مباشرة
  const samples = t("requests.samples", { returnObjects: true }) as any;
  const investmentSamples = t("requests.investmentSamples", {
    returnObjects: true,
  }) as any;

  const items: ServiceRequestItem[] = [
    // الطلبات العادية
    ...["pending", "approved", "rejected", "canceled"].flatMap((statusKey) => {
      const list = samples[statusKey as keyof typeof samples] || [];
      const statusMap: Record<string, RequestStatus> = {
        pending: "PENDING",
        approved: "APPROVED",
        rejected: "REJECTED",
        canceled: "CANCELED",
      };
      return list.map((item: any, i: number) => ({
        id: `${statusKey[0].toUpperCase()}-${i}`,
        type: "SAMPLE" as const,
        title: item.title,
        location: item.location,
        status: statusMap[statusKey],
        requestNo: `BK-202601${i + 10}-${1000 + i}`,
        submittedAt: "2026/01/20",
        days: 3,
        fromDate: "2026/01/20",
        toDate: "2026/01/23",
      }));
    }),
    // الاستثمارات
    ...investmentSamples.map((item: any) => ({
      id: item.id,
      type: "INVESTMENT" as const,
      title: item.investmentType,
      location: item.location,
      status: item.status.toUpperCase() as RequestStatus,
      investmentType: item.investmentType,
      durationMonths: item.durationMonths,
      proposedBudget: item.proposedBudget,
    })),
  ];

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-start justify-center p-4 md:p-8",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-7xl rounded-2xl overflow-hidden shadow-lg border bg-background">
        {/* HEADER */}
        <div className="bg-primary text-white w-full">
          <div className="flex items-center gap-4 px-8 py-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {t("requests.pageTitle")}
              </h1>
              <p className="mt-1 text-sm opacity-90">
                {t("requests.pageSubtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 md:p-8 space-y-4 bg-slate-100 dark:bg-slate-900">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white dark:bg-slate-800 border shadow-sm"
            >
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 text-start">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm md:text-base font-bold truncate">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} t={t} />
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">
                        {item.type}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <MetaRow icon={Home}>
                        <span className="truncate">{item.title}</span>
                      </MetaRow>
                      <MetaRow icon={MapPin}>
                        <span className="truncate">{item.location}</span>
                      </MetaRow>
                      {item.type === "SAMPLE" && item.requestNo && (
                        <MetaRow icon={Hash}>
                          <span>{t("requests.requestNo")}:</span>{" "}
                          <span className="font-semibold">
                            {item.requestNo}
                          </span>
                        </MetaRow>
                      )}
                    </div>
                  </div>

                  {item.type === "SAMPLE" && item.submittedAt && (
                    <div className="text-end ms-auto">
                      <div className="text-[11px] text-muted-foreground">
                        {t("requests.submittedAt")}
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        {item.submittedAt}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-5 border-border" />

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {item.type === "SAMPLE" ? (
                    <>
                      <MiniField
                        icon={Tag}
                        label={t("requests.serviceType")}
                        value={item.title}
                      />
                      <MiniField
                        icon={Clock3}
                        label={t("requests.days")}
                        value={`${item.days} ${t("requests.day")}`}
                      />
                      <MiniField
                        icon={CalendarDays}
                        label={t("requests.fromDate")}
                        value={item.fromDate || "-"}
                      />
                      <MiniField
                        icon={CalendarDays}
                        label={t("requests.toDate")}
                        value={item.toDate || "-"}
                      />
                    </>
                  ) : (
                    <>
                      <MiniField
                        icon={Tag}
                        label={t(
                          "reservation.investment.fields.investmentType",
                        )}
                        value={item.investmentType || "-"}
                      />
                      <MiniField
                        icon={Clock3}
                        label={t(
                          "reservation.investment.fields.investmentDuration",
                        )}
                        value={`${item.durationMonths} ${t("reservation.investment.units.months")}`}
                      />
                      <MiniField
                        icon={CalendarDays}
                        label={t(
                          "reservation.investment.fields.financialProposal",
                        )}
                        value={`${item.proposedBudget} ${t("reservation.investment.units.jod")}`}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-center">
            <Button
              type="button"
              onClick={() => navigate("/user/services")}
              className="rounded-xl px-10"
            >
              {t("requests.newRequest")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

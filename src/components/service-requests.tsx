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

type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";

type ServiceRequestItem = {
  id: string;
  title: string;
  location: string;
  requestNo: string;
  submittedAt: string;
  fromDate: string;
  toDate: string;
  days: number;
  serviceType: string;
  status: RequestStatus;
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
      cls: "bg-[#F7F0C8] text-[#7A5B00] border-[#E8DFA7]",
    },
    APPROVED: {
      label: t("requests.status.approved"),
      cls: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    REJECTED: {
      label: t("requests.status.rejected"),
      cls: "bg-rose-100 text-rose-800 border-rose-200",
    },
    CANCELED: {
      label: t("requests.status.canceled"),
      cls: "bg-slate-100 text-slate-700 border-slate-200",
    },
  };
  const it = map[status];

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
  value: string;
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

  const items: ServiceRequestItem[] = [
    {
      id: "P1",
      title: t("requests.samples.pending.0.title"),
      location: t("requests.samples.pending.0.location"),
      requestNo: "BK-20260120-1968",
      submittedAt: "2026/01/20",
      fromDate: "2026/01/20",
      toDate: "2026/01/23",
      days: 3,
      serviceType: t("requests.samples.pending.0.serviceType"),
      status: "PENDING",
    },
    {
      id: "P2",
      title: t("requests.samples.pending.1.title"),
      location: t("requests.samples.pending.1.location"),
      requestNo: "BK-20260118-1550",
      submittedAt: "2026/01/18",
      fromDate: "2026/01/19",
      toDate: "2026/01/20",
      days: 2,
      serviceType: t("requests.samples.pending.1.serviceType"),
      status: "PENDING",
    },
    {
      id: "P3",
      title: t("requests.samples.pending.2.title"),
      location: t("requests.samples.pending.2.location"),
      requestNo: "BK-20260115-1322",
      submittedAt: "2026/01/15",
      fromDate: "2026/01/25",
      toDate: "2026/01/26",
      days: 2,
      serviceType: t("requests.samples.pending.2.serviceType"),
      status: "PENDING",
    },
    {
      id: "P4",
      title: t("requests.samples.pending.3.title"),
      location: t("requests.samples.pending.3.location"),
      requestNo: "BK-20260112-1109",
      submittedAt: "2026/01/12",
      fromDate: "2026/02/01",
      toDate: "2026/02/02",
      days: 2,
      serviceType: t("requests.samples.pending.3.serviceType"),
      status: "PENDING",
    },

    {
      id: "A1",
      title: t("requests.samples.approved.0.title"),
      location: t("requests.samples.approved.0.location"),
      requestNo: "BK-20260110-1021",
      submittedAt: "2026/01/10",
      fromDate: "2026/01/15",
      toDate: "2026/01/16",
      days: 2,
      serviceType: t("requests.samples.approved.0.serviceType"),
      status: "APPROVED",
    },
    {
      id: "A2",
      title: t("requests.samples.approved.1.title"),
      location: t("requests.samples.approved.1.location"),
      requestNo: "BK-20260108-980",
      submittedAt: "2026/01/08",
      fromDate: "2026/01/11",
      toDate: "2026/01/13",
      days: 3,
      serviceType: t("requests.samples.approved.1.serviceType"),
      status: "APPROVED",
    },
    {
      id: "A3",
      title: t("requests.samples.approved.2.title"),
      location: t("requests.samples.approved.2.location"),
      requestNo: "BK-20260105-901",
      submittedAt: "2026/01/05",
      fromDate: "2026/01/07",
      toDate: "2026/01/09",
      days: 3,
      serviceType: t("requests.samples.approved.2.serviceType"),
      status: "APPROVED",
    },
    {
      id: "A4",
      title: t("requests.samples.approved.3.title"),
      location: t("requests.samples.approved.3.location"),
      requestNo: "BK-20260102-845",
      submittedAt: "2026/01/02",
      fromDate: "2026/01/20",
      toDate: "2026/01/22",
      days: 3,
      serviceType: t("requests.samples.approved.3.serviceType"),
      status: "APPROVED",
    },

    {
      id: "R1",
      title: t("requests.samples.rejected.0.title"),
      location: t("requests.samples.rejected.0.location"),
      requestNo: "BK-20251230-778",
      submittedAt: "2025/12/30",
      fromDate: "2026/01/02",
      toDate: "2026/01/04",
      days: 3,
      serviceType: t("requests.samples.rejected.0.serviceType"),
      status: "REJECTED",
    },
    {
      id: "R2",
      title: t("requests.samples.rejected.1.title"),
      location: t("requests.samples.rejected.1.location"),
      requestNo: "BK-20251225-701",
      submittedAt: "2025/12/25",
      fromDate: "2026/01/05",
      toDate: "2026/01/06",
      days: 2,
      serviceType: t("requests.samples.rejected.1.serviceType"),
      status: "REJECTED",
    },
    {
      id: "R3",
      title: t("requests.samples.rejected.2.title"),
      location: t("requests.samples.rejected.2.location"),
      requestNo: "BK-20251220-640",
      submittedAt: "2025/12/20",
      fromDate: "2026/01/10",
      toDate: "2026/01/11",
      days: 2,
      serviceType: t("requests.samples.rejected.2.serviceType"),
      status: "REJECTED",
    },
    {
      id: "R4",
      title: t("requests.samples.rejected.3.title"),
      location: t("requests.samples.rejected.3.location"),
      requestNo: "BK-20251215-590",
      submittedAt: "2025/12/15",
      fromDate: "2026/01/12",
      toDate: "2026/01/13",
      days: 2,
      serviceType: t("requests.samples.rejected.3.serviceType"),
      status: "REJECTED",
    },

    {
      id: "C1",
      title: t("requests.samples.canceled.0.title"),
      location: t("requests.samples.canceled.0.location"),
      requestNo: "BK-20251212-443",
      submittedAt: "2025/12/12",
      fromDate: "2025/12/20",
      toDate: "2025/12/21",
      days: 2,
      serviceType: t("requests.samples.canceled.0.serviceType"),
      status: "CANCELED",
    },
    {
      id: "C2",
      title: t("requests.samples.canceled.1.title"),
      location: t("requests.samples.canceled.1.location"),
      requestNo: "BK-20251210-421",
      submittedAt: "2025/12/10",
      fromDate: "2025/12/18",
      toDate: "2025/12/19",
      days: 2,
      serviceType: t("requests.samples.canceled.1.serviceType"),
      status: "CANCELED",
    },
    {
      id: "C3",
      title: t("requests.samples.canceled.2.title"),
      location: t("requests.samples.canceled.2.location"),
      requestNo: "BK-20251208-399",
      submittedAt: "2025/12/08",
      fromDate: "2025/12/15",
      toDate: "2025/12/16",
      days: 2,
      serviceType: t("requests.samples.canceled.2.serviceType"),
      status: "CANCELED",
    },
    {
      id: "C4",
      title: t("requests.samples.canceled.3.title"),
      location: t("requests.samples.canceled.3.location"),
      requestNo: "BK-20251205-365",
      submittedAt: "2025/12/05",
      fromDate: "2025/12/12",
      toDate: "2025/12/13",
      days: 2,
      serviceType: t("requests.samples.canceled.3.serviceType"),
      status: "CANCELED",
    },
  ];

  return (
    <div
      className={cn(
        "flex min-h-svh w-full items-start justify-center p-4 md:p-8 bg-[#F5F7FB]",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg border bg-background">
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
        <div className="p-4 md:p-8 space-y-4 bg-[#F5F7FB]">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl bg-white border shadow-sm">
              <div className="p-5 md:p-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 text-start">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-sm md:text-base font-bold truncate">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} t={t} />
                    </div>

                    <div className="mt-2 space-y-1">
                      <MetaRow icon={Home}>
                        <span className="truncate">{item.title}</span>
                      </MetaRow>

                      <MetaRow icon={MapPin}>
                        <span className="truncate">{item.location}</span>
                      </MetaRow>

                      <MetaRow icon={Hash}>
                        <span>{t("requests.requestNo")}:</span>
                        <span className="font-semibold">{item.requestNo}</span>
                      </MetaRow>
                    </div>
                  </div>

                  <div className="text-end ms-auto">
                    <div className="text-[11px] text-muted-foreground">
                      {t("requests.submittedAt")}
                    </div>
                    <div className="mt-1 text-sm font-semibold">
                      {item.submittedAt}
                    </div>
                  </div>
                </div>

                <hr className="my-5 border-border" />

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <MiniField
                    icon={Tag}
                    label={t("requests.serviceType")}
                    value={item.serviceType}
                  />
                  <MiniField
                    icon={Clock3}
                    label={t("requests.days")}
                    value={`${item.days} ${t("requests.day")}`}
                  />
                  <MiniField
                    icon={CalendarDays}
                    label={t("requests.fromDate")}
                    value={item.fromDate}
                  />
                  <MiniField
                    icon={CalendarDays}
                    label={t("requests.toDate")}
                    value={item.toDate}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-center">
            <Button
              type="button"
              onClick={() => navigate("/reservation")}
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

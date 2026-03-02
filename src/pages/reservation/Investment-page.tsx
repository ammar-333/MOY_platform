import InvestmentForm from "@/components/reservation/investment-form";

export default function InvestmentPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <InvestmentForm />
      </div>
    </div>
  );
}
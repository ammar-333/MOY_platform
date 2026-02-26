import BusinessForm from "@/components/profile/business-form";

export default function BusinessProfile() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-6xl">
        <BusinessForm />
      </div>
    </div>
  );
}


"use client";

import { SectionCards } from "@/components/Dahaboard/Section-cards/section-cards";
import { useMe } from "@/modules/iam/hooks/use-me";

export default function DashboardPage() {
  const me = useMe();

  const fullName = [me.data?.firstName, me.data?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 sm:p-6">
      {/* Dashboard Welcome */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Welcome,{" "}
          <span className="text-primary">
            {me.isPending ? "..." : fullName || "there"}
          </span>
        </h1>

        <p className="text-sm text-muted-foreground sm:text-base">
          Here is what’s happening in your workspace today.
        </p>
      </div>

      {/* Dashboard Content */}
      <div className="@container/main flex flex-1 flex-col gap-6">
        {/* Statistics Cards */}
        <section aria-label="Workspace statistics">
          <SectionCards />
        </section>

        {/* Future Dashboard Sections */}
        {/*
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <MessageActivity />
          <RecentConversations />
        </div>
        */}
      </div>
    </div>
  );
}

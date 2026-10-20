"use client"
import {
  Card,
  
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UsersRound,
  MessagesSquare,
  ContactRound,
  Bot,


} from "lucide-react";

const stats = [
  {
    title: "Team Members",
    value: "12",
    icon: UsersRound,
    iconClass: "bg-primary text-background",
  },
  {
    title: "Total Messages",
    value: "2,840",
    icon: MessagesSquare,
    iconClass: "bg-primary text-background",
  },
  {
    title: "Total Contacts",
    value: "1,240",
    icon: ContactRound,
    iconClass: "bg-primary text-background",
  },
  {
    title: "AI Replies",
    value: "684",
    icon: Bot,
    iconClass: "bg-primary text-background",
  },
];


export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.title}
            className="gap-0 overflow-hidden rounded-2xl border-border/70 bg-card py-0 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="gap-4 p-5">
              {/* Icon + Title + Change */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconClass}`}
                >
                  <Icon className="size-5 " strokeWidth={1.8} />
                </div>

                <CardDescription className="min-w-0 flex-1 text-sm font-medium text-foreground">
                  {stat.title}
                </CardDescription>

                
              </div>

              {/* Main Value */}
              <CardTitle className="text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">
                {stat.value}
              </CardTitle>
            </CardHeader>

            {/* Description */}
            
          </Card>
        );
      })}
    </div>
  );
}


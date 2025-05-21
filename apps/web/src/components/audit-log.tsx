"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@workspace/ui/lib/utils";
import { CalendarClock, KeyRound, ShieldAlert, UserPlus } from "lucide-react";
import type { FC } from "react";
import { RelativeTime } from "./relative-time";

type AuditLogItem = {
	id: string;
	type: string;
	actor: string;
	description: string;
	timestamp: string;
};

interface IAuditLogProps extends React.ComponentProps<"div"> {
	logs: AuditLogItem[];
}

const iconMap = {
	VARIABLE_UPDATED: <KeyRound className="h-4 w-4 text-muted-foreground" />,
	USER_INVITED: <UserPlus className="h-4 w-4 text-muted-foreground" />,
	STAGE_CREATED: <ShieldAlert className="h-4 w-4 text-muted-foreground" />,
	DEFAULT: <CalendarClock className="h-4 w-4 text-muted-foreground" />,
};

export const AuditLog: FC<IAuditLogProps> = ({ className, logs, ...props }) => {
	return (
		<Card className={cn("", className)} {...props}>
			<CardHeader>
				<CardTitle className="text-lg">Audit Log</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				<ScrollArea className="h-[300px] px-4">
					{logs.length === 0 ? (
						<div className="flex flex-col items-center justify-center space-y-2 py-12 text-center text-muted-foreground">
							<CalendarClock className="h-8 w-8 text-muted-foreground" />
							<p className="text-sm">No activity yet</p>
							<p className="max-w-xs text-xs">Changes to variables, stages, or members will show up here.</p>
						</div>
					) : (
						<ul className="space-y-4">
							{logs.map((log) => (
								<li key={log.id} className="flex items-start gap-3">
									{iconMap[log.type as keyof typeof iconMap] ?? iconMap.DEFAULT}
									<div className="flex-1">
										<p className="text-muted-foreground text-sm">
											<span className="font-medium text-foreground">{log.actor}</span> {log.description}
										</p>
										<p className="text-muted-foreground text-xs">
											<RelativeTime date={log.timestamp} />
										</p>
									</div>
								</li>
							))}
							{logs.length === 0 && <li className="text-muted-foreground text-sm">No recent activity.</li>}
						</ul>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

import type { Organization, Space } from "@prisma/client";

export interface OrganizationWithSpaces extends Organization {
	spaces: Space[];
}

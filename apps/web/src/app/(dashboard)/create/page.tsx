import { CreateOrgForm } from "@/components/forms/create-org-form";
import { CreateOrgHeader } from "@/components/create-org-header";
import type { NextPage } from "next";

const CreateOrgPage: NextPage = () => {
	return (
		<>
			<CreateOrgHeader />
			<CreateOrgForm />
		</>
	);
};

export default CreateOrgPage;

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@workspace/ui"],
	images: {
		domains: ["avatars.githubusercontent.com"],
	},
};

export default nextConfig;

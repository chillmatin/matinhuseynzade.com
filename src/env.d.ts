/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
	readonly PUBLIC_UMAMI_SCRIPT_URL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

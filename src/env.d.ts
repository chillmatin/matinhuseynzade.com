/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly THESIS_PASSWORD: string;
	readonly THESIS_SESSION_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

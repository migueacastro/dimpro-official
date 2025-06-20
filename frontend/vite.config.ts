import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { loadEnv,defineConfig } from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());

  const URL = `${env.VITE_DOMAIN ?? 'localhost'}`;

return {

  plugins: [sveltekit(), purgeCss()],
  server: {
    allowedHosts:[URL],
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    allowedHosts:[URL],
    host: "0.0.0.0",
    port: 3000,
  },
}
});

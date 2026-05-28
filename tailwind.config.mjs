/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: { extend: {
    colors: {
      canvas:'var(--canvas)', soft:'var(--soft)', ink:'var(--ink)',
      charcoal:'var(--charcoal)', body:'var(--body)', mute:'var(--mute)',
      hairline:'var(--hairline)', accent:'var(--accent)',
    },
    maxWidth: { page:'1080px', measure:'640px' },
  }},
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      zIndex: {
        n1: -1,
      },
      height: {
        '40v': '40vh',
      },
      backgroundColor: {
        'patrik-gray': '#212121',
        'patrik-blue': '#092b3f',
      },
    },
  },
  plugins: [],
};

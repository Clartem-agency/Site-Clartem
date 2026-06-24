/** @type {import('tailwindcss').Config} */
export default {
  // Fichiers où Tailwind va CHERCHER les classes utilisées.
  // -> .astro/.html/.js dans src/  ET  public/js/script.js (important : ton
  //    script.js ajoute/retire des classes Tailwind dynamiquement, il faut
  //    que Tailwind les "voie" pour ne pas les supprimer au build).
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
    './public/js/**/*.js',
  ],

  theme: {
    extend: {
      // Tes couleurs personnalisées (reprises de l'ancienne config inline).
      colors: {
        'deep-blue': '#1E3A8A',
        'clarity-blue': '#3B82F6',
        'soft-blue': '#EFF6FF',
        'warm-orange': '#F97316',
        'success-green': '#16A34A',
        'neutral-dark': '#1F2937',
        'neutral-light': '#6B7280',
        'destructive': '#DC2626',
        // Palette propre à la landing "checklist" (lead magnet) — teintes distinctes
        'cream': '#F5F0E8',
        'gris-bleu': '#94A3B8',
        'panel': '#1E293B',
        'night': '#0F172A',
        'mint': '#34D399',
      },
    },
  },

  // Filet de sécurité : ces classes sont ajoutées par script.js et pourraient
  // être absentes du HTML statique. On force Tailwind à toujours les générer.
  safelist: [
    'hidden',
    'rotate-180',
    'bg-deep-blue',
    'text-white',
  ],

  plugins: [],
};

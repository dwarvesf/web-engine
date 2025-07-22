import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1500px',
      '3xl': '1600px',
    },
    extend: {
      colors: {
        // Theme colors mapped to CSS variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          foreground: 'var(--color-primary-foreground)',
          light: 'var(--color-primary-light)',
          lightest: 'var(--color-primary-lightest)',
        },
        background: {
          DEFAULT: 'var(--color-background)',
          secondary: 'var(--color-secondary-background)',
          tertiary: 'var(--color-tertiary-background)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
          light: 'var(--color-border-light)',
        },
        input: {
          DEFAULT: 'var(--color-input)',
          hover: 'var(--color-input-hover)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
          hover: 'var(--color-card-hover)',
        },
        tag: {
          DEFAULT: 'var(--color-tag)',
          foreground: 'var(--color-tag-foreground)',
        },
        // Extended color system
        info: 'var(--color-info)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        // Gray scale system
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        },
        // Special colors
        'dusty-gray': 'var(--color-dusty-gray)',
        alto: 'var(--color-alto)',
        alabaster: 'var(--color-alabaster)',
        fedora: 'var(--color-fedora)',
        // Pink variations
        pink: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-pink-dark)',
          darker: 'var(--color-pink-darker)',
          darkest: 'var(--color-pink-darkest)',
        },
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xxs: ['var(--font-size-xxs)', { lineHeight: '1rem' }],
        xs: ['var(--font-size-xs)', { lineHeight: '1rem' }],
        sm: ['var(--font-size-sm)', { lineHeight: '1.25rem' }],
        base: ['var(--font-size-base)', { lineHeight: '1.5rem' }],
        lg: ['var(--font-size-lg)', { lineHeight: '1.75rem' }],
        xl: ['var(--font-size-xl)', { lineHeight: '1.75rem' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '2rem' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '2.25rem' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '2.5rem' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: '1' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: '1' }],
        26: ['var(--font-size-26)', { lineHeight: '1.25' }],
        40: ['var(--font-size-40)', { lineHeight: '1.125' }],
      },
      spacing: {
        'container-max': 'var(--spacing-container-max)',
        element: 'var(--spacing-element)',
        heading: 'var(--spacing-heading)',
        subheading: 'var(--spacing-subheading)',
        subsubheading: 'var(--spacing-subsubheading)',
        list: 'var(--spacing-list)',
        'list-item': 'var(--spacing-list-item)',
        header: 'var(--spacing-header)',
        paragraph: 'var(--spacing-paragraph)',
        // Extended spacing scale
        0: 'var(--spacing-0)',
        1: 'var(--spacing-1)',
        2: 'var(--spacing-2)',
        3: 'var(--spacing-3)',
        5: 'var(--spacing-5)',
        10: 'var(--spacing-10)',
        20: 'var(--spacing-20)',
        40: 'var(--spacing-40)',
        80: 'var(--spacing-80)',
        100: 'var(--spacing-100)',
        200: 'var(--spacing-200)',
        'screen-50': '50vw',
        'screen-90': '90vw',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      fontWeight: {
        regular: 'var(--font-weight-regular)',
        medium: 'var(--font-weight-medium)',
        demibold: 'var(--font-weight-demibold)',
        bold: 'var(--font-weight-bold)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      borderRadius: {
        none: 'var(--border-radius-none)',
        sm: 'var(--border-radius-sm)',
        DEFAULT: 'var(--border-radius-md)',
        md: 'var(--border-radius-md)',
        lg: 'var(--border-radius-lg)',
        xl: 'var(--border-radius-xl)',
        '2xl': 'var(--border-radius-2xl)',
        '3xl': 'var(--border-radius-3xl)',
        full: 'var(--border-radius-full)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        avatar: 'var(--shadow-avatar)',
      },
      transitionDuration: {
        fast: 'var(--transition-duration-fast)',
        normal: 'var(--transition-duration-normal)',
        slow: 'var(--transition-duration-slow)',
      },
      zIndex: {
        dropdown: 'var(--z-index-dropdown)',
        sticky: 'var(--z-index-sticky)',
        fixed: 'var(--z-index-fixed)',
        'modal-backdrop': 'var(--z-index-modal-backdrop)',
        modal: 'var(--z-index-modal)',
        popover: 'var(--z-index-popover)',
        tooltip: 'var(--z-index-tooltip)',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-foreground)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-foreground)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-foreground)',
            '--tw-prose-quote-borders': 'var(--color-primary)',
            '--tw-prose-captions': 'var(--color-muted-foreground)',
            '--tw-prose-code': 'var(--color-foreground)',
            '--tw-prose-pre-code': 'var(--color-foreground)',
            '--tw-prose-pre-bg': 'var(--color-muted)',
            '--tw-prose-th-borders': 'var(--color-border)',
            '--tw-prose-td-borders': 'var(--color-border)',
            maxWidth: 'none',
            fontFamily: 'var(--font-sans)',
            fontSize: 'inherit',
            lineHeight: 'inherit',
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              fontFamily: 'var(--font-mono)',
              fontSize: 'inherit',
              background: 'transparent',
            },
            'a:hover': { textDecoration: 'underline' },
            a: {
              textDecoration: 'none',
              fontWeight: 'inherit',
              color: 'var(--color-primary) !important',
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'var(--color-foreground)',
              fontWeight: '600',
              lineHeight: '1.24',
              padding: '0 !important',
            },
            h1: {
              fontSize: '2.25rem !important',
              margin: 'var(--spacing-heading) 0 0 !important',
            },
            h2: {
              fontSize: '1.875rem !important',
              margin:
                'var(--spacing-heading) 0 var(--spacing-heading) !important',
            },
            h3: {
              fontSize: '1.5rem !important',
              margin:
                'var(--spacing-heading) 0 var(--spacing-subheading) !important',
            },
            h4: {
              fontSize: '1.25rem !important',
              margin:
                'var(--spacing-heading) 0 var(--spacing-subheading) !important',
            },
            h5: {
              fontSize: '1.125rem !important',
              margin: 'var(--spacing-subheading) 0 0 !important',
            },
            em: {
              backgroundColor: 'rgb(248, 217, 223)',
              fontStyle: 'normal',
            },
            p: {
              marginBottom: '0',
              marginTop: 'var(--spacing-element)',
            },
            'h3 + p, h4 + p, h5 + p': {
              marginTop: 'var(--spacing-subsubheading)',
            },
            hr: {
              height: '1px',
              margin: 'var(--spacing-element) 0 !important',
              backgroundColor: 'var(--color-border)',
            },
            'ul, ol': {
              margin: '0',
              marginTop: 'var(--spacing-list)',
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: 'calc(var(--spacing-list) / 2)',
            },
            blockquote: {
              fontWeight: 'inherit',
              color: 'inherit',
              fontStyle: 'inherit',
              borderLeft: 'revert-layer',
              quotes: 'none',
            },
            'blockquote > *:first-child': {
              marginTop: '0 !important',
            },

            'blockquote > *::before': {
              content: 'none',
            },
            'blockquote > *::after': {
              content: 'none',
            },
            img: {
              maxWidth: '100%',
              borderRadius: '5px',
              margin: '0 auto',
              maxHeight: '500px',
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              border: 'none',
              marginTop: 'var(--spacing-element)',
            },
            '*:first-child': {
              marginTop: '0 !important',
            },
            'th, td': {
              padding: '10px 12px !important',
              textAlign: 'left',
              borderBottom: '1px solid var(--color-border)',
            },
            'thead th': {
              fontWeight: '500',
              backgroundColor: 'var(--color-secondary)',
            },
            a: {
              color: 'var(--color-foreground)',
              textDecoration: 'underline',
              '&:hover': {
                color: 'var(--color-primary)',
              },
            },
          },
        },
      }),
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'dwarves-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'dwarves-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'dwarves-skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.1s ease-in-out forwards',
        slideUp: 'slideUp 0.15s ease-out',
        'dwarves-spin': 'dwarves-spin 1s linear infinite',
        'dwarves-fade-in': 'dwarves-fade-in 0.5s ease-in-out',
        'dwarves-skeleton': 'dwarves-skeleton-loading 1.5s infinite',
      },
    },
  },
  plugins: [
    typography,
    plugin(({ addVariant, addUtilities }) => {
      addVariant('reading', 'html[data-reading-mode="true"] &');
      // This variant applies styles only when the element is NOT directly within a prose container.
      // This is a more specific selector to avoid false positives.
      addVariant('not-prose-ancestor', '&:not(:where(.article-content *))');
      // A more general (but potentially less precise) approach could be:
      // addVariant('is-not-prose-child', '.prose :not(&)'); // This is not what we want.
      // A common approach seen in discussions for "not affected by prose" is:
      addVariant('prose-unaffected', '&:not(:where([class~="not-prose"] *))'); // This still works only inside prose where not-prose is active.

      // Add custom utilities
      addUtilities({
        '.translate-center': {
          transform: 'translate(-50%, -50%)',
        },
        '.translate-x-center': {
          transform: 'translateX(-50%)',
        },
        '.translate-y-center': {
          transform: 'translateY(-50%)',
        },
        '.grayscale-1': {
          filter: 'grayscale(1)',
        },
        '.grayscale-0': {
          filter: 'grayscale(0)',
        },
        '.rotate-90': {
          transform: 'rotate(90deg)',
        },
        '.rotate-0': {
          transform: 'rotate(0deg)',
        },
        '.full-width': {
          width: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          'margin-left': '-50vw',
          'margin-right': '-50vw',
        },
        '.overflow-x-hidden': {
          'overflow-x': 'hidden',
        },
        '.overflow-y-hidden': {
          'overflow-y': 'hidden',
        },
        '.link-reset': {
          'text-decoration': 'none',
          color: 'inherit',
        },
        '.link-reset:hover': {
          'text-decoration': 'none',
          color: 'inherit',
        },
        '.font-display-fallback': {
          'font-display': 'fallback',
        },
        '.aspect-ratio-16-9': {
          'aspect-ratio': '16 / 9',
        },
        '.aspect-ratio-4-3': {
          'aspect-ratio': '4 / 3',
        },
        '.aspect-ratio-1-1': {
          'aspect-ratio': '1 / 1',
        },
        '.with-triangle': {
          position: 'relative',
        },
        '.with-triangle::before': {
          content: '""',
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          'border-left': '8px solid transparent',
          'border-right': '8px solid transparent',
          'border-top': '8px solid currentColor',
        },
      });
    }),
  ],
};

export default config;

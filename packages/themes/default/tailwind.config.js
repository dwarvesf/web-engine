import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['var(--font-size-xs)', { lineHeight: '1rem' }],
        sm: ['var(--font-size-sm)', { lineHeight: '1.25rem' }],
        base: ['var(--font-size-base)', { lineHeight: '1.5rem' }],
        lg: ['var(--font-size-lg)', { lineHeight: '1.75rem' }],
        xl: ['var(--font-size-xl)', { lineHeight: '1.75rem' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: '2rem' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: '2.25rem' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: '2.5rem' }],
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
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-foreground)',
            '--tw-prose-headings': 'var(--color-foreground)',
            '--tw-prose-lead': 'var(--color-muted-foreground)',
            '--tw-prose-links': 'var(--color-primary)',
            '--tw-prose-bold': 'var(--color-foreground)',
            '--tw-prose-counters': 'var(--color-muted-foreground)',
            '--tw-prose-bullets': 'var(--color-muted-foreground)',
            '--tw-prose-hr': 'var(--color-border)',
            '--tw-prose-quotes': 'var(--color-foreground)',
            '--tw-prose-quote-borders': 'var(--color-border)',
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
              fontSize: 'inherit !important',
              background: 'transparent !important',
            },
            'a:hover': { textDecoration: 'underline' },
            a: {
              textDecoration: 'none',
              color: 'var(--color-primary)',
              fontWeight: 'inherit',
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
              margin: 'var(--spacing-heading) 0 0 !important',
            },
            h3: {
              fontSize: '1.5rem !important',
              margin: 'var(--spacing-subheading) 0 0 !important',
            },
            h4: {
              fontSize: '1.25rem !important',
              margin: 'var(--spacing-subheading) 0 0 !important',
            },
            h5: {
              fontSize: '1.125rem !important',
              margin: 'var(--spacing-subheading) 0 0 !important',
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
              padding: '0 0 0 2rem',
              marginTop: 'var(--spacing-list)',
            },
            'ul ul, ul ol, ol ul, ol ol': {
              marginTop: 'calc(var(--spacing-list) / 2)',
            },
            blockquote: {
              margin: 0,
              borderLeft: 'none',
              fontWeight: 'inherit',
              color: 'inherit',
              fontStyle: 'inherit',
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
              marginTop: 'var(--spacing-element)',
            },
            'th, td': {
              padding: '10px 12px',
              textAlign: 'left',
              border: '1px solid var(--color-border)',
            },
            'thead th': {
              fontWeight: '500',
              backgroundColor: 'var(--color-secondary)',
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
      },
      animation: {
        fadeIn: 'fadeIn 0.1s ease-in-out forwards',
        slideUp: 'slideUp 0.15s ease-out',
      },
    },
  },
  plugins: [
    typography,
    plugin(({ addVariant }) => {
      addVariant('reading', 'html[data-reading-mode="true"] &');
    }),
  ],
};

export default config;

# Default App Theme

The default theme for Dwarves Foundation websites, featuring a modern and professional design with full TypeScript support and TailwindCSS integration.

## Features

- 🎨 **Modern Design**: Clean, professional aesthetics
- 📱 **Responsive**: Mobile-first approach with responsive components
- 🌙 **Dark Mode**: Built-in dark mode support
- ⚛️ **Atomic Design**: Components organized by atomic design principles
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 🎨 **TailwindCSS**: Utility-first CSS framework integration
- ✨ **Animations**: Smooth transitions and hover effects

## Installation

This theme is automatically included with the Website Engine. To use it:

1. Set the theme in your `site.json`:

```json
{
  "theme": "default"
}
```

2. The theme will be automatically loaded and applied.

## Customization

### Colors

The theme uses CSS custom properties for easy customization:

```css
:root {
  --primary: #e13f5e;
  --primary-hover: #c73650;
  --background: #ffffff;
  --foreground: #171717;
  /* ... more variables */
}
```

### Tailwind Configuration

The theme includes its own Tailwind configuration that extends the base configuration with theme-specific utilities and colors.

### Component Overrides

To override theme components, create your own components with the same name in your project structure.

## Development

### Building the Theme

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## License

MIT - See LICENSE file for details.

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

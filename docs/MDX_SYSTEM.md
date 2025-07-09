# MDX System Documentation

The global MDX render component system provides a unified way to consume theme components and render MDX content according to the site.json configuration.

## Architecture

### Core Components

1. **MDXProvider** - Global context provider that loads theme components
2. **MDXRenderer** - Renders MDX content with theme components
3. **MDXContent** - Wrapper for MDX content with frontmatter support
4. **withMDX** - Higher-order component for easy MDX integration

### Theme Integration

The system automatically:
- Loads components from the current theme (configured in site.json)
- Maps HTML elements to theme components
- Provides site configuration to components
- Handles component fallbacks

## Usage Examples

### Basic MDX Template

```mdx
---
template: home-template
title: "Welcome to Our Site"
description: "Built with the websites engine"
---

<!-- Components are automatically available -->
<Hero
  title={frontmatter.title}
  description={frontmatter.description}
  ctaText="Get Started"
  ctaLink="/contact"
/>

<section className="py-16 bg-background">
  <div className="max-w-6xl mx-auto px-4">
    <ServiceCard
      icon="code"
      title="Web Development"
      description="Full-stack web applications"
      href="/services/web"
    />
  </div>
</section>
```

### React Page with MDX

```tsx
import { MDXContent, useMDXContext } from '@wse/global/mdx';

export default function MyPage({ frontmatter }) {
  const { components } = useMDXContext();
  const { Hero, ServiceCard } = components;
  
  return (
    <MDXContent frontmatter={frontmatter} template="home-template">
      <Hero title="Dynamic Title" />
      <ServiceCard icon="code" title="Service" />
    </MDXContent>
  );
}
```

### Using withMDX HOC

```tsx
import { withMDX } from '@wse/global/mdx';

function MyComponent() {
  return (
    <div>
      <h1>My Component</h1>
      <p>This will be wrapped with MDX context</p>
    </div>
  );
}

export default withMDX(MyComponent, {
  template: 'custom-template',
  components: {
    // Custom component overrides
  }
});
```

## Site Configuration Integration

The system automatically integrates with site.json configuration:

### Theme Selection

```json
{
  "theme": "default",
  "site": {
    "title": "My Site",
    "description": "Site description"
  }
}
```

### Navigation Configuration

```json
{
  "navigation": {
    "tabs": [
      {
        "tab": "Home",
        "href": "/"
      },
      {
        "tab": "About",
        "href": "/about",
        "groups": [
          {
            "group": "Company",
            "pages": [
              ["Team", "/team"],
              ["Careers", "/careers"]
            ]
          }
        ]
      }
    ]
  }
}
```

### Footer Configuration

```json
{
  "footer": {
    "global": {
      "text": "© 2024 My Company",
      "email": "contact@example.com",
      "socials": {
        "twitter": "https://twitter.com/example",
        "github": ["https://github.com/example", "github"],
        "linkedin": ["https://linkedin.com/company/example", "linkedin", "LinkedIn"]
      }
    },
    "sections": [
      {
        "title": "Products",
        "tabs": [
          {
            "tab": "Product A",
            "href": "/product-a"
          }
        ]
      }
    ]
  }
}
```

## Component Mapping

The system automatically maps HTML elements to theme components:

- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` → `Heading`
- `p` → `Paragraph`
- `a` → `Link`
- `img` → `Image`
- `pre` → `CodeBlock`
- `code` → `InlineCode`
- `table` → `Table`
- And more...

## Available Components

### Atoms
- `Logo` - Site logo with text and image support
- `Button` - Flexible button with variants
- `Input` - Form input with validation
- `Icon` - SVG icon system
- `Tag` - Small labels and badges

### Molecules
- `ServiceCard` - Service showcase cards
- `WorkCard` - Portfolio cards
- `NavigationItem` - Navigation menu items
- `ClientLogo` - Client logo display
- `SocialLink` - Social media links

### Organisms
- `Hero` - Hero sections
- `Navigation` - Complete navigation
- `Footer` - Footer sections
- `ClientShowcase` - Client showcase

## Frontmatter Support

All MDX templates support frontmatter:

```mdx
---
template: work-template
title: "Project Title"
description: "Project description"
image: "/images/hero.jpg"
category: "Web Development"
tags: ["React", "Next.js"]
date: "2024-01-15"
---

<Hero
  title={frontmatter.title}
  description={frontmatter.description}
  backgroundImage={frontmatter.image}
/>
```

## Error Handling

The system includes comprehensive error handling:

- Graceful fallbacks for missing components
- Console warnings for development
- Loading states during component loading
- Theme switching support

## Development Tips

1. **Theme Development**: Components are automatically loaded from the current theme
2. **Hot Reloading**: Changes to components are reflected immediately
3. **Type Safety**: All components include TypeScript interfaces
4. **Testing**: Use the example page to test component integration
5. **Debugging**: Check browser console for component loading errors

## Performance

- Components are loaded asynchronously
- Theme switching is supported without page reload
- Minimal bundle size impact
- Cached component loading

## Migration Guide

To migrate existing MDX files:

1. Remove explicit component imports
2. Add frontmatter with template information
3. Update component usage to use props instead of direct imports
4. Test with the new MDX system

## Troubleshooting

### Common Issues

1. **Component not found**: Check theme component exports
2. **Styling issues**: Verify theme CSS is loaded
3. **Configuration errors**: Validate site.json structure
4. **Performance issues**: Check for circular dependencies

### Debug Tools

- Use `useMDXContext()` to inspect loaded components
- Check browser console for loading errors
- Verify site configuration with `getSiteConfig()`

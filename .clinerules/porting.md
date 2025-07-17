# Code Porting Requirements

## Core Requirements
* **Source-specific porting**: Port exclusively from the designated source folder/directory in the React JS project
  * **Input folder**: `[SPECIFY SOURCE FOLDER PATH HERE]`
* **No assumptions**: Do not make assumptions about functionality, dependencies, or implementation details
* **Complete feature preservation**: Clone all components and features exactly from the source without removing or modifying any functionality
* **Pre-porting analysis**: Thoroughly scan and analyze the target project's architecture, coding patterns, and syntax conventions before beginning the porting process
* **Alignment consistency**: Ensure all ported components and features maintain consistency with existing project standards and patterns
* **Output**: The output should put under `[SPECIFY SOURCE FOLDER PATH HERE]`

## Project-Specific Requirements

### Two-Package Architecture
* **MDX Consumer Package**: Handle MDX file processing, parsing, and integration with Next.js SSG
* **Themes Package**: Contain all UI components, styling systems, and rendering features
* **Cross-package alignment**: Ensure seamless integration between MDX consumer and themes packages

### Content & Component Alignment
* **Content porting**: Extract and convert React content/data structures to MDX-compatible format
* **Component porting**: Migrate React components to work with MDX rendering pipeline
* **Bidirectional compatibility**: Ensure ported content can be properly rendered by ported components
* **Styling preservation**: Maintain visual consistency between source React components and target MDX components

## Additional Requirements to Consider

### Documentation & Analysis
* Document the source React project structure and component hierarchy
* Map React components to their MDX equivalents
* Create a compatibility matrix between React patterns and MDX/Next.js SSG patterns
* Identify potential breaking changes or conflicts with existing codebase

### Dependency Management
* Audit all external dependencies and their versions
* Ensure dependency compatibility with Next.js SSG and MDX ecosystem
* Update package manifests for both MDX consumer and themes packages
* **Consider package upgrades**: Evaluate opportunities to upgrade outdated packages to newer versions, especially MDX-related dependencies and Next.js-compatible libraries

### MDX-Specific Considerations
* Ensure React components are compatible with MDX rendering context
* Handle MDX frontmatter and metadata extraction
* Maintain component props and API consistency between React and MDX environments
* Preserve interactive functionality within static generation constraints

### Next.js SSG Integration
* Ensure proper build-time processing of MDX files
* Maintain performance characteristics for static generation
* Handle dynamic imports and code splitting appropriately
* Preserve SEO and metadata handling

### Code Quality & Standards
* Maintain the original code's performance characteristics
* Ensure ported code follows Next.js and MDX best practices
* Preserve original comments and documentation, adapting format as needed
* Follow package-specific coding standards for both MDX consumer and themes packages
* **Always check linting and formatting**: Run linting and formatting checks after each porting step to ensure code quality and consistency

### Version Control & Tracking
* Maintain clear commit history showing what was ported from where
* Tag or branch appropriately to track porting progress for both packages
* Document any necessary adaptations or modifications made during porting
* Track content-component alignment changes
* 
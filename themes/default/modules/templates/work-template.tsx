import { WorkCard } from '../../components';
import { TemplateRenderArgs } from '../../types/theme';

export default function WorkTemplate(props: TemplateRenderArgs) {
  const { frontmatter, children } = props;
  return (
    <>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-primary mb-2 text-sm font-medium tracking-wider uppercase">
                Client
              </h3>
              <p className="text-foreground font-semibold">
                {frontmatter!.client}
              </p>
            </div>
            <div>
              <h3 className="text-primary mb-2 text-sm font-medium tracking-wider uppercase">
                Date
              </h3>
              <p className="text-foreground font-semibold">
                {new Date(frontmatter!.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-primary mb-2 text-sm font-medium tracking-wider uppercase">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontmatter?.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-tag text-tag-foreground rounded px-2 py-1 text-xs"
                  >
                    {typeof tag === 'string' ? tag : tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2>Project Overview</h2>
            <p>
              Describe the project goals, challenges, and approach. This
              template provides a structured layout for showcasing work projects
              with consistent styling and components.
            </p>

            <h2>Key Features</h2>
            <ul>
              <li>Feature 1: Description of the first key feature</li>
              <li>Feature 2: Description of the second key feature</li>
              <li>Feature 3: Description of the third key feature</li>
            </ul>

            <h2>Technical Implementation</h2>
            <p>
              Detail the technical aspects, architecture decisions, and
              implementation details.
            </p>

            <h2>Results & Impact</h2>
            <p>
              Highlight the outcomes, metrics, and business impact of the
              project.
            </p>
          </div>
        </div>
      </section>

      {children}

      <section className="bg-secondary-background py-16">
        <div className="mx-auto">
          <h2 className="text-foreground mb-12 text-center text-3xl font-bold">
            Related Work
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <WorkCard
              title="Project Alpha"
              description="Brief description of related project"
              image="/images/work/project-alpha.jpg"
              category="Web Development"
              tags={['React', 'Node.js']}
              href="/work/project-alpha"
            />
            <WorkCard
              title="Project Beta"
              description="Brief description of related project"
              image="/images/work/project-beta.jpg"
              category="Mobile App"
              tags={['React Native', 'TypeScript']}
              href="/work/project-beta"
            />
            <WorkCard
              title="Project Gamma"
              description="Brief description of related project"
              image="/images/work/project-gamma.jpg"
              category="Design System"
              tags={['Figma', 'Storybook']}
              href="/work/project-gamma"
            />
          </div>
        </div>
      </section>
    </>
  );
}

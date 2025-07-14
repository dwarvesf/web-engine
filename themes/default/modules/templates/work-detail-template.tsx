import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import { Center, H3, HStack, Image, Paragraph, Stack } from '../../components';
import { ReactNode } from 'react';

interface ProjectMetadata {
  industry?: string;
  location?: string;
  solution?: string;
  outcome?: string;
  client?: string;
  year?: string;
  duration?: string;
  team?: string;
}

interface TechnologyStack {
  category: string;
  technologies: string[];
}

interface ProjectSection {
  title: string;
  content: string;
  images?: string[];
  points?: string[];
  quote?: {
    text: string;
    author?: string;
    role?: string;
  };
}

interface RelatedProject {
  title: string;
  href: string;
  direction: 'previous' | 'next';
}

interface WorkDetailTemplateProps extends TemplateRenderArgs {
  projectTitle?: string;
  heroImage?: string;
  description?: string;
  metadata?: ProjectMetadata;
  sections?: ProjectSection[];
  techStack?: TechnologyStack[];
  relatedProjects?: RelatedProject[];
}

export default function WorkDetailTemplate(props: WorkDetailTemplateProps) {
  const { children, siteConfig, frontmatter, mdxRenderer } = props;

  // Extract data from frontmatter
  const projectTitle = frontmatter?.title;
  const heroImage = frontmatter?.['hero-image'];
  const description = frontmatter?.description;
  const metadata = frontmatter?.metadata;
  const heroMdxContent = frontmatter?.['hero-mdx-content'];

  return (
    <Layout
      siteConfig={siteConfig}
      headerProps={{
        className:
          'px-[calc(50dvw-(var(--spacing-container-max))/2+0.5rem)] w-full',
      }}
      footerProps={{ className: 'dwarves-container w-full' }}
      contentClassName="dwarves-container"
    >
      {/* Hero Section */}
      <Stack gap="3xl">
        <Center className="mx-auto max-w-[700px] flex-col">
          <H3>{projectTitle}</H3>
          <Paragraph className="mt-2 text-center">{description}</Paragraph>
          <Image src={heroImage} alt={projectTitle || ''} className="mt-4" />
        </Center>
        {metadata && (
          <HStack equal={false} className="mx-auto max-w-[950px] gap-12">
            <Stack className="basis-[18%]">
              {Object.entries(metadata).map(([key, value]) => (
                <Stack key={key} className="gap-1">
                  <strong className="text-sm font-semibold capitalize">
                    {key}
                  </strong>
                  <Paragraph className="text-sm">
                    {value as ReactNode}
                  </Paragraph>
                </Stack>
              ))}
            </Stack>
            <Stack className="flex-1">{mdxRenderer?.(heroMdxContent)}</Stack>
          </HStack>
        )}
      </Stack>
      {/* Main Content (MDX content) */}
      <div className="mx-auto max-w-[700px] flex-1 py-12">{children}</div>
    </Layout>
  );
}

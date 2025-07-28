import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import {
  Button,
  Center,
  HStack,
  Image,
  Paragraph,
  Stack,
} from '../../components';
import { ReactNode } from 'react';
import { cn } from '../../utils';

interface ProjectMetadata {
  industry?: string;
  location?: string;
  solution?: string;
  outcome?: string;
  client?: string;
}

interface WorkDetailTemplateProps extends TemplateRenderArgs {
  projectTitle?: string;
  heroImage?: string;
  description?: string;
  metadata?: ProjectMetadata;
}

export default function WorkDetailTemplate(props: WorkDetailTemplateProps) {
  const { children, siteConfig, frontmatter, mdxRenderer } = props;

  // Extract data from frontmatter
  const projectTitle = frontmatter?.title;
  const heroImage = frontmatter?.['hero-image'];
  const description = frontmatter?.description;
  const metadata = frontmatter?.metadata;
  const heroMdxContent = frontmatter?.['hero-mdx-content'];
  const links = frontmatter?.links;

  return (
    <Layout siteConfig={siteConfig} contentClassName={cn('dwarves-container')}>
      {/* Hero Section */}
      <Stack gap="3xl" className="mb-20">
        <Center
          className="mx-auto w-full max-w-[700px] flex-col pt-14"
          gap="none"
        >
          <h1 className="mt-3 text-center text-4xl font-semibold">
            {projectTitle}
          </h1>
          <Paragraph className="!mt-2 text-center">{description}</Paragraph>
          <div className="relative mt-12 h-0 w-full pb-[54%] leading-0">
            <Image
              src={heroImage}
              alt={projectTitle || ''}
              containerClassName="absolute inset-0"
            />
          </div>
        </Center>
        {metadata && (
          <HStack
            equal={false}
            className="mx-auto max-w-[950px] items-start gap-12"
          >
            <Stack className="basis-[18%]" gap="lg">
              {Object.entries(metadata).map(([key, value]) => (
                <Stack key={key} className="gap-1">
                  <strong className="text-sm font-semibold capitalize">
                    {key.replace(/-/g, ' ')}:
                  </strong>
                  <Paragraph className="!mt-0 text-sm">
                    {value as ReactNode}
                  </Paragraph>
                </Stack>
              ))}
            </Stack>
            <Stack className="work-summary flex-1 gap-0 text-lg">
              {mdxRenderer?.(heroMdxContent)}
            </Stack>
          </HStack>
        )}
      </Stack>
      {/* Main Content (MDX content) */}
      <div className="article-content">
        <div className="mx-auto max-w-[700px] flex-1 py-12 font-serif">
          {children}
        </div>
      </div>

      {/* Navigation Links */}
      {links && (
        <HStack className="mx-auto max-w-[700px] justify-between pt-16 pb-20">
          {links.previous && (
            <Button
              variant="link"
              href={links.previous.url}
              className="!text-primary w-auto flex-none self-start px-0 !font-normal !underline"
            >
              ← {links.previous.title}
            </Button>
          )}
          {links.next && (
            <Button
              variant="link"
              href={links.next.url}
              className="!text-primary w-auto flex-none self-end px-0 !font-normal !underline"
            >
              {links.next.title} →
            </Button>
          )}
        </HStack>
      )}
    </Layout>
  );
}

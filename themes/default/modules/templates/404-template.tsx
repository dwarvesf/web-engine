import React from 'react';
import Layout from '../partials/layout';
import { TemplateRenderArgs } from '../../types/theme';
import NotFoundHeroIcon from '../../components/ui/404-hero';
import { Button, H2 } from '../../components';

function renderHeroImg(imgSrc: string | undefined) {
  if (!imgSrc) {
    return <NotFoundHeroIcon className="mx-auto block" />;
  }
  return (
    <img
      src={imgSrc}
      alt="404 Not Found"
      className="mx-auto block h-auto w-full max-w-[400px]"
    />
  );
}

const NotFound: React.FC<Pick<TemplateRenderArgs, 'siteConfig'>> = ({
  siteConfig,
}) => {
  const notFoundConfig = siteConfig?.['404'];
  return (
    <Layout siteConfig={siteConfig}>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {renderHeroImg(notFoundConfig?.image)}
        <H2>{notFoundConfig?.description || 'Page Not Found'}</H2>
        <div className="flex flex-row gap-4">
          {notFoundConfig?.buttons?.map((button, index) => (
            <Button
              key={index}
              variant={button.type}
              href={button.href}
              target={button.href.startsWith('http') ? '_blank' : undefined}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

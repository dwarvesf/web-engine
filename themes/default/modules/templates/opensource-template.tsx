import { TemplateRenderArgs } from '../../types/theme';
import { Footer, Header } from '../partials';

export default function OpensourceTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig } = props;

  return (
    <main className="dynamic-min-h-screen flex flex-col">
      <div className="border-box mx-auto flex w-full max-w-[1248px] flex-1 flex-grow flex-col px-2">
        <Header
          header={siteConfig?.header}
          navigation={siteConfig?.header?.['opensource-navigation']}
        />
        <div className="flex-grow py-2">{children}</div>
        <Footer footer={siteConfig?.footer} />
      </div>
    </main>
  );
}

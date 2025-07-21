import React, { useState, useMemo } from 'react';
import Section from './section';
import { cn } from '../utils';

interface IconData {
  type: 'class' | 'svg' | 'img';
  value: string; // class name, SVG string, or image URL
  style?: React.CSSProperties; // for inline styles like font-size
  alt?: string; // for img type
  viewBox?: string; // for svg type
  width?: string; // for svg type
  height?: string; // for svg type
}

interface Tab {
  id: string;
  title: string;
  icon: IconData;
}

interface ProjectLogo {
  url?: string; // image URL
  backgroundColor?: string; // for initial type
}

interface Project {
  name: string;
  description: string;
  href: string;
  logo?: ProjectLogo;
  category?: string[];
}

interface OpensourceProjectsData {
  tabs: Tab[];
  projects: Project[];
}

interface Props {
  data: OpensourceProjectsData;
}

export default function OpensourceProjects({ data }: Props) {
  const [activeTab, setActiveTab] = useState(data.tabs[0]?.id);

  const filteredProjects = useMemo(() => {
    if (activeTab === 'react-tabs-0') {
      return data.projects;
    } else {
      const selectedTab = data.tabs.find(tab => tab.id === activeTab);
      if (selectedTab) {
        const category = selectedTab.title;
        return data.projects.filter(project =>
          project.category?.includes(category),
        );
      }
    }
    return [];
  }, [activeTab, data.projects, data.tabs]);

  const renderIcon = (icon: IconData) => {
    if (icon.type === 'class') {
      return <i className={icon.value} style={icon.style}></i>;
    } else if (icon.type === 'svg') {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: icon.value }}
          style={{ width: icon.width, height: icon.height }}
        />
      );
    } else if (icon.type === 'img') {
      return (
        <img
          src={icon.value}
          alt={icon.alt}
          className="block h-10 w-10 flex-none rounded"
        />
      );
    }
    return null;
  };

  const renderLogo = (project: Project) => {
    const url = project.logo?.url;
    const backgroundColor = project.logo?.backgroundColor;
    const initial = project.name.charAt(0).toUpperCase();

    if (url) {
      return (
        <img
          src={url}
          alt={`${project.name}'s logo`}
          className="block h-10 w-10 flex-none rounded"
        />
      );
    } else {
      return (
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded text-2xl font-bold text-white uppercase"
          aria-label={`${initial}'s logo`}
          style={{ backgroundColor: backgroundColor }}
        >
          {initial}
        </div>
      );
    }
  };

  return (
    <Section size="xs">
      <div className="mt-2" data-tabs="true">
        <ul
          className="border-border flex overflow-x-auto border-b border-solid whitespace-nowrap"
          role="tablist"
        >
          {data.tabs.map(tab => (
            <li
              key={tab.id}
              className={cn(
                'whitespace-no-wrap mr-9 inline-flex cursor-pointer items-center border-b-2 border-solid border-transparent py-3 focus:outline-none md:mr-18',
                {
                  'border-b-black': activeTab === tab.id,
                  'border-transparent grayscale': activeTab !== tab.id,
                },
              )}
              role="tab"
              id={tab.id}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
            >
              {renderIcon(tab.icon)}
              <span className="ml-3">{tab.title}</span>
            </li>
          ))}
        </ul>
        {data.tabs.map(tab => (
          <div
            key={`panel-${tab.id}`}
            className={`react-tabs__tab-panel ${activeTab === tab.id ? 'react-tabs__tab-panel--selected' : ''}`}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={tab.id}
          >
            {activeTab === tab.id && (
              <ul className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map(project => (
                  <li key={project.name}>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-reset block"
                    >
                      <div className="flex">
                        {renderLogo(project)}
                        <p className="ml-4">
                          <strong className="font-bold">{project.name}</strong>{' '}
                          {project.description}
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import Button from '../../components/ui/button';
import Card from '../../components/card';

interface Service {
  title: string;
  description: string;
  features: string[];
  icon?: React.ReactNode;
  href?: string;
  price?: string;
  popular?: boolean;
}

interface Process {
  title: string;
  description: string;
  step: number;
  icon?: React.ReactNode;
}

interface ServicesTemplateProps extends TemplateRenderArgs {
  services?: Service[];
  process?: Process[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
    avatar?: string;
  };
}

export default function ServicesTemplate(props: ServicesTemplateProps) {
  const { children, siteConfig, frontmatter, services, process, testimonial } =
    props;

  // Extract data from frontmatter
  const servicesData = frontmatter?.services || services;
  const processData = frontmatter?.process || process;
  const testimonialData = frontmatter?.testimonial || testimonial;

  return (
    <Layout siteConfig={siteConfig}>
      {/* Services Grid */}
      {servicesData && (
        <section className="bg-background py-20">
          <div className="dwarves-container">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {servicesData.map((service, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  hover
                  className="dwarves-fade-in relative"
                  icon={service.icon}
                  title={service.title}
                  badge={
                    service.popular ? (
                      <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-medium">
                        Popular
                      </span>
                    ) : undefined
                  }
                >
                  <div className="space-y-4">
                    <p className="text-muted-foreground dwarves-body">
                      {service.description}
                    </p>

                    {service.features && (
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center gap-2 text-sm"
                          >
                            <svg
                              className="text-primary h-4 w-4 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      {service.price && (
                        <div className="text-primary text-2xl font-bold">
                          {service.price}
                        </div>
                      )}

                      {service.href && (
                        <Button
                          variant="primary"
                          href={service.href}
                          className="ml-auto"
                        >
                          Learn More
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {processData && (
        <section className="bg-secondary/20 py-20">
          <div className="dwarves-container">
            <div className="mb-16 text-center">
              <h2 className="text-foreground dwarves-heading mb-4 text-3xl font-bold">
                Our Process
              </h2>
              <p className="text-muted-foreground dwarves-subheading mx-auto max-w-2xl text-xl">
                How we deliver exceptional results for our clients
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processData.map((step, index) => (
                <div key={index} className="dwarves-fade-in text-center">
                  <div className="relative mb-6">
                    <div className="bg-primary text-primary-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                      {step.step}
                    </div>
                    {index < processData.length - 1 && (
                      <div className="bg-border absolute top-8 left-full hidden h-px w-full -translate-x-1/2 lg:block" />
                    )}
                  </div>

                  {step.icon && (
                    <div className="text-primary mx-auto mb-4 h-12 w-12">
                      {step.icon}
                    </div>
                  )}

                  <h3 className="text-foreground dwarves-heading mb-2 text-xl font-semibold">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground dwarves-body">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial Section */}
      {testimonialData && (
        <section className="bg-background py-20">
          <div className="dwarves-container">
            <Card
              variant="gradient"
              size="lg"
              className="mx-auto max-w-4xl text-center"
            >
              <div className="space-y-6">
                <blockquote className="text-primary-foreground text-2xl font-medium italic">
                  "{testimonialData.quote}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  {testimonialData.avatar && (
                    <img
                      src={testimonialData.avatar}
                      alt={testimonialData.author}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <div className="text-left">
                    <div className="text-primary-foreground font-semibold">
                      {testimonialData.author}
                    </div>
                    <div className="text-primary-foreground/80">
                      {testimonialData.role}
                    </div>
                    <div className="text-primary-foreground/70">
                      {testimonialData.company}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="flex-1 py-12">{children}</div>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="dwarves-container text-center">
          <h2 className="text-foreground dwarves-heading mb-4 text-3xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground dwarves-subheading mx-auto mb-8 max-w-2xl text-xl">
            Contact us today to discuss your project and see how we can help you
            achieve your goals.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="/contact">
              Get in Touch
            </Button>
            <Button variant="outline" size="lg" href="/portfolio">
              View Our Work
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

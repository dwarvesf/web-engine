import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import Button from '../../components/ui/button';
import Card from '../../components/card';

export default function LandingTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig, frontmatter } = props;

  // Extract data from frontmatter
  const stats = frontmatter?.stats;
  const features = frontmatter?.features;
  const testimonials = frontmatter?.testimonials;
  const cta = frontmatter?.cta;

  return (
    <Layout siteConfig={siteConfig}>
      {/* Stats Section */}
      {stats && (
        <section className="bg-background py-20">
          <div className="dwarves-container">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
              {stats.map((stat, index) => (
                <div key={index} className="dwarves-fade-in text-center">
                  {stat.icon && (
                    <div className="text-primary mx-auto mb-4 h-12 w-12">
                      {stat.icon}
                    </div>
                  )}
                  <div className="text-primary dwarves-text-gradient mb-2 text-4xl font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground dwarves-subheading">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {features && (
        <section className="bg-secondary/20 py-20">
          <div className="dwarves-container">
            <div className="mb-16 text-center">
              <h2 className="text-foreground dwarves-heading mb-4 text-3xl font-semibold">
                Why Choose Us
              </h2>
              <p className="text-muted-foreground dwarves-subheading mx-auto max-w-2xl text-xl">
                Discover the features that make us the perfect choice for your
                needs
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  hover
                  icon={feature.icon}
                  title={feature.title}
                  className="dwarves-fade-in"
                >
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials && (
        <section className="bg-background py-20">
          <div className="dwarves-container">
            <div className="mb-16 text-center">
              <h2 className="text-foreground dwarves-heading mb-4 text-3xl font-semibold">
                What Our Clients Say
              </h2>
              <p className="text-muted-foreground dwarves-subheading mx-auto max-w-2xl text-xl">
                Don't just take our word for it
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  className="dwarves-fade-in"
                >
                  <blockquote className="text-foreground mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    {testimonial.avatar && (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="text-foreground font-semibold">
                        {testimonial.author}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="flex-1">{children}</div>

      {/* CTA Section */}
      {cta && (
        <section className="dwarves-gradient py-20">
          <div className="dwarves-container text-center">
            <h2 className="text-primary-foreground dwarves-heading mb-4 text-3xl font-semibold">
              {cta.title}
            </h2>
            <p className="text-primary-foreground/90 dwarves-subheading mx-auto mb-8 max-w-2xl text-xl">
              {cta.description}
            </p>
            <Button
              variant="secondary"
              size="lg"
              href={cta.action.href}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              {cta.action.label}
            </Button>
          </div>
        </section>
      )}
    </Layout>
  );
}

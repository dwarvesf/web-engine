import { Icon } from '../../components/ui';
import { TemplateRenderArgs } from '../../types/theme';
import { ClientShowcase } from '../partials';

export default function AboutTemplate(props: TemplateRenderArgs) {
  const { children } = props;
  const clients = [
    { name: 'Tech Startup A', logo: '/images/clients/startup-a.png' },
    { name: 'Enterprise B', logo: '/images/clients/enterprise-b.png' },
    { name: 'Scale-up C', logo: '/images/clients/scaleup-c.png' },
    { name: 'Corporation D', logo: '/images/clients/corp-d.png' },
    { name: 'Startup E', logo: '/images/clients/startup-e.png' },
    { name: 'Company F', logo: '/images/clients/company-f.png' },
  ];

  return (
    <>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              We exist to empower businesses and individuals by creating digital
              solutions that drive real impact. Our mission is to bridge the gap
              between cutting-edge technology and meaningful user experiences.
            </p>

            <h2>Our Values</h2>

            <h3>Excellence</h3>
            <p>
              We strive for excellence in everything we do, from code quality to
              client relationships.
            </p>

            <h3>Innovation</h3>
            <p>
              We embrace new technologies and methodologies to deliver
              innovative solutions.
            </p>

            <h3>Collaboration</h3>
            <p>
              We believe in the power of collaboration, both within our team and
              with our clients.
            </p>

            <h3>Transparency</h3>
            <p>
              We maintain open communication and transparent processes
              throughout every project.
            </p>
          </div>
        </div>
      </section>

      {children}

      <section className="bg-secondary-background py-16">
        <div className="mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
              Our Expertise
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We specialize in a wide range of technologies and methodologies to
              deliver comprehensive solutions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Icon name="code" size="lg" className="text-primary" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Frontend
              </h3>
              <p className="text-muted-foreground text-sm">
                React, Next.js, Vue.js, TypeScript, Tailwind CSS
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Icon name="server" size="lg" className="text-primary" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Backend
              </h3>
              <p className="text-muted-foreground text-sm">
                Node.js, Python, Go, PostgreSQL, MongoDB
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Icon name="mobile" size="lg" className="text-primary" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                Mobile
              </h3>
              <p className="text-muted-foreground text-sm">
                React Native, Flutter, iOS, Android
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Icon name="security" size="lg" className="text-primary" />
              </div>
              <h3 className="text-foreground mb-2 text-xl font-semibold">
                DevOps
              </h3>
              <p className="text-muted-foreground text-sm">
                AWS, Docker, Kubernetes, CI/CD
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-semibold md:text-4xl">
              Why Choose Us
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              We combine technical expertise with business acumen to deliver
              solutions that drive results.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Proven Track Record
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                With years of experience and dozens of successful projects, we
                have the expertise to tackle complex challenges.
              </p>
            </div>

            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Agile Approach
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We use agile methodologies to ensure rapid iteration and
                continuous improvement throughout the development process.
              </p>
            </div>

            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Client-Focused
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize understanding your business needs and objectives
                to deliver solutions that align with your goals.
              </p>
            </div>

            <div className="bg-card border-border rounded-lg border p-6">
              <h3 className="text-foreground mb-3 text-xl font-semibold">
                Long-term Partnership
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe in building lasting relationships and providing
                ongoing support to ensure your continued success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ClientShowcase
        title="Companies We've Worked With"
        clients={clients}
        className="bg-secondary-background"
      />
    </>
  );
}

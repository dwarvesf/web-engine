import { TemplateRenderArgs } from '../../types/theme';
import Layout from '../partials/layout';
import Button from '../../components/ui/button';
import Card from '../../components/card';

export default function BlogTemplate(props: TemplateRenderArgs) {
  const { children, siteConfig, frontmatter } = props;

  // Extract data from frontmatter
  const posts = frontmatter?.posts;
  const featuredPost = frontmatter?.featuredPost;
  const categories = frontmatter?.categories;
  const tags = frontmatter?.tags;

  return (
    <Layout siteConfig={siteConfig}>
      <div className="dwarves-container py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-12 lg:col-span-2">
            {/* Featured Post */}
            {featuredPost && (
              <Card
                variant="elevated"
                size="lg"
                className="dwarves-fade-in"
                image={
                  featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="h-64 w-full object-cover"
                    />
                  ) : undefined
                }
                badge={
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium">
                    Featured
                  </span>
                }
              >
                <div className="space-y-4">
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span className="text-primary">
                      {featuredPost.category}
                    </span>
                    {featuredPost.readTime && (
                      <>
                        <span>•</span>
                        <span>{featuredPost.readTime}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-foreground dwarves-heading text-2xl font-semibold">
                    <a
                      href={featuredPost.href}
                      className="hover:text-primary transition-colors"
                    >
                      {featuredPost.title}
                    </a>
                  </h2>

                  <p className="text-muted-foreground dwarves-body">
                    {featuredPost.excerpt}
                  </p>

                  <Button variant="outline" href={featuredPost.href}>
                    Read More
                  </Button>
                </div>
              </Card>
            )}

            {/* Regular Posts */}
            {posts && (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    hover
                    className="dwarves-fade-in"
                    image={
                      post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-48 w-full object-cover"
                        />
                      ) : undefined
                    }
                  >
                    <div className="space-y-4">
                      <div className="text-muted-foreground flex items-center gap-4 text-sm">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                        <span>•</span>
                        <span className="text-primary">{post.category}</span>
                        {post.readTime && (
                          <>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-foreground dwarves-heading text-xl font-semibold">
                        <a
                          href={post.href}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </a>
                      </h3>

                      <p className="text-muted-foreground dwarves-body">
                        {post.excerpt}
                      </p>

                      <Button variant="ghost" href={post.href}>
                        Read More →
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">{children}</div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            {categories && (
              <Card variant="outlined" title="Categories">
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <a
                        href={category.href}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {category.name}
                      </a>
                      <span className="text-muted-foreground text-sm">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {tags && (
              <Card variant="outlined" title="Tags">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <a
                      key={index}
                      href={tag.href}
                      className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground rounded-full px-3 py-1 text-sm transition-colors"
                    >
                      {tag.name}
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card variant="gradient" title="Stay Updated">
              <p className="text-primary-foreground/90 mb-4">
                Get the latest posts delivered right to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:ring-primary-foreground w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                />
                <Button
                  variant="secondary"
                  fullWidth
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useEffect } from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import BlogPostCard from '../components/blog/BlogPostCard';
import FadeInSection from '../components/ui/FadeInSection';
import { blogPosts } from '../data/blogPosts';

const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Blog Inmobiliario | Nova Hestia';
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Get featured post (most recent)
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="container-custom">
          <FadeInSection>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-secondary-400 mr-3" />
              <h1 className="text-white">Blog Inmobiliario</h1>
            </div>
            <p className="text-white/80 max-w-3xl">
              Mantente informado sobre las últimas tendencias del mercado inmobiliario mexicano, 
              consejos de inversión y guías para compradores y vendedores.
            </p>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Featured Article */}
        <FadeInSection>
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-semibold text-primary-800">Artículo Destacado</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-md overflow-hidden">
              {/* Featured image */}
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Destacado
                </div>
              </div>
              
              {/* Featured content */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center text-sm text-neutral-600 mb-3 space-x-4">
                  <span>{new Date(featuredPost.publishDate).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span>•</span>
                  <span>{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime} min de lectura</span>
                </div>
                
                <h3 className="text-2xl font-bold text-primary-800 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <a
                  href={`/blog/${featuredPost.slug}`}
                  className="btn btn-primary w-fit"
                >
                  Leer artículo completo
                </a>
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Other Articles */}
        <FadeInSection>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary-800 mb-6">Más Artículos</h2>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post, index) => (
            <FadeInSection key={post.id} delay={index * 100}>
              <BlogPostCard post={post} />
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
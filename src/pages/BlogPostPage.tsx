import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, Tag } from 'lucide-react';
import FadeInSection from '../components/ui/FadeInSection';
import BlogPostCard from '../components/blog/BlogPostCard';
import { blogPosts } from '../data/blogPosts';
import { BlogPost } from '../types';
import NotFoundPage from './NotFoundPage';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | undefined>();
  
  useEffect(() => {
    if (slug) {
      const foundPost = blogPosts.find(p => p.slug === slug);
      setPost(foundPost);
      
      if (foundPost) {
        document.title = `${foundPost.title} | Blog Nova Hestia`;
      } else {
        document.title = 'Artículo no encontrado | Blog Nova Hestia';
      }
    }
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!post) {
    return <NotFoundPage />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `${post.title} - ${post.excerpt}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Enlace copiado al portapapeles');
    }
  };

  // Get related posts (exclude current post)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  // Convert markdown-like content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-primary-800 mb-6 mt-8">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-primary-800 mb-4 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-primary-800 mb-3 mt-5">{line.substring(4)}</h3>;
        }
        if (line.startsWith('#### ')) {
          return <h4 key={index} className="text-lg font-semibold text-primary-800 mb-2 mt-4">{line.substring(5)}</h4>;
        }
        if (line.startsWith('##### ')) {
          return <h5 key={index} className="text-base font-semibold text-primary-800 mb-2 mt-3">{line.substring(6)}</h5>;
        }
        
        // Lists
        if (line.startsWith('- ')) {
          return <li key={index} className="text-neutral-700 mb-1">{line.substring(2)}</li>;
        }
        
        // Bold text
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold text-neutral-800 mb-3">{line.slice(2, -2)}</p>;
        }
        
        // Code blocks
        if (line.startsWith('```')) {
          return null; // Skip code block markers for now
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <div key={index} className="mb-2"></div>;
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
          return <p key={index} className="text-neutral-700 mb-4 leading-relaxed">{line}</p>;
        }
        
        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="pt-20">
      {/* Article Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="container-custom">
          <FadeInSection>
            <div className="flex items-center mb-6">
              <Link to="/blog" className="flex items-center text-white hover:text-secondary-400 transition-colors mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Volver al blog
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <h1 className="text-white mb-4 leading-tight">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-white/80 text-sm space-x-6 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{post.readTime} min de lectura</span>
                </div>
              </div>
              
              <p className="text-white/90 text-lg leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <FadeInSection>
              {/* Featured Image */}
              <div className="mb-8">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
                />
              </div>
            </FadeInSection>

            {/* Article Content */}
            <FadeInSection delay={200}>
              <article className="prose prose-lg max-w-none">
                <div className="bg-white rounded-lg shadow-sm p-8">
                  {formatContent(post.content)}
                </div>
              </article>
            </FadeInSection>

            {/* Tags and Share */}
            <FadeInSection delay={400}>
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Tags */}
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="h-5 w-5 text-neutral-600 mr-2" />
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full hover:bg-primary-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Compartir artículo
                  </button>
                </div>
              </div>
            </FadeInSection>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <FadeInSection delay={300}>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-lg font-semibold text-primary-800 mb-3">Sobre el autor</h3>
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">{post.author}</p>
                    <p className="text-sm text-neutral-600">Experto Inmobiliario</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  Especialista en el mercado inmobiliario mexicano con más de 10 años de experiencia 
                  ayudando a familias a encontrar su hogar ideal.
                </p>
              </div>
            </FadeInSection>

            {/* Contact CTA */}
            <FadeInSection delay={400}>
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-6 text-white mb-8">
                <h3 className="text-lg font-semibold mb-3">¿Necesitas asesoría inmobiliaria?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Nuestros expertos están listos para ayudarte a encontrar la propiedad perfecta.
                </p>
                <Link to="/contacto" className="btn btn-secondary w-full">
                  Contactar ahora
                </Link>
              </div>
            </FadeInSection>

          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <FadeInSection delay={600}>
            <div className="mt-16 pt-12 border-t border-neutral-200">
              <h2 className="text-2xl font-semibold text-primary-800 mb-8">Artículos Relacionados</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost, index) => (
                  <FadeInSection key={relatedPost.id} delay={index * 100}>
                    <BlogPostCard post={relatedPost} />
                  </FadeInSection>
                ))}
              </div>
            </div>
          </FadeInSection>
        )}
      </div>
    </div>
  );
};

export default BlogPostPage;
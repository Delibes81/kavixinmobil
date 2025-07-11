import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { BlogPost } from '../../types';
import LazyImage from '../ui/LazyImage';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="card group overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:-translate-y-2 h-full flex flex-col">
      {/* Image container */}
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden h-64">
          <LazyImage
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Reading time badge */}
          <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime} min
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Meta information */}
        <div className="flex items-center text-sm text-neutral-600 mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.publishDate)}</span>
          </div>
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`} className="block mb-3">
          <h3 className="text-xl font-semibold text-primary-800 line-clamp-2 hover:text-primary-600 transition-colors duration-200 group-hover:text-primary-600">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-neutral-600 line-clamp-3 mb-4 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read more button */}
        <Link 
          to={`/blog/${post.slug}`}
          className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition-all duration-200 group-hover:translate-x-1 mt-auto"
        >
          Leer artículo completo
          <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

export default BlogPostCard;
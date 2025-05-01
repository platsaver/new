import React, { useState, useEffect } from 'react';
import Article from './Article.jsx';

const FeaturedSection2 = ({ categoryId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/featured-posts1/category/${categoryId}?t=${Date.now()}`, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch featured posts');
        }
        const data = await response.json();

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || 'Invalid data format');
        }

        const fetchedPosts = data.data.map(post => ({
          ...post,
          imageUrl: post.imageurl, // Map imageurl to imageUrl
        }));

        // Reorder posts to prioritize images for the first two articles
        const postsWithImages = fetchedPosts.filter(post => post.imageUrl);
        const postsWithoutImages = fetchedPosts.filter(post => !post.imageUrl);
        const reorderedPosts = [];

        // First column (col-lg-6, index 0) - must have image if available
        reorderedPosts[0] = postsWithImages.shift() || postsWithoutImages.shift() || null;

        // Second column (col-lg-3, index 1) - must have image if available
        reorderedPosts[1] = postsWithImages.shift() || postsWithoutImages.shift() || null;

        // Third column (col-lg-3, indices 2 and 3) - prefer no images
        reorderedPosts[2] = postsWithoutImages.shift() || postsWithImages.shift() || null;
        reorderedPosts[3] = postsWithoutImages.shift() || postsWithImages.shift() || null;

        // Filter out null values
        setPosts(reorderedPosts.filter(Boolean));
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        setPosts([]);
      }
    };

    if (categoryId) {
      fetchFeaturedPosts();
    }
  }, [categoryId]);

  return (
    <section className="featured">
      <div className="container-xl">
        <div className="row">
          {/* First Column: col-lg-6 (1 article with image) */}
          <div className="col-lg-6">
            <div className="collection">
              {posts[0] && (
                <Article
                  imageUrl={posts[0].imageUrl || undefined} // Ensure image is attempted
                  categories={posts[0].categories}
                  title={posts[0].title}
                  author={posts[0].author}
                  timestamp={posts[0].timestamp.replace('+07', 'GMT+7').split(',')[0]} // "HH:MM AM GMT+7"
                  excerpt={posts[0].excerpt || 'No description available'}
                  link={posts[0].link}
                />
              )}
            </div>
          </div>

          {/* Second Column: col-lg-3 (1 article with image) */}
          <div className="col-lg-3">
            <div className="collection">
              {posts[1] && (
                <Article
                  imageUrl={posts[1].imageUrl || undefined} // Ensure image is attempted
                  categories={posts[1].categories}
                  title={posts[1].title}
                  author={posts[1].author}
                  timestamp={posts[1].timestamp.replace('+07', 'GMT+7').split(',')[0]} // "HH:MM AM GMT+7"
                  excerpt={posts[1].excerpt || 'No description available'}
                  link={posts[1].link}
                />
              )}
            </div>
          </div>

          {/* Third Column: col-lg-3 (2 articles without images) */}
          <div className="col-lg-3">
            <div className="collection">
              {posts[2] && (
                <Article
                  imageUrl={undefined} // No image
                  categories={posts[2].categories}
                  title={posts[2].title}
                  author={posts[2].author}
                  timestamp={posts[2].timestamp.replace('+07', 'GMT+7')} // Full timestamp
                  excerpt={posts[2].excerpt || 'No description available'}
                  link={posts[2].link}
                />
              )}
              {posts[3] && (
                <Article
                  imageUrl={undefined} // No image
                  categories={posts[3].categories}
                  title={posts[3].title}
                  author={posts[3].author}
                  timestamp={posts[3].timestamp.replace('+07', 'GMT+7')} // Full timestamp
                  excerpt={posts[3].excerpt || 'No description available'}
                  link={posts[3].link}
                  isLast={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection2;
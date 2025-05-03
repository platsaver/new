import React, { useState, useEffect } from 'react';
import Article from './Article.jsx';

const FeaturedSection1 = ({ setCurrentComponent }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/featured-posts');
        if (!response.ok) {
          throw new Error('Failed to fetch featured posts');
        }
        const data = await response.json();

        const postsWithImages = data.filter((post) => post.imageUrl);
        const postsWithoutImages = data.filter((post) => !post.imageUrl);
        const reorderedPosts = [];

        reorderedPosts[2] = postsWithImages.shift() || postsWithoutImages.shift() || null;
        reorderedPosts[1] = postsWithImages.shift() || postsWithoutImages.shift() || null;
        reorderedPosts[4] = postsWithImages.shift() || postsWithoutImages.shift() || null;
        reorderedPosts[0] = postsWithoutImages.shift() || postsWithImages.shift() || null;
        reorderedPosts[3] = postsWithoutImages.shift() || postsWithImages.shift() || null;

        setPosts(reorderedPosts.filter(Boolean));
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      }
    };

    fetchFeaturedPosts();
  }, []);

  return (
    <section className="featured">
      <div className="container-xl">
        <div className="row g-3">
          <div className="col-lg-3">
            <div className="collection">
              {posts[0] && (
                <Article
                  postID={posts[0].postID}
                  categories={posts[0].categories}
                  title={posts[0].title}
                  author={posts[0].author}
                  timestamp={posts[0].timestamp}
                  excerpt={posts[0].excerpt}
                  setCurrentComponent={setCurrentComponent}
                />
              )}
              {posts[1] && (
                <Article
                  postID={posts[1].postID}
                  categories={posts[1].categories}
                  title={posts[1].title}
                  author={posts[1].author}
                  timestamp={posts[1].timestamp}
                  excerpt={posts[1].excerpt}
                  imageUrl={posts[1].imageUrl}
                  setCurrentComponent={setCurrentComponent}
                />
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="collection">
              {posts[2] && (
                <Article
                  postID={posts[2].postID}
                  categories={posts[2].categories}
                  title={posts[2].title}
                  author={posts[2].author}
                  timestamp={posts[2].timestamp}
                  excerpt={posts[2].excerpt}
                  imageUrl={posts[2].imageUrl}
                  setCurrentComponent={setCurrentComponent}
                />
              )}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="collection">
              {posts[3] && (
                <Article
                  postID={posts[3].postID}
                  categories={posts[3].categories}
                  title={posts[3].title}
                  author={posts[3].author}
                  timestamp={posts[3].timestamp}
                  excerpt={posts[3].excerpt}
                  setCurrentComponent={setCurrentComponent}
                />
              )}
              {posts[4] && (
                <Article
                  postID={posts[4].postID}
                  categories={posts[4].categories}
                  title={posts[4].title}
                  author={posts[4].author}
                  timestamp={posts[4].timestamp}
                  excerpt={posts[4].excerpt}
                  imageUrl={posts[4].imageUrl}
                  isLast={true}
                  setCurrentComponent={setCurrentComponent}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection1;
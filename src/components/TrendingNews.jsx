const TrendingNews = ({ articles }) => {
  if (!Array.isArray(articles)) {
    return <p>No news available.</p>;  // safe fallback
  }

  return (
    <div className="space-y-6">
      {articles.map((article, index) => (
        <div key={index} className="bg-base-100 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">

          {/* Always show image and description on all devices */}
          <div>
            <img
              src={article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image"}
              alt={article.title}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <p className="text-sm text-base-content/70 mb-3">
              {article.description ? article.description.slice(0, 100) + '...' : 'No description available.'}
            </p>
          </div>

          {/* Title always */}
          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>

          {/* Read more button */}
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 font-medium hover:underline">
            Read More →
          </a>
        </div>
      ))}
    </div>
  );
};

export default TrendingNews;

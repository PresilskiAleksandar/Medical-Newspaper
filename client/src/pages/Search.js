import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [input, setInput] = useState(query);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setPage(1);
    articlesAPI.getAll({ search: query, limit: 10 })
      .then((res) => {
        setArticles(res.data.articles);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    if (page <= 1) return;
    articlesAPI.getAll({ search: query, page, limit: 10 })
      .then((res) => setArticles(res.data.articles))
      .catch(console.error);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setSearchParams({ q: input.trim() });
    }
  };

  return (
    <div className="search-page fade-in">
      <div className="container">
        <h1 className="page-title">Пребарување</h1>
        <form onSubmit={handleSearch} className="search-page-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Пребарувај вести..."
            className="search-page-input"
          />
          <button type="submit" className="btn btn-primary">Пребарај</button>
        </form>

        {query && (
          <p className="search-results-info">
            Резултати за: "<strong>{query}</strong>"
          </p>
        )}

        <div className="articles-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map((a) => <ArticleCard key={a.id} article={a} />)
          }
        </div>

        {!loading && query && articles.length === 0 && (
          <p className="no-results">Нема резултати за вашето пребарување.</p>
        )}

        {query && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </div>
  );
};

export default Search;

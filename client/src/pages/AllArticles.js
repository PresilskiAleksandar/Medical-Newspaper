import React, { useEffect, useState } from 'react';
import { articlesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';

const AllArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    articlesAPI.getAll({ page, limit: 12 })
      .then((res) => {
        setArticles(res.data.articles);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="all-articles-page fade-in">
      <div className="container">
        <h1 className="page-title">Сите Вести</h1>
        <p className="page-subtitle">Прегледајте ги сите медицински вести</p>
        <div className="articles-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map((a) => <ArticleCard key={a.id} article={a} />)
          }
        </div>
        {!loading && articles.length === 0 && <p className="no-results">Нема резултати.</p>}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default AllArticles;

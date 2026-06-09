import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';

const CategoryArticles = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    articlesAPI.getAll({ category: slug, page, limit: 9 })
      .then((res) => {
        setArticles(res.data.articles);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, page]);

  useEffect(() => { setPage(1); }, [slug]);

  const categoryName = articles[0]?.category_name || slug;

  return (
    <div className="category-articles-page fade-in">
      <div className="container">
        <h1 className="page-title">Категорија: {categoryName}</h1>
        <div className="articles-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map((a) => <ArticleCard key={a.id} article={a} />)
          }
        </div>
        {!loading && articles.length === 0 && <p className="no-results">Нема статии во оваа категорија.</p>}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default CategoryArticles;

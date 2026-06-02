import React, { createContext, useContext, useState, useCallback } from 'react';
import { articlesAPI, categoriesAPI } from '../services/api';

const NewsContext = createContext(null);

export const useNews = () => useContext(NewsContext);

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const fetchArticles = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await articlesAPI.getAll(params);
      setArticles(res.data.articles);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await articlesAPI.getFeatured();
      setFeatured(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoriesAPI.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <NewsContext.Provider value={{
      articles, featured, categories, loading, pagination,
      fetchArticles, fetchFeatured, fetchCategories, setArticles,
    }}>
      {children}
    </NewsContext.Provider>
  );
};

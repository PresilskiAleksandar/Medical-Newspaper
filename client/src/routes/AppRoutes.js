import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ArticleDetail = lazy(() => import('../pages/ArticleDetail'));
const AllArticles = lazy(() => import('../pages/AllArticles'));
const Categories = lazy(() => import('../pages/Categories'));
const CategoryArticles = lazy(() => import('../pages/CategoryArticles'));
const Search = lazy(() => import('../pages/Search'));
const Favorites = lazy(() => import('../pages/Favorites'));
const NotFound = lazy(() => import('../pages/NotFound'));

const Dashboard = lazy(() => import('../pages/admin/Dashboard'));
const ManageArticles = lazy(() => import('../pages/admin/ManageArticles'));
const CreateArticle = lazy(() => import('../pages/admin/CreateArticle'));
const EditArticle = lazy(() => import('../pages/admin/EditArticle'));
const ManageCategories = lazy(() => import('../pages/admin/ManageCategories'));
const ManageComments = lazy(() => import('../pages/admin/ManageComments'));
const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/vesti" element={<MainLayout><AllArticles /></MainLayout>} />
        <Route path="/vest/:id" element={<MainLayout><ArticleDetail /></MainLayout>} />
        <Route path="/kategorii" element={<MainLayout><Categories /></MainLayout>} />
        <Route path="/kategorii/:slug" element={<MainLayout><CategoryArticles /></MainLayout>} />
        <Route path="/pretraga" element={<MainLayout><Search /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route path="/omileni" element={<MainLayout><ProtectedRoute><Favorites /></ProtectedRoute></MainLayout>} />

        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="vesti" element={<ManageArticles />} />
          <Route path="vesti/nova" element={<CreateArticle />} />
          <Route path="vesti/:id" element={<EditArticle />} />
          <Route path="kategorii" element={<ManageCategories />} />
          <Route path="komentari" element={<ManageComments />} />
          <Route path="korisnici" element={<ManageUsers />} />
        </Route>

        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

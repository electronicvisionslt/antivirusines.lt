import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import AuthorPage from "./pages/AuthorPage";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleEditor from "./pages/admin/ArticleEditor";
import CategoriesList from "./pages/admin/CategoriesList";
import CategoryEditor from "./pages/admin/CategoryEditor";
import AuthorsList from "./pages/admin/AuthorsList";
import AuthorEditor from "./pages/admin/AuthorEditor";
import ProductsList from "./pages/admin/ProductsList";
import ProductEditor from "./pages/admin/ProductEditor";
import MediaLibrary from "./pages/admin/MediaLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/antivirusines-programos" element={<CategoryPage />} />
            <Route path="/tevu-kontrole" element={<CategoryPage />} />
            <Route path="/slaptazodziu-saugumas" element={<CategoryPage />} />
            <Route path="/antivirusines-programos/nemokamos" element={<ArticlePage />} />
            <Route path="/antivirusines-programos/telefonui" element={<ArticlePage />} />
            <Route path="/antivirusines-programos/kompiuteriui" element={<ArticlePage />} />
            <Route path="/tevu-kontrole/vaiko-telefone" element={<ArticlePage />} />
            <Route path="/virusai/kompiuterinis-virusas" element={<ArticlePage />} />
            <Route path="/virusai/virusas-telefone" element={<ArticlePage />} />
            <Route path="/saugumo-patarimai/saugus-darbas-kompiuteriu" element={<ArticlePage />} />
            <Route path="/autoriai/:slug" element={<AuthorPage />} />
            <Route path="/apie" element={<StaticPage />} />
            <Route path="/kontaktai" element={<StaticPage />} />
            <Route path="/affiliate-atskleidimas" element={<StaticPage />} />
            <Route path="/privatumo-politika" element={<StaticPage />} />
            <Route path="/slapuku-politika" element={<StaticPage />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/articles" element={<ProtectedRoute><ArticlesList /></ProtectedRoute>} />
            <Route path="/admin/articles/:id" element={<ProtectedRoute><ArticleEditor /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute><CategoriesList /></ProtectedRoute>} />
            <Route path="/admin/categories/:id" element={<ProtectedRoute><CategoryEditor /></ProtectedRoute>} />
            <Route path="/admin/authors" element={<ProtectedRoute><AuthorsList /></ProtectedRoute>} />
            <Route path="/admin/authors/:id" element={<ProtectedRoute><AuthorEditor /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
            <Route path="/admin/products/:id" element={<ProtectedRoute><ProductEditor /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

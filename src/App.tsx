import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AuthorPage from "./pages/AuthorPage";
import StaticPage from "./pages/StaticPage";
import DynamicPage from "./pages/DynamicPage";
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
            <Route path="/autoriai/:slug" element={<AuthorPage />} />

            {/* Static pages */}
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

            {/* Dynamic catch-all: resolves articles and categories from DB + mock fallback */}
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="/:parent/:slug" element={<DynamicPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ArticlePage from "./pages/ArticlePage";
import AuthorPage from "./pages/AuthorPage";
import StaticPage from "./pages/StaticPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Category pages */}
          <Route path="/antivirusines-programos" element={<CategoryPage />} />
          <Route path="/tevu-kontrole" element={<CategoryPage />} />
          <Route path="/slaptazodziu-saugumas" element={<CategoryPage />} />

          {/* Article pages */}
          <Route path="/antivirusines-programos/nemokamos" element={<ArticlePage />} />
          <Route path="/antivirusines-programos/telefonui" element={<ArticlePage />} />
          <Route path="/antivirusines-programos/kompiuteriui" element={<ArticlePage />} />
          <Route path="/tevu-kontrole/vaiko-telefone" element={<ArticlePage />} />
          <Route path="/virusai/kompiuterinis-virusas" element={<ArticlePage />} />
          <Route path="/virusai/virusas-telefone" element={<ArticlePage />} />
          <Route path="/saugumo-patarimai/saugus-darbas-kompiuteriu" element={<ArticlePage />} />

          {/* Author page */}
          <Route path="/autoriai/:slug" element={<AuthorPage />} />

          {/* Static pages */}
          <Route path="/apie" element={<StaticPage />} />
          <Route path="/kontaktai" element={<StaticPage />} />
          <Route path="/affiliate-atskleidimas" element={<StaticPage />} />
          <Route path="/privatumo-politika" element={<StaticPage />} />
          <Route path="/slapuku-politika" element={<StaticPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

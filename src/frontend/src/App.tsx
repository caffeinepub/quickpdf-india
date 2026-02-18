import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { SiteLayout } from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import { MergePdfPage } from './pages/tools/MergePdfPage';
import { SplitPdfPage } from './pages/tools/SplitPdfPage';
import { CompressPdfPage } from './pages/tools/CompressPdfPage';
import { ResizePdfPage } from './pages/tools/ResizePdfPage';
import RemovePagesPage from './pages/tools/RemovePagesPage';
import AddWatermarkPage from './pages/tools/AddWatermarkPage';
import PdfToWordPage from './pages/tools/PdfToWordPage';
import WordToPdfPage from './pages/tools/WordToPdfPage';
import ImageToPdfPage from './pages/tools/ImageToPdfPage';
import ResizeImagePage from './pages/tools/ResizeImagePage';
import BlogIndexPage from './pages/blog/BlogIndexPage';
import HowToCompressPdfOnlinePage from './pages/blog/HowToCompressPdfOnlinePage';
import ResizeImageUnder50KbPage from './pages/blog/ResizeImageUnder50KbPage';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const mergePdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/merge-pdf',
  component: MergePdfPage,
});

const splitPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/split-pdf',
  component: SplitPdfPage,
});

const compressPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compress-pdf',
  component: CompressPdfPage,
});

const resizePdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resize-pdf',
  component: ResizePdfPage,
});

const removePagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/remove-pages',
  component: RemovePagesPage,
});

const addWatermarkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/add-watermark',
  component: AddWatermarkPage,
});

const pdfToWordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pdf-to-word',
  component: PdfToWordPage,
});

const wordToPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/word-to-pdf',
  component: WordToPdfPage,
});

const imageToPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/image-to-pdf',
  component: ImageToPdfPage,
});

const resizeImageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resize-image',
  component: ResizeImagePage,
});

const blogIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogIndexPage,
});

const blogCompressPdfRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/how-to-compress-pdf-online',
  component: HowToCompressPdfOnlinePage,
});

const blogResizeImageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/resize-image-under-50kb',
  component: ResizeImageUnder50KbPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mergePdfRoute,
  splitPdfRoute,
  compressPdfRoute,
  resizePdfRoute,
  removePagesRoute,
  addWatermarkRoute,
  pdfToWordRoute,
  wordToPdfRoute,
  imageToPdfRoute,
  resizeImageRoute,
  blogIndexRoute,
  blogCompressPdfRoute,
  blogResizeImageRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

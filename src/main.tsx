import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route} from 'react-router'
import ReactDOM from "react-dom/client"

import App from './App.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ExPage from './pages/ExPage.tsx'
import ProjPage from './pages/ProjPage.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/about' element={<AboutPage/>}/>
      <Route path='/experiences' element={<ExPage/>}/>
      <Route path='/projects' element={<ProjPage/>}/>
    </Routes>
  </BrowserRouter>
  </ThemeProvider>
)

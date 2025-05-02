// npm
import { Routes, Route } from "react-router"

// pages
import AppLanding from "../pages/AppLanding/AppLanding"
import GenerateModuleOutline from "../pages/module-outline/Generate/GenerateModuleOutline"
import EditModuleOutline from "../pages/module-outline/Edit/EditModuleOutline"
import ModuleOutput from "../pages/module/Output/ModuleOutput"
import PageNotFound from "../pages/PageNotFound/PageNotFound"

// component
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<PageNotFound />} />
      <Route path="/" element={<AppLanding />} />
      <Route
        path="/module-outline/generate"
        element={<GenerateModuleOutline />}
      />
      <Route path="/module-outline/edit" element={<EditModuleOutline />} />
      <Route path="/module/output" element={<ModuleOutput />} />
    </Routes>
  )
}

export default AppRouter

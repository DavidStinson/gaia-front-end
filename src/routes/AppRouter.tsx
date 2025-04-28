import {Routes, Route} from "react-router"

import PageNotFound from "../pages/PageNotFound/PageNotFound"
import AppLanding from "../pages/AppLanding/AppLanding"

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<PageNotFound />} />
      <Route path="/" element={<AppLanding />} />
    </Routes>
  )
}

export default AppRouter
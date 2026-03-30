// 主页面，最上层的聚合页面，所有最上层component得最终去向。
// 筛选页面放进来就行了，剩下的东西都往页面的单独文件里导

import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"

import Explore from "./pages/Explore"
import Events from "./pages/Events"
import About from "./pages/About"
import PlaceDetailPage from "./components/PlaceDetailPage" // ⭐注意路径

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Explore />} />
        <Route path="events" element={<Events />} />
        <Route path="about" element={<About />} />

        {/* ⭐ 新增 */}
        <Route path="places/:id" element={<PlaceDetailPage />} />
      </Route>
    </Routes>
  )
}
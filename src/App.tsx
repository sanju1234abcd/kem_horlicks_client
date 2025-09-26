
import { Route, Routes } from "react-router-dom"
import SalesSubmit from "./SalesSubmit"
import type React from "react"
import Admin from "./Admin"

const App : React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SalesSubmit />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}

export default App;
import { Route, Routes } from "react-router"
import { HomePage } from "./pages/Home"
import { PaginaProducto } from "./pages/PDP"
import { PaginaCatalogo } from "./pages/PLP"



function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/PaginaProducto" element={<PaginaProducto/>}/>
      <Route path="/PaginaCatalogo" element={<PaginaCatalogo/>}/>
      </Routes>


    </>
  )
}

export default App

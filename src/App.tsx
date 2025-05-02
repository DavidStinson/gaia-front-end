// routes
import AppRouter from "./routes/AppRouter"

// components
import Navbar from "./components/NavBar/NavBar"
import Footer from "./components/Footer/Footer"

// component
function App() {
  return (
    <>
      <Navbar />
      <div className="w-full flex place-content-center grow">
        <div className="max-w-7xl w-full px-4 pt-6 pb-8">
          <AppRouter />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default App

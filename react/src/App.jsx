import './App.css'
import Navbar from './components/Navbar/Navbar'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Portfolio</p>
          <h1>Hi, I'm Damien.</h1>
        </div>
      </header>
      <Navbar />
    </div>
  )
}

export default App

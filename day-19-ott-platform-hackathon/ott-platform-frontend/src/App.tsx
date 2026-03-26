import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

export default App;


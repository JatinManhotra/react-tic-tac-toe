
import { FaHeart } from "react-icons/fa"
import TicTacGrid from "./components/TicTacGrid"


const App = () => {


  return (
    <>
    <header>
      <h1>Tic Tac Toe in <span>React</span></h1>
    </header>

    <main>
      <TicTacGrid/>
    </main>

    <footer>
      <section className="footer">
        <p>Made with <FaHeart style={{color : "#ec264a"}}/> by <a href="https://github.com/JatinManhotra" target="_blank">Jatin Manhotra</a></p>
      </section>
    </footer>
    </>
  )
}

export default App
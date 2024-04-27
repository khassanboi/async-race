import "./App.css";
import { Header } from "./components/Header/Header";
import { Control } from "./components/Control/Control";
import { CarList } from "./components/CarList/CarList";

function App() {
  return (
    <div className="App">
      <Header />
      <Control />
      <CarList />
    </div>
  );
}

export default App;

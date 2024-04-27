import "./App.css";
import { Header } from "./components/Header/Header";
import { Control } from "./components/Control/Control";
import { CarList } from "./components/CarList/CarList";
import { WinnerList } from "./components/WinnerList/WinnerList";

function App() {
  return (
    <div className="App">
      <Header />
      <Control />
      <CarList />
      <WinnerList />
    </div>
  );
}

export default App;

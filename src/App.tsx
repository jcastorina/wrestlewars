import { ContextProvider } from "./hooks/useGameContext";
import Surface from "./components/Surface";

function App() {

  return (
    <ContextProvider>
      <Surface />
    </ContextProvider>
  );
}

export default App;

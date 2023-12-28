import { Calendar } from "./components/Calendar";
import { EventsProvider } from "./context/Events";
import "./styles.css";


function App() {

  return (
    <EventsProvider>
      <Calendar />
    </EventsProvider>
  )
}

export default App

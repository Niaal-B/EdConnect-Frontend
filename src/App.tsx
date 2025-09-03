import { AppRouter } from './router/router';
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <div className="app">
      <AppRouter />
      <Toaster />

    </div>
  );
}

export default App;
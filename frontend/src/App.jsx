import { useGame } from './hooks/useGame.js';
import StartScreen from './screens/StartScreen.jsx';
import QuizScreen from './screens/QuizScreen.jsx';
import WinnerScreen from './screens/WinnerScreen.jsx';

function App() {
  const game = useGame();

  return (
    <div className="min-h-screen w-full bg-void font-body text-white">
      {game.screen === 'start' && <StartScreen game={game} />}
      {game.screen === 'quiz' && <QuizScreen game={game} />}
      {game.screen === 'winner' && <WinnerScreen game={game} />}
    </div>
  );
}

export default App;
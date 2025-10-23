import { ThemeProvider } from './hooks/useTheme'
import TeamBalancer from './components/TeamBalancerNew'

function App() {
  return (
    <ThemeProvider>
      <TeamBalancer />
    </ThemeProvider>
  )
}

export default App

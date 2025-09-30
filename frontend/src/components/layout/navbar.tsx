import { Button } from '@/components/ui/button'
import { Moon, Sun, Brain, Activity, Bell, User, Settings } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

export function Navbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl gradient-primary shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                Student Dropout Predictor
              </h1>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Activity className="h-3 w-3" />
                <span>AI-Powered Risk Assessment</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <User className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

import { cn } from '@/lib/utils'
import { 
  Upload, 
  AlertTriangle, 
  FileText, 
  Settings,
  Home,
  Shield
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const navigation = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: Home, 
    description: 'Overview & Analytics',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'upload', 
    name: 'Upload Data', 
    icon: Upload, 
    description: 'Import Student Data',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'high-risk', 
    name: 'High-Risk Students', 
    icon: AlertTriangle, 
    description: 'At-Risk Students',
    gradient: 'from-red-500 to-pink-500',
    badge: '12'
  },
  { 
    id: 'reports', 
    name: 'Reports', 
    icon: FileText, 
    description: 'Generate Reports',
    gradient: 'from-purple-500 to-indigo-500'
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: Settings, 
    description: 'Configuration',
    gradient: 'from-gray-500 to-slate-500'
  },
]

export function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <aside className={cn("w-72 border-r bg-background/50 backdrop-blur-sm", className)}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-2">Navigation</h2>
          <p className="text-sm text-muted-foreground">Manage your student data and insights</p>
        </div>
        
        <nav className="flex flex-col space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "group relative flex items-center space-x-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r shadow-lg text-white"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                style={isActive ? {
                  background: `linear-gradient(135deg, ${item.gradient.split(' ')[0].replace('from-', '')}, ${item.gradient.split(' ')[2].replace('to-', '')})`
                } : {}}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>
                
                {isActive && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            )
          })}
        </nav>
        
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/50 dark:border-blue-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-500 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">AI Model Status</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Model is active and ready</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

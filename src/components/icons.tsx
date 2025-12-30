import * as LucideIcons from 'lucide-react'

// Mapeo de nombres de íconos a componentes de Lucide
const iconMap: Record<string, React.ComponentType<any>> = {
  // Capabilities
  Cloud: LucideIcons.Cloud,
  Smartphone: LucideIcons.Smartphone,
  Globe: LucideIcons.Globe,
  Link: LucideIcons.Link,
  BarChart3: LucideIcons.BarChart3,
  Shield: LucideIcons.Shield,
  Brain: LucideIcons.Brain,
  Lightbulb: LucideIcons.Lightbulb,
  MapPin: LucideIcons.MapPin,
  
  // Principles
  Sparkles: LucideIcons.Sparkles,
  Boxes: LucideIcons.Boxes,
  ShieldCheck: LucideIcons.ShieldCheck,
  Zap: LucideIcons.Zap,
  TrendingUp: LucideIcons.TrendingUp,
  Users: LucideIcons.Users,
  
  // Impact
  Globe2: LucideIcons.Globe2,
  Users2: LucideIcons.Users2,
  Network: LucideIcons.Network,
  Layers: LucideIcons.Layers,
  
  // Otros íconos comunes
  Check: LucideIcons.Check,
  CheckCircle: LucideIcons.CheckCircle,
  Building: LucideIcons.Building,
  Code: LucideIcons.Code,
  Database: LucideIcons.Database,
  Server: LucideIcons.Server,
  Cpu: LucideIcons.Cpu,
}

// Crear el objeto icons con JSX elements
export const icons: Record<string, JSX.Element> = Object.entries(iconMap).reduce((acc, [key, IconComponent]) => {
  acc[key] = <IconComponent className="w-12 h-12" strokeWidth={1.5} />
  return acc
}, {} as Record<string, JSX.Element>)

// Agregar un ícono por defecto
icons.default = <LucideIcons.Circle className="w-12 h-12" strokeWidth={1.5} />

export type IconName = keyof typeof icons


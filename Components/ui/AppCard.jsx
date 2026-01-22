import { Card } from './card';

export function AppCard({ children, className = '', ...props }) {
  return (
    <Card
      className={`bg-card text-card-foreground border-border shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </Card>
  );
}
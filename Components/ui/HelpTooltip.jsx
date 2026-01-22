import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { HelpCircle } from 'lucide-react';

export function HelpTooltip({ content, children }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />}
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

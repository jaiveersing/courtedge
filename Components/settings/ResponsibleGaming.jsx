import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

export default function ResponsibleGaming() {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Responsible Gaming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold mb-1">
                Set Your Limits
              </p>
              <p className="text-sm text-slate-300">
                Setting limits helps ensure you stay in control of your betting activity.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="daily-limit">Daily Loss Limit ($)</Label>
            <Input
              id="daily-limit"
              type="number"
              placeholder="250"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="weekly-limit">Weekly Loss Limit ($)</Label>
            <Input
              id="weekly-limit"
              type="number"
              placeholder="1000"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="monthly-limit">Monthly Loss Limit ($)</Label>
            <Input
              id="monthly-limit"
              type="number"
              placeholder="4000"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div>
              <Label htmlFor="self-exclude">Self-Exclusion</Label>
              <p className="text-sm text-slate-400">Take a break from betting</p>
            </div>
            <Switch id="self-exclude" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reality-check">Reality Check Alerts</Label>
              <p className="text-sm text-slate-400">Hourly betting reminders</p>
            </div>
            <Switch id="reality-check" defaultChecked />
          </div>
        </div>

        <Button className="w-full mt-4">Save Limits</Button>
      </CardContent>
    </Card>
  );
}

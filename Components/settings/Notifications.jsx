import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const notificationSettings = [
    { id: 'predictions', label: 'New Predictions', description: 'Get notified of new betting predictions', enabled: true },
    { id: 'line-moves', label: 'Line Movement Alerts', description: 'Sharp money and significant line changes', enabled: true },
    { id: 'bet-results', label: 'Bet Results', description: 'Updates when your bets are settled', enabled: true },
    { id: 'player-news', label: 'Player News', description: 'Injury reports and lineup changes', enabled: false },
    { id: 'promotions', label: 'Promotions & Bonuses', description: 'Sportsbook offers and bonuses', enabled: false },
    { id: 'weekly-report', label: 'Weekly Performance Report', description: 'Summary of your betting performance', enabled: true },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notificationSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0"
          >
            <div className="flex-1">
              <Label htmlFor={setting.id} className="text-base">
                {setting.label}
              </Label>
              <p className="text-sm text-slate-400 mt-1">
                {setting.description}
              </p>
            </div>
            <Switch
              id={setting.id}
              defaultChecked={setting.enabled}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Link2, Trash2, Plus } from 'lucide-react';

export default function Connections() {
  const [connections, setConnections] = useState([
    { id: 1, name: 'DraftKings', connected: true, apiKey: '****' },
    { id: 2, name: 'FanDuel', connected: false, apiKey: '' },
    { id: 3, name: 'BetMGM', connected: true, apiKey: '****' },
  ]);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Sportsbook Connections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map((conn) => (
          <div
            key={conn.id}
            className="flex items-center justify-between p-4 bg-slate-900/50 rounded border border-slate-700"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-700 rounded flex items-center justify-center">
                <span className="text-xl font-bold">{conn.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-white">{conn.name}</p>
                <p className="text-sm text-slate-400">
                  {conn.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={conn.connected} />
              {conn.connected && (
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Connection
        </Button>
      </CardContent>
    </Card>
  );
}

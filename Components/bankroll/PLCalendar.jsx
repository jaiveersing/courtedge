import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';

export default function PLCalendar({ betData }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate calendar data - mock for now
  const generateCalendarData = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const profit = Math.floor(Math.random() * 400) - 100;
      days.push({
        day: i,
        profit,
        bets: Math.floor(Math.random() * 5) + 1,
        isPositive: profit > 0,
      });
    }
    return days;
  };

  const calendarData = generateCalendarData();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Profit/Loss Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-slate-400 pb-2">
              {day}
            </div>
          ))}
          
          {calendarData.map((data) => (
            <button
              key={data.day}
              onClick={() => setSelectedDate(data)}
              className={`
                aspect-square p-2 rounded text-sm font-semibold transition-all
                ${data.isPositive 
                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                  : data.profit < 0
                  ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                }
                ${selectedDate?.day === data.day ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <div className="text-xs mb-1">{data.day}</div>
              <div className="text-xs font-bold">
                {data.profit > 0 ? '+' : ''}{data.profit}
              </div>
            </button>
          ))}
        </div>

        {selectedDate && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">
              Day {selectedDate.day} Summary
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white">
                {selectedDate.bets} bet{selectedDate.bets !== 1 ? 's' : ''}
              </span>
              <Badge variant={selectedDate.isPositive ? 'default' : 'secondary'}>
                {selectedDate.profit > 0 ? '+' : ''}${selectedDate.profit}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


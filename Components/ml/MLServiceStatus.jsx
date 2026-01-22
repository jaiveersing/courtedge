import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import mlService from '../../src/api/mlService';

const MLServiceStatus = () => {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    metrics: null,
    lastCheck: null
  });

  const checkService = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const health = await mlService.healthCheck();
      
      if (health.success) {
        setStatus({
          connected: true,
          loading: false,
          error: null,
          metrics: health,
          lastCheck: new Date()
        });
      } else {
        setStatus({
          connected: false,
          loading: false,
          error: health.error,
          metrics: null,
          lastCheck: new Date()
        });
      }
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message,
        metrics: null,
        lastCheck: new Date()
      });
    }
  };

  useEffect(() => {
    checkService();
    const interval = setInterval(checkService, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const StatusIcon = () => {
    if (status.loading) return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
    if (status.connected) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const StatusBadge = () => {
    if (status.loading) return <Badge className="bg-blue-500">Checking...</Badge>;
    if (status.connected) return <Badge className="bg-green-500">Online</Badge>;
    return <Badge className="bg-red-500">Offline</Badge>;
  };

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-purple-500" />
            <CardTitle className="text-lg text-foreground">ML Service Status</CardTitle>
          </div>
          <StatusBadge />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <StatusIcon />
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {status.connected ? 'Connected to ML Service' : 'ML Service Unavailable'}
              </div>
              {status.lastCheck && (
                <div className="text-xs text-muted-foreground">
                  Last checked: {status.lastCheck.toLocaleTimeString()}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkService}
              disabled={status.loading}
            >
              <RefreshCw className={`w-4 h-4 ${status.loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Error Message */}
          {status.error && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-red-500 mb-1">Connection Error</div>
                <div className="text-sm text-foreground">{status.error}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Make sure the ML service is running on port 8000
                </div>
              </div>
            </div>
          )}

          {/* Service Metrics */}
          {status.connected && status.metrics && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className="text-sm font-semibold text-green-500">
                    {status.metrics.status || 'Healthy'}
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Version</div>
                  <div className="text-sm font-semibold text-foreground">
                    {status.metrics.version || '1.0.0'}
                  </div>
                </div>
              </div>

              {status.metrics.models_loaded && (
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Loaded Models</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(status.metrics.models_loaded).map(([model, loaded]) => (
                      <Badge
                        key={model}
                        variant={loaded ? 'default' : 'outline'}
                        className={loaded ? 'bg-green-500 text-white' : 'text-muted-foreground'}
                      >
                        {model.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {status.metrics.uptime && (
                <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                  <div className="text-sm font-semibold text-foreground">
                    {Math.floor(status.metrics.uptime / 3600)}h {Math.floor((status.metrics.uptime % 3600) / 60)}m
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {!status.connected && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Start ML Service:</div>
              <div className="p-3 bg-muted/50 rounded-lg space-y-2 border border-border">
                <div className="text-xs text-muted-foreground">Windows:</div>
                <code className="block text-xs bg-muted p-2 rounded text-foreground border border-border">
                  cd ml_service && start.bat
                </code>
                <div className="text-xs text-muted-foreground mt-2">Linux/Mac:</div>
                <code className="block text-xs bg-muted p-2 rounded text-foreground border border-border">
                  cd ml_service && ./start.sh
                </code>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MLServiceStatus;

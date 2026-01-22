import React from 'react';
import { Card } from './card';
import { Skeleton } from './skeleton';

/**
 * Skeleton loader for prop cards
 */
export const PropCardSkeleton = () => (
  <Card className="p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="w-12 h-6" />
    </div>
    
    <div className="space-y-2 mb-3">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </Card>
);

/**
 * Skeleton loader for player detail view
 */
export const PlayerDetailSkeleton = () => (
  <div className="p-6">
    <div className="flex items-center gap-4 mb-6">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="mt-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-40" />
    </div>
  </div>
);

/**
 * Skeleton loader for list of props
 */
export const PropListSkeleton = ({ count = 5 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <PropCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Skeleton loader for stats grid
 */
export const StatsGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <Card key={i} className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
    ))}
  </div>
);

/**
 * Skeleton loader for team matchup card
 */
export const TeamMatchupSkeleton = () => (
  <Card className="p-4">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="text-2xl font-bold text-muted-foreground">VS</div>
      <div className="flex items-center gap-3">
        <div className="space-y-2 text-right">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
    
    <Skeleton className="h-32" />
  </Card>
);

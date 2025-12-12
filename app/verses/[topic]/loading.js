/* Topic Page Loading - Loading state for topic pages
 * Created: Skeleton UI for better UX during page transitions
 */

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import VerseCardSkeleton from "@/components/VerseCardSkeleton";

export default function TopicLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6">
            <Skeleton className="h-4 w-12" />
            <span>/</span>
            <Skeleton className="h-4 w-16" />
            <span>/</span>
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="text-center">
            {/* Topic icon */}
            <Skeleton className="w-20 h-20 rounded-2xl mx-auto mb-6" />
            
            {/* Title */}
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            
            {/* Description */}
            <div className="space-y-2 max-w-2xl mx-auto mb-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>

            {/* Badges */}
            <div className="flex justify-center space-x-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Verses Grid Skeleton */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <VerseCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


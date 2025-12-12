/* AllTopicsSection - Complete topic listing component
 * Updated: Enhanced design with shadcn/ui and better organization
 */

import Link from "next/link";
import { getAllTopics, getTopicMetadata } from "@/lib/verses";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AllTopicsSection({ currentTopic = null }) {
  const allTopics = getAllTopics();

  return (
    <section className="py-16 bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            📖 Complete Collection
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All Bible Verse Topics
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our comprehensive collection of Bible verses organized by the
            topics that matter most in your spiritual journey.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allTopics.map((topic) => {
            const meta = getTopicMetadata(topic);
            const isCurrentTopic = currentTopic === topic;

            return (
              <Link
                key={topic}
                href={`/verses/${topic}`}
                className="group"
              >
                <Card
                  className={cn(
                    "h-full text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1",
                    isCurrentTopic
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="text-2xl mb-2 transition-transform group-hover:scale-110">
                      {meta.icon}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium capitalize block transition-colors",
                        isCurrentTopic
                          ? "text-primary"
                          : "group-hover:text-primary"
                      )}
                    >
                      {topic}
                    </span>
                    {isCurrentTopic && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Current
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

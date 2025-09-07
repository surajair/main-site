import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

function UsageAnalytics() {
  return (
    <section id="usage" className="space-y-4 pt-8">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h2 className=" font-semibold">Usage Analytics</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assets Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4 GB</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "48%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">48% of 5 GB limit</p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: "62%" }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">62% of 2,000 monthly limit</p>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.2K</div>
              <div className="text-xs text-muted-foreground mt-1">This month</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Usage Details</CardTitle>
            <CardDescription>Detailed breakdown of your resource consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Images & Media</span>
                <span className="text-sm font-medium">1.8 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Code & Assets</span>
                <span className="text-sm font-medium">0.6 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Content Generation</span>
                <span className="text-sm font-medium">847 requests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI Image Generation</span>
                <span className="text-sm font-medium">400 requests</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

UsageAnalytics.displayName = "UsageAnalytics";

export default UsageAnalytics;

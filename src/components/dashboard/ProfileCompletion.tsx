
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProfileCompletionItem {
  title: string;
  completed: boolean;
}

export const ProfileCompletion = () => {
  const profileCompletionItems: ProfileCompletionItem[] = [
    { title: "Personal Information", completed: true },
    { title: "Education Details", completed: true },
    { title: "Profile Photo", completed: true },
    { title: "Availability Schedule", completed: true },
    { title: "Areas of Expertise", completed: false },
    { title: "Verification Documents", completed: false },
  ];
  
  const completedItems = profileCompletionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedItems / profileCompletionItems.length) * 100);

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center">
          <CheckCircle className="mr-2 text-bridgeblue-500 h-5 w-5" />
          Profile Completion
        </CardTitle>
        <CardDescription>Complete your profile to attract more students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{completionPercentage}% complete</span>
            <span className="text-sm text-muted-foreground">{completedItems}/{profileCompletionItems.length} tasks</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          
          <div className="space-y-2 mt-4">
            {profileCompletionItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">+</span>
                  )}
                </div>
                <span className={item.completed ? 'text-gray-700' : 'text-gray-500'}>
                  {item.title}
                </span>
                {!item.completed && (
                  <Button variant="ghost" size="sm" className="ml-auto text-bridgeblue-500 hover:text-bridgeblue-600">
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

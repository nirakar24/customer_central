import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: number;
  name: string;
  avatarUrl: string;
  value: number;
  percentageOfTarget: number;
  growth: string;
}

interface TeamPerformanceProps {
  isLoading: boolean;
  data?: TeamMember[];
}

const TeamPerformance = ({ isLoading, data }: TeamPerformanceProps) => {
  // Format currency value to lakhs (L)
  const formatValue = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };
  
  // Mocked data when real data is not available
  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Alisha Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      value: 820000,
      percentageOfTarget: 85,
      growth: "12.4"
    },
    {
      id: 2,
      name: "Raj Mehta",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      value: 750000,
      percentageOfTarget: 75,
      growth: "8.3"
    },
    {
      id: 3,
      name: "Priya Singh",
      avatarUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      value: 610000,
      percentageOfTarget: 62,
      growth: "5.7"
    },
    {
      id: 4,
      name: "Arjun Kapoor",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      value: 420000,
      percentageOfTarget: 45,
      growth: "-2.1"
    }
  ];
  
  // Use mock data or real data
  const teamMembers = data || mockTeamMembers;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Team Performance</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <img 
                className="h-10 w-10 rounded-full" 
                src={member.avatarUrl} 
                alt={`${member.name}'s avatar`} 
              />
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        member.percentageOfTarget >= 75 ? "bg-green-500" : 
                        member.percentageOfTarget >= 50 ? "bg-blue-500" : "bg-amber-500"
                      }`} 
                      style={{ width: `${member.percentageOfTarget}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{member.percentageOfTarget}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                  {formatValue(member.value)}
                </p>
                <p className={`text-xs ${
                  parseFloat(member.growth) >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {parseFloat(member.growth) >= 0 ? "+" : ""}{member.growth}%
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-4 text-blue-500 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-400">
          View All Team Members
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamPerformance;

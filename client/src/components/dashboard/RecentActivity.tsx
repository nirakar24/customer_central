import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Activity {
  id: number;
  userId: number;
  activityType: string;
  description: string;
  createdAt: string;
}

interface User {
  id: number;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

interface RecentActivityProps {
  isLoading: boolean;
  activities?: Activity[];
}

const RecentActivity = ({ isLoading, activities: propActivities }: RecentActivityProps) => {
  const [users, setUsers] = useState<Record<number, User>>({});
  
  // Fetch users to display avatars and names
  const { data: usersData } = useQuery({
    queryKey: ['/api/users'],
    enabled: !isLoading && !!propActivities?.length,
  });
  
  useEffect(() => {
    if (usersData) {
      const usersMap: Record<number, User> = {};
      usersData.forEach((user: User) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    }
  }, [usersData]);
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Mocked data when real data is not available
  const mockActivities: Activity[] = [
    {
      id: 1,
      userId: 2,
      activityType: 'deal_closed',
      description: 'Closed a deal with TechSolutions Ltd. worth ₹2.4L',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: 2,
      userId: 1,
      activityType: 'proposal_created',
      description: 'Created a new proposal for GlobalTrade Inc.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
    },
    {
      id: 3,
      userId: 3,
      activityType: 'lead_added',
      description: 'Added Naveen Kumar as a new lead',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    {
      id: 4,
      userId: 4,
      activityType: 'demo_scheduled',
      description: 'Scheduled a demo with InnovateTech Solutions',
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString() // 30 hours ago
    },
    {
      id: 5,
      userId: 0,
      activityType: 'system_update',
      description: 'Updated the sales forecast for Q3',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    }
  ];
  
  // Use mock data or real data
  const activities = propActivities || mockActivities;
  
  // Mock users when real data is not available
  const mockUsers: Record<number, User> = {
    0: { id: 0, username: 'system', fullName: 'System', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    1: { id: 1, username: 'raj', fullName: 'Raj Mehta', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    2: { id: 2, username: 'alisha', fullName: 'Alisha Patel', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    3: { id: 3, username: 'priya', fullName: 'Priya Singh', avatarUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    4: { id: 4, username: 'arjun', fullName: 'Arjun Kapoor', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
  };
  
  // Use real users data or mock data
  const displayUsers = Object.keys(users).length > 0 ? users : mockUsers;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
          <div className="relative">
            {activities.map((activity) => (
              <div key={activity.id} className="ml-6 mb-6 timeline-item relative">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-8 w-8 rounded-full" 
                      src={displayUsers[activity.userId]?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                      alt="User avatar" 
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {displayUsers[activity.userId]?.fullName || displayUsers[activity.userId]?.username || 'Unknown User'}
                      </span>{' '}
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <style jsx>{`
          .timeline-item::before {
            content: '';
            position: absolute;
            left: -25px;
            top: 0;
            bottom: 0;
            width: 2px;
            background-color: #e2e8f0;
          }
          
          .dark .timeline-item::before {
            background-color: #334155;
          }
          
          .timeline-item::after {
            content: '';
            position: absolute;
            left: -29px;
            top: 8px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #3B82F6;
            z-index: 1;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

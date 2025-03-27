import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  status: "pending" | "completed";
  priority: "high" | "medium" | "low";
  assignedTo: number;
}

interface User {
  id: number;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

interface TasksCardProps {
  isLoading: boolean;
  tasks?: Task[];
}

// Mocked data when real data is not available
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Follow up with GlobalTrade Inc. about proposal",
    description: "Send additional information about implementation timeline and integration options",
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // +4 hours
    status: "pending",
    priority: "high",
    assignedTo: 1
  },
  {
    id: 2,
    title: "Prepare quarterly report for management review",
    description: "Compile Q3 performance metrics and sales forecasts",
    dueDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // +8 hours
    status: "pending",
    priority: "medium",
    assignedTo: 1
  },
  {
    id: 3,
    title: "Call Naveen Kumar to discuss requirements",
    description: "Schedule a demo for InsightSync Basic",
    dueDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // +1 hour
    status: "pending",
    priority: "medium",
    assignedTo: 3
  },
  {
    id: 4,
    title: "Update product catalog with new prices",
    description: "Apply the Q4 price adjustments to all products",
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday
    status: "completed",
    priority: "low",
    assignedTo: 2
  },
  {
    id: 5,
    title: "Schedule team meeting for next sprint planning",
    description: "Coordinate with all team leads for next week",
    dueDate: new Date(Date.now() + (24 * 60 * 60 * 1000) + (9 * 60 * 60 * 1000)).toISOString(), // tomorrow 9am
    status: "pending",
    priority: "low",
    assignedTo: 1
  }
];

// Mock users when real data is not available
const mockUsers: Record<number, User> = {
  1: { id: 1, username: 'raj', fullName: 'Raj Mehta', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  2: { id: 2, username: 'alisha', fullName: 'Alisha Patel', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  3: { id: 3, username: 'priya', fullName: 'Priya Singh', avatarUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  4: { id: 4, username: 'arjun', fullName: 'Arjun Kapoor', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' }
};

const TasksCard = ({ isLoading, tasks: propTasks }: TasksCardProps) => {
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  
  // Format date to display time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date relative to today
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Reset hours for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Toggle task completion
  const toggleTaskStatus = async (taskId: number, completed: boolean) => {
    // Update local state immediately for better UX
    setLocalTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: completed ? 'completed' : 'pending' } 
          : task
      )
    );
    
    try {
      // Update on the server
      await apiRequest('PUT', `/api/tasks/${taskId}`, {
        status: completed ? 'completed' : 'pending'
      });
      
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      
      toast({
        title: completed ? "Task completed" : "Task reopened",
        description: "Task status updated successfully",
      });
    } catch (error) {
      // Revert local state if server update fails
      setLocalTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: completed ? 'pending' : 'completed' } 
            : task
        )
      );
      
      toast({
        title: "Failed to update task",
        description: "There was an error updating the task status",
        variant: "destructive",
      });
    }
  };
  
  // Initialize local tasks when props change using useEffect
  useEffect(() => {
    if (propTasks && propTasks.length > 0) {
      setLocalTasks(propTasks);
    }
  }, [propTasks]);
  
  // Use mock data or real data - with useMemo to prevent recalculations
  const tasks = useMemo(() => {
    return localTasks.length > 0 ? localTasks : (propTasks || mockTasks);
  }, [localTasks, propTasks]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Today's Tasks</CardTitle>
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
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Today's Tasks</CardTitle>
        <Button variant="ghost" size="icon" className="text-blue-500">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex-shrink-0">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.status === 'completed'}
                  onCheckedChange={(checked) => toggleTaskStatus(task.id, !!checked)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className={`text-sm font-medium ${
                  task.status === 'completed' 
                    ? "text-gray-500 dark:text-gray-400 line-through" 
                    : "text-gray-900 dark:text-white"
                }`}>
                  {task.title}
                </p>
                <div className="mt-1 flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.status === 'completed' ? 'Completed' : `${formatDate(task.dueDate)}, ${formatTime(task.dueDate)}`}
                  </span>
                  <span className="mx-2 text-gray-300 dark:text-gray-700">|</span>
                  <span className={`text-xs font-medium ${
                    task.status === 'completed' 
                      ? "text-gray-500" 
                      : task.priority === 'high' 
                        ? "text-blue-500" 
                        : task.priority === 'medium' 
                          ? "text-amber-500" 
                          : "text-gray-500"
                  }`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <img 
                  className="h-6 w-6 rounded-full" 
                  src={mockUsers[task.assignedTo]?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                  alt="Assigned to" 
                  title={mockUsers[task.assignedTo]?.fullName || mockUsers[task.assignedTo]?.username || 'Unknown User'}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksCard;

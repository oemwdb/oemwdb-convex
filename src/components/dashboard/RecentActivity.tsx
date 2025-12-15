
import React from "react";
import ActivityItem from "./ActivityItem";
import { BarChart, Calendar, Users, Settings } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    {
      title: "New customer registered",
      description: "Jane Cooper has created an account",
      timestamp: "2 hours ago",
      icon: <Users size={18} />,
      iconColor: "bg-green-100 text-green-600"
    },
    {
      title: "Meeting scheduled",
      description: "Project review with the team",
      timestamp: "Yesterday",
      icon: <Calendar size={18} />,
      iconColor: "bg-blue-100 text-blue-600"
    },
    {
      title: "Monthly report ready",
      description: "April 2023 performance metrics",
      timestamp: "2 days ago",
      icon: <BarChart size={18} />,
      iconColor: "bg-purple-100 text-purple-600"
    },
    {
      title: "Settings updated",
      description: "Security settings have been changed",
      timestamp: "5 days ago",
      icon: <Settings size={18} />,
      iconColor: "bg-amber-100 text-amber-600"
    }
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">Recent Activity</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {activities.map((activity, index) => (
          <div className="px-5" key={index}>
            <ActivityItem 
              title={activity.title}
              description={activity.description}
              timestamp={activity.timestamp}
              icon={activity.icon}
              iconColor={activity.iconColor}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

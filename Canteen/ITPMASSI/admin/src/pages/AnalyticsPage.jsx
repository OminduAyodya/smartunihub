import { useEffect, useState } from "react";
import { FiActivity, FiTrendingUp } from "react-icons/fi";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    approvalRate: 0,
    avgResponseTime: "2.5 hours",
    platformActivity: [
      { week: "Week 1", events: 12, approvals: 10 },
      { week: "Week 2", events: 15, approvals: 13 },
      { week: "Week 3", events: 18, approvals: 16 },
      { week: "Week 4", events: 22, approvals: 19 },
    ],
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="panel-glass p-6 border border-slate-700/50">
        <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-slate-300 mt-2">
          Platform statistics and performance metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="panel-glass p-6 border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Events</p>
              <p className="text-4xl font-bold text-white mt-2">{analytics.totalEvents}</p>
            </div>
            <FiActivity className="text-3xl text-blue-400 opacity-50" />
          </div>
        </div>

        <div className="panel-glass p-6 border border-green-500/30 bg-green-500/5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Approval Rate</p>
              <p className="text-4xl font-bold text-green-400 mt-2">{analytics.approvalRate}%</p>
            </div>
            <FiTrendingUp className="text-3xl text-green-400 opacity-50" />
          </div>
        </div>

        <div className="panel-glass p-6 border border-purple-500/30 bg-purple-500/5">
          <p className="text-sm text-slate-400">Avg Response Time</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">{analytics.avgResponseTime}</p>
        </div>
      </div>

      <div className="panel-glass p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-6">Weekly Platform Activity</h3>
        
        <div className="space-y-4">
          {analytics.platformActivity.map((week, idx) => {
            const maxValue = Math.max(...analytics.platformActivity.map((w) => w.events));
            const eventWidth = (week.events / maxValue) * 100;
            const approvalWidth = (week.approvals / maxValue) * 100;

            return (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">{week.week}</span>
                  <span className="text-slate-400 text-sm">
                    {week.approvals}/{week.events} approved
                  </span>
                </div>
                <div className="relative h-8 bg-slate-800/50 rounded-lg overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500/30 transition-all"
                    style={{ width: `${eventWidth}%` }}
                  />
                  <div
                    className="absolute h-full bg-green-500/60 transition-all"
                    style={{ width: `${approvalWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel-glass p-6 border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Top Event Organizers</h3>
          <div className="space-y-3">
            {[
              { name: "Ayesha Perera", events: 5 },
              { name: "Kavindu Silva", events: 3 },
              { name: "Nimal Fernando", events: 2 },
            ].map((organizer, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300">{organizer.name}</span>
                <span className="text-white font-semibold bg-slate-800/50 px-3 py-1 rounded-lg">
                  {organizer.events} events
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-glass p-6 border border-slate-700/50">
          <h3 className="text-lg font-bold text-white mb-4">System Health</h3>
          <div className="space-y-3">
            {[
              { metric: "Database Performance", status: "Optimal" },
              { metric: "API Response Time", status: "Fast" },
              { metric: "User Concurrent Sessions", status: "Normal" },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-slate-300">{item.metric}</span>
                <span className="text-emerald-400 font-semibold text-sm">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;

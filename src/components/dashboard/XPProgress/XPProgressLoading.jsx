const XPProgressLoading = () => {
  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl flex-shrink-0"></div>
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-end">
            <div className="space-y-2 w-full">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2"></div>
            </div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-24"></div>
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-full"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-16"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-16"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-lg w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XPProgressLoading;

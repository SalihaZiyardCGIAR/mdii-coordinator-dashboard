interface DashboardHeaderProps {
  coordinatorEmail: string;
}

export const DashboardHeader = ({ coordinatorEmail }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! You look nice today to work on digital inclusiveness 😎
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">Administrator</p>
        <p className="text-sm font-medium">{coordinatorEmail}</p>
      </div>
    </div>
  );
};
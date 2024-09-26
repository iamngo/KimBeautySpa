import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="stat-card">
          <h3>70%</h3>
          <p>Sales</p>
          <span>$25,970</span>
        </div>
        <div className="stat-card">
          <h3>80%</h3>
          <p>Revenue</p>
          <span>$14,270</span>
        </div>
        <div className="stat-card">
          <h3>60%</h3>
          <p>Expense</p>
          <span>$4,270</span>
        </div>
      </div>

      <div className="chart-section">
        <h2>Thống kê dịch vụ</h2>
        <div className="chart">[Service Chart]</div>
        <h2>Thống kê sản phẩm</h2>
        <div className="chart">[Product Chart]</div>
        <h2>Thống kê doanh thu</h2>
        <div className="chart">[Revenue Chart]</div>
      </div>
    </div>
  );
};

export default Dashboard;

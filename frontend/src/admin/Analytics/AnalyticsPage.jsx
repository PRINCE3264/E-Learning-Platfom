import React, { useState } from 'react';

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Sample data
  const analyticsData = {
    overview: {
      totalRevenue: 125400,
      totalStudents: 8450,
      totalCourses: 156,
      totalInstructors: 45,
      activeUsers: 3850,
      completionRate: 78,
      avgRating: 4.82,
      engagementRate: 64
    },
    growth: {
      revenueGrowth: 24,
      studentGrowth: 18,
      courseGrowth: 12,
      engagementGrowth: 8
    },
    charts: {
      revenue: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 30000, 38000, 42000, 45000],
      students: [1200, 1500, 1800, 2200, 2500, 2800, 3200, 3800, 4200, 4800, 5200, 5800],
      courses: [85, 92, 98, 105, 112, 120, 128, 136, 142, 148, 152, 156],
      engagement: [55, 58, 62, 65, 68, 70, 72, 71, 69, 66, 65, 64]
    },
    topCourses: [
      { id: 1, name: 'Advanced React Development', students: 2450, revenue: 24500, rating: 4.9 },
      { id: 2, name: 'Machine Learning Fundamentals', students: 1980, revenue: 29700, rating: 4.8 },
      { id: 3, name: 'Full Stack Web Development', students: 1850, revenue: 27750, rating: 4.7 },
      { id: 4, name: 'Data Science Bootcamp', students: 1620, revenue: 32400, rating: 4.85 },
      { id: 5, name: 'UI/UX Design Masterclass', students: 1480, revenue: 22200, rating: 4.9 }
    ],
    topInstructors: [
      { id: 1, name: 'Dr. Sarah Johnson', students: 3120, courses: 15, rating: 4.95 },
      { id: 2, name: 'Prof. Michael Chen', students: 2780, courses: 12, rating: 4.9 },
      { id: 3, name: 'Dr. Emma Wilson', students: 2450, courses: 14, rating: 4.92 },
      { id: 4, name: 'Prof. David Brown', students: 1980, courses: 10, rating: 4.88 },
      { id: 5, name: 'Dr. Lisa Wang', students: 1750, courses: 9, rating: 4.86 }
    ],
    recentActivities: [
      { id: 1, type: 'enrollment', description: '50 new students enrolled in ML Course', time: '2 hours ago', change: '+12%' },
      { id: 2, type: 'purchase', description: 'Premium subscription purchased by 23 users', time: '4 hours ago', change: '+8%' },
      { id: 3, type: 'completion', description: 'Course completion rate increased to 78%', time: '6 hours ago', change: '+5%' },
      { id: 4, type: 'rating', description: 'Average platform rating improved to 4.82', time: '1 day ago', change: '+0.2' },
      { id: 5, type: 'course', description: 'New course "AI Fundamentals" published', time: '2 days ago', change: '+1' }
    ],
    geographicData: [
      { country: 'USA', students: 2450, revenue: 45000 },
      { country: 'India', students: 1850, revenue: 28000 },
      { country: 'UK', students: 1200, revenue: 22000 },
      { country: 'Germany', students: 980, revenue: 18000 },
      { country: 'Canada', students: 750, revenue: 15000 },
      { country: 'Australia', students: 620, revenue: 12000 }
    ],
    deviceUsage: [
      { device: 'Desktop', percentage: 45, users: 3802 },
      { device: 'Mobile', percentage: 38, users: 3211 },
      { device: 'Tablet', percentage: 17, users: 1437 }
    ]
  };

  const getMetricColor = (metric) => {
    const colors = {
      revenue: '#667eea',
      students: '#43e97b',
      courses: '#f093fb',
      engagement: '#4facfe',
      rating: '#f6ad55'
    };
    return colors[metric] || '#667eea';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  const calculatePercentage = (current, previous) => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  const renderChart = (data, metric, color) => {
    const maxValue = Math.max(...data);
    return (
      <div style={styles.chartContainer}>
        <div style={styles.chartBars}>
          {data.map((value, index) => {
            const height = (value / maxValue) * 100;
            return (
              <div key={index} style={styles.chartBarContainer}>
                <div
                  style={{
                    ...styles.chartBar,
                    height: `${height}%`,
                    background: `linear-gradient(to top, ${color}, ${color}90)`,
                    opacity: selectedMetric === 'all' || selectedMetric === metric ? 1 : 0.3
                  }}
                  title={`${metric}: ${value}`}
                />
                <div style={styles.chartLabel}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPieChart = (data, title) => {
    let total = data.reduce((sum, item) => sum + item.percentage, 0);
    let accumulated = 0;
    
    return (
      <div style={styles.pieChartContainer}>
        <div style={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = (item.percentage / total) * 100;
            const rotation = accumulated;
            accumulated += percentage;
            
            const colors = ['#667eea', '#43e97b', '#f093fb', '#4facfe', '#f6ad55'];
            
            return (
              <div
                key={index}
                style={{
                  ...styles.pieSlice,
                  background: colors[index % colors.length],
                  clipPath: `conic-gradient(${colors[index % colors.length]} 0% ${percentage}%, transparent ${percentage}% 100%)`,
                  transform: `rotate(${rotation * 3.6}deg)`
                }}
              />
            );
          })}
          <div style={styles.pieCenter}>
            <span style={styles.pieCenterText}>Total</span>
            <span style={styles.pieCenterValue}>{total}%</span>
          </div>
        </div>
        <div style={styles.pieLegend}>
          {data.map((item, index) => {
            const colors = ['#667eea', '#43e97b', '#f093fb', '#4facfe', '#f6ad55'];
            return (
              <div key={index} style={styles.legendItem}>
                <div style={{...styles.legendColor, background: colors[index % colors.length]}} />
                <span style={styles.legendLabel}>{item.device || item.country}</span>
                <span style={styles.legendValue}>{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📊</span>
            Analytics Dashboard
          </h1>
          <p style={styles.subtitle}>Monitor your platform performance and growth metrics</p>
        </div>
        <div style={styles.headerControls}>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            style={styles.dateSelect}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 365 Days</option>
          </select>
          <button style={styles.exportButton}>
            <span>📥</span> Export Report
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={styles.tabContainer}>
        {['overview', 'revenue', 'students', 'courses', 'engagement'].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.tabButtonActive : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            <span style={styles.tabIcon}>
              {tab === 'overview' && '📈'}
              {tab === 'revenue' && '💰'}
              {tab === 'students' && '👥'}
              {tab === 'courses' && '📚'}
              {tab === 'engagement' && '🔥'}
            </span>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Metric Filter */}
      <div style={styles.metricFilter}>
        <div style={styles.filterLabel}>Show Metrics:</div>
        {['all', 'revenue', 'students', 'courses', 'engagement'].map((metric) => (
          <button
            key={metric}
            style={{
              ...styles.metricButton,
              ...(selectedMetric === metric ? { 
                background: getMetricColor(metric),
                color: 'white'
              } : {})
            }}
            onClick={() => setSelectedMetric(metric)}
          >
            {metric === 'all' ? 'All Metrics' : metric.charAt(0).toUpperCase() + metric.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <span>💰</span>
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{formatNumber(analyticsData.overview.totalRevenue)}</h3>
            <p style={styles.statLabel}>Total Revenue</p>
            <div style={styles.statTrend}>
              <span style={{...styles.trendIndicator, color: analyticsData.growth.revenueGrowth > 0 ? '#10b981' : '#ef4444'}}>
                {analyticsData.growth.revenueGrowth > 0 ? '↑' : '↓'} {Math.abs(analyticsData.growth.revenueGrowth)}%
              </span>
              <span style={styles.trendText}> vs last period</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
            <span>👥</span>
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{analyticsData.overview.totalStudents.toLocaleString()}</h3>
            <p style={styles.statLabel}>Total Students</p>
            <div style={styles.statTrend}>
              <span style={{...styles.trendIndicator, color: analyticsData.growth.studentGrowth > 0 ? '#10b981' : '#ef4444'}}>
                {analyticsData.growth.studentGrowth > 0 ? '↑' : '↓'} {Math.abs(analyticsData.growth.studentGrowth)}%
              </span>
              <span style={styles.trendText}> vs last period</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <span>📚</span>
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{analyticsData.overview.totalCourses}</h3>
            <p style={styles.statLabel}>Total Courses</p>
            <div style={styles.statTrend}>
              <span style={{...styles.trendIndicator, color: analyticsData.growth.courseGrowth > 0 ? '#10b981' : '#ef4444'}}>
                {analyticsData.growth.courseGrowth > 0 ? '↑' : '↓'} {Math.abs(analyticsData.growth.courseGrowth)}%
              </span>
              <span style={styles.trendText}> vs last period</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <span>🔥</span>
          </div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{analyticsData.overview.engagementRate}%</h3>
            <p style={styles.statLabel}>Engagement Rate</p>
            <div style={styles.statTrend}>
              <span style={{...styles.trendIndicator, color: analyticsData.growth.engagementGrowth > 0 ? '#10b981' : '#ef4444'}}>
                {analyticsData.growth.engagementGrowth > 0 ? '↑' : '↓'} {Math.abs(analyticsData.growth.engagementGrowth)}%
              </span>
              <span style={styles.trendText}> vs last period</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div style={styles.mainGrid}>
        {/* Revenue Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Revenue Overview</h3>
            <div style={styles.chartMetrics}>
              <span style={{...styles.metricDot, background: '#667eea'}} />
              <span style={styles.metricLabel}>Monthly Revenue</span>
            </div>
          </div>
          {renderChart(analyticsData.charts.revenue, 'revenue', '#667eea')}
          <div style={styles.chartSummary}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Current Month:</span>
              <span style={styles.summaryValue}>{formatNumber(analyticsData.charts.revenue[analyticsData.charts.revenue.length - 1])}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Growth:</span>
              <span style={{...styles.summaryValue, color: '#10b981'}}>
                ↑ {calculatePercentage(
                  analyticsData.charts.revenue[analyticsData.charts.revenue.length - 1],
                  analyticsData.charts.revenue[analyticsData.charts.revenue.length - 2]
                )}%
              </span>
            </div>
          </div>
        </div>

        {/* Students Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Student Growth</h3>
            <div style={styles.chartMetrics}>
              <span style={{...styles.metricDot, background: '#43e97b'}} />
              <span style={styles.metricLabel}>New Students</span>
            </div>
          </div>
          {renderChart(analyticsData.charts.students, 'students', '#43e97b')}
          <div style={styles.chartSummary}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Students:</span>
              <span style={styles.summaryValue}>{analyticsData.overview.totalStudents.toLocaleString()}</span>
            </div>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Monthly Growth:</span>
              <span style={{...styles.summaryValue, color: '#10b981'}}>↑ {analyticsData.growth.studentGrowth}%</span>
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>Top Performing Courses</h3>
            <button style={styles.viewAllButton}>View All →</button>
          </div>
          <div style={styles.listContent}>
            {analyticsData.topCourses.map((course) => (
              <div key={course.id} style={styles.listItem}>
                <div style={styles.itemMain}>
                  <span style={styles.itemIndex}>{course.id}</span>
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemTitle}>{course.name}</h4>
                    <div style={styles.itemMeta}>
                      <span style={styles.itemMetaItem}>👥 {course.students.toLocaleString()} students</span>
                      <span style={styles.itemMetaItem}>⭐ {course.rating}</span>
                    </div>
                  </div>
                </div>
                <div style={styles.itemValue}>
                  <span style={styles.valueAmount}>{formatNumber(course.revenue)}</span>
                  <span style={styles.valueLabel}>Revenue</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Usage Pie Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Device Usage Distribution</h3>
          </div>
          {renderPieChart(analyticsData.deviceUsage, 'Device Usage')}
          <div style={styles.chartSummary}>
            <div style={styles.summaryItem}>
              <span style={styles.summaryLabel}>Total Users:</span>
              <span style={styles.summaryValue}>{analyticsData.overview.activeUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>Recent Activities</h3>
            <span style={styles.activityBadge}>Live</span>
          </div>
          <div style={styles.listContent}>
            {analyticsData.recentActivities.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  {activity.type === 'enrollment' && '👥'}
                  {activity.type === 'purchase' && '💰'}
                  {activity.type === 'completion' && '✅'}
                  {activity.type === 'rating' && '⭐'}
                  {activity.type === 'course' && '📚'}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>{activity.description}</p>
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
                <span style={{
                  ...styles.activityChange,
                  color: activity.change.startsWith('+') ? '#10b981' : '#ef4444'
                }}>
                  {activity.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Geographic Distribution</h3>
          </div>
          <div style={styles.geoList}>
            {analyticsData.geographicData.map((item) => (
              <div key={item.country} style={styles.geoItem}>
                <div style={styles.geoHeader}>
                  <span style={styles.geoFlag}>🌍</span>
                  <span style={styles.geoCountry}>{item.country}</span>
                  <span style={styles.geoPercentage}>
                    {Math.round((item.students / analyticsData.overview.totalStudents) * 100)}%
                  </span>
                </div>
                <div style={styles.geoBarContainer}>
                  <div 
                    style={{
                      ...styles.geoBar,
                      width: `${(item.students / analyticsData.overview.totalStudents) * 100}%`,
                      background: `linear-gradient(to right, #667eea, #764ba2)`
                    }}
                  />
                </div>
                <div style={styles.geoStats}>
                  <span style={styles.geoStat}>
                    👥 {item.students.toLocaleString()} students
                  </span>
                  <span style={styles.geoStat}>
                    💰 {formatNumber(item.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={styles.performanceGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h4 style={styles.metricTitle}>Course Completion Rate</h4>
            <span style={styles.metricValue}>{analyticsData.overview.completionRate}%</span>
          </div>
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${analyticsData.overview.completionRate}%`,
                background: 'linear-gradient(to right, #43e97b, #38f9d7)'
              }}
            />
          </div>
          <div style={styles.metricTrend}>
            <span style={{color: '#10b981'}}>↑ 5%</span> from last month
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h4 style={styles.metricTitle}>Average Rating</h4>
            <span style={styles.metricValue}>{analyticsData.overview.avgRating}</span>
          </div>
          <div style={styles.ratingStars}>
            {'★'.repeat(Math.floor(analyticsData.overview.avgRating))}
            {'☆'.repeat(5 - Math.floor(analyticsData.overview.avgRating))}
          </div>
          <div style={styles.metricTrend}>
            <span style={{color: '#10b981'}}>↑ 0.2</span> from last month
          </div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <h4 style={styles.metricTitle}>Active Users</h4>
            <span style={styles.metricValue}>{analyticsData.overview.activeUsers.toLocaleString()}</span>
          </div>
          <div style={styles.progressContainer}>
            <div 
              style={{
                ...styles.progressBar,
                width: `${(analyticsData.overview.activeUsers / analyticsData.overview.totalStudents) * 100}%`,
                background: 'linear-gradient(to right, #f093fb, #f5576c)'
              }}
            />
          </div>
          <div style={styles.metricTrend}>
            <span style={{color: '#10b981'}}>↑ 12%</span> from last month
          </div>
        </div>
      </div>

      {/* Footer Summary */}
      <div style={styles.footerSummary}>
        <div style={styles.summaryCard}>
          <h4 style={styles.summaryTitle}>📈 Performance Summary</h4>
          <p style={styles.summaryText}>
            Platform is showing strong growth with {analyticsData.growth.revenueGrowth}% revenue increase, 
            {analyticsData.growth.studentGrowth}% student growth, and {analyticsData.growth.courseGrowth}% course expansion 
            over the last period. Engagement rates remain high at {analyticsData.overview.engagementRate}%.
          </p>
          <div style={styles.summaryActions}>
            <button style={styles.actionButton}>
              <span>📊</span> Detailed Report
            </button>
            <button style={styles.actionButton}>
              <span>🎯</span> Set Goals
            </button>
            <button style={styles.actionButton}>
              <span>🔔</span> Set Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// All styles in one object
const styles = {
  container: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleIcon: {
    fontSize: '36px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dateSelect: {
    padding: '10px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    minWidth: '160px',
  },
  exportButton: {
    padding: '10px 20px',
    backgroundColor: '#1e293b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '12px 24px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
    transition: 'all 0.2s',
  },
  tabButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white',
  },
  tabIcon: {
    fontSize: '16px',
  },
  metricFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  metricButton: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0 0 8px 0',
  },
  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  trendIndicator: {
    fontSize: '13px',
    fontWeight: '600',
  },
  trendText: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  listCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  chartMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metricDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  metricLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  chartContainer: {
    height: '200px',
    marginBottom: '20px',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    padding: '0 10px',
  },
  chartBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    flex: 1,
  },
  chartBar: {
    width: '20px',
    borderRadius: '4px 4px 0 0',
    transition: 'opacity 0.2s',
    marginBottom: '8px',
  },
  chartLabel: {
    fontSize: '11px',
    color: '#64748b',
    transform: 'rotate(-45deg)',
    marginTop: '5px',
  },
  chartSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '15px',
    borderTop: '1px solid #e2e8f0',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    color: '#64748b',
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  listTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  viewAllButton: {
    fontSize: '13px',
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
  },
  activityBadge: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  listContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  itemMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  itemIndex: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
    minWidth: '20px',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  itemMeta: {
    display: 'flex',
    gap: '12px',
  },
  itemMetaItem: {
    fontSize: '12px',
    color: '#64748b',
  },
  itemValue: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  valueLabel: {
    fontSize: '11px',
    color: '#64748b',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  activityIcon: {
    fontSize: '20px',
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: '14px',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },
  activityTime: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  activityChange: {
    fontSize: '14px',
    fontWeight: '600',
  },
  pieChartContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    justifyContent: 'center',
    height: '200px',
    marginBottom: '20px',
  },
  pieChart: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    position: 'relative',
    background: 'conic-gradient(#e2e8f0 0% 100%)',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  pieCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterText: {
    fontSize: '12px',
    color: '#64748b',
  },
  pieCenterValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pieLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
  },
  legendLabel: {
    fontSize: '13px',
    color: '#475569',
    minWidth: '80px',
  },
  legendValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1e293b',
  },
  geoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px',
  },
  geoItem: {
    padding: '12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
  },
  geoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  geoFlag: {
    fontSize: '16px',
  },
  geoCountry: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  geoPercentage: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
  },
  geoBarContainer: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  geoBar: {
    height: '100%',
    borderRadius: '4px',
  },
  geoStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b',
  },
  geoStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  performanceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  metricHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  metricTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  progressContainer: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  ratingStars: {
    fontSize: '24px',
    color: '#fbbf24',
    marginBottom: '12px',
  },
  metricTrend: {
    fontSize: '13px',
    color: '#64748b',
  },
  footerSummary: {
    marginTop: '30px',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  summaryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryText: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.6',
    margin: '0 0 24px 0',
  },
  summaryActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    transition: 'all 0.2s',
  },
};

export default AnalyticsPage;
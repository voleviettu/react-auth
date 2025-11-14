import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/apiClient';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch protected data using React Query
  const {
    data: protectedData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['protectedData'],
    queryFn: async () => {
      const response = await apiClient.get('/data/protected');
      return response.data;
    },
    enabled: !!user, // Only run query if user is authenticated
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <svg
              className="logout-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* User Information Card */}
        <div className="info-card">
          <h2 className="card-title">User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="role-badge">{user?.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Protected Data Card */}
        <div className="data-card">
          <div className="card-header">
            <h2 className="card-title">Protected Data</h2>
            <button onClick={() => refetch()} className="refresh-button">
              <svg
                className="refresh-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {isLoading && (
            <div className="loading-state">
              <div className="spinner-large"></div>
              <p>Loading protected data...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <svg
                className="error-icon-large"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="error-message-large">
                Failed to load protected data
              </p>
              <button onClick={() => refetch()} className="retry-button">
                Try Again
              </button>
            </div>
          )}

          {protectedData && !isLoading && !error && (
            <div className="data-content">
              <p className="data-message">{protectedData.message}</p>
              <div className="data-list">
                {protectedData.data.map((item) => (
                  <div key={item.id} className="data-item">
                    <div className="data-item-header">
                      <h3 className="data-item-title">{item.title}</h3>
                      <span className="data-item-id">#{item.id}</span>
                    </div>
                    <p className="data-item-description">{item.description}</p>
                  </div>
                ))}
              </div>
              <p className="data-timestamp">
                Last updated: {new Date(protectedData.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Token Info Card */}
        <div className="info-card">
          <h2 className="card-title">Authentication Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator success"></div>
              <div>
                <p className="status-label">Access Token</p>
                <p className="status-value">Active in memory</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator success"></div>
              <div>
                <p className="status-label">Refresh Token</p>
                <p className="status-value">Stored in localStorage</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator success"></div>
              <div>
                <p className="status-label">Session</p>
                <p className="status-value">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

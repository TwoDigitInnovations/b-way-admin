// QuickSight helper functions and utilities

export const DASHBOARD_TYPES = {
  OPERATIONS: 'operations',
  FINANCIAL: 'financial',
  LOGISTICS: 'logistics',
  COMPLIANCE: 'compliance',
  CLIENT: 'client',
  HOSPITAL: 'hospital',
  CLINIC: 'clinic'
};

export const USER_ROLE_DASHBOARDS = {
  ADMIN: [
    DASHBOARD_TYPES.OPERATIONS,
    DASHBOARD_TYPES.FINANCIAL,
    DASHBOARD_TYPES.LOGISTICS,
    DASHBOARD_TYPES.COMPLIANCE
  ],
  DISPATCHER: [
    DASHBOARD_TYPES.OPERATIONS,
    DASHBOARD_TYPES.LOGISTICS
  ],
  CLIENT: [
    DASHBOARD_TYPES.CLIENT
  ],
  HOSPITAL: [
    DASHBOARD_TYPES.HOSPITAL
  ],
  CLINIC: [
    DASHBOARD_TYPES.CLINIC
  ]
};

export const getDashboardsForRole = (userRole) => {
  return USER_ROLE_DASHBOARDS[userRole] || USER_ROLE_DASHBOARDS.CLIENT;
};

export const getDashboardConfig = (dashboardType) => {
  const configs = {
    [DASHBOARD_TYPES.OPERATIONS]: {
      name: 'Operations Dashboard',
      description: 'Real-time operational metrics and KPIs',
      icon: '📊',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_OPERATIONS_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.FINANCIAL]: {
      name: 'Financial Analytics',
      description: 'Revenue, costs, and financial performance',
      icon: '💰',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_FINANCIAL_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.LOGISTICS]: {
      name: 'Logistics Performance',
      description: 'Delivery metrics, route optimization, and driver performance',
      icon: '🚚',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_LOGISTICS_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.COMPLIANCE]: {
      name: 'Compliance & Safety',
      description: 'HIPAA compliance, safety metrics, and audit reports',
      icon: '🛡️',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_COMPLIANCE_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.CLIENT]: {
      name: 'Client Dashboard',
      description: 'Your orders, deliveries, and service metrics',
      icon: '📦',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_CLIENT_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.HOSPITAL]: {
      name: 'Hospital Dashboard',
      description: 'Medical deliveries, compliance, and facility metrics',
      icon: '🏥',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_HOSPITAL_DASHBOARD_ID'
    },
    [DASHBOARD_TYPES.CLINIC]: {
      name: 'Clinic Dashboard',
      description: 'Clinic deliveries and service metrics',
      icon: '🏥',
      envKey: 'NEXT_PUBLIC_QUICKSIGHT_CLINIC_DASHBOARD_ID'
    }
  };

  return configs[dashboardType];
};

export const getEmbedUrl = async (dashboardType, options = {}) => {
  try {
    const config = getDashboardConfig(dashboardType);
    if (!config) {
      throw new Error(`Invalid dashboard type: ${dashboardType}`);
    }

    const dashboardId = process.env[config.envKey];
    if (!dashboardId) {
      throw new Error(`Dashboard ID not configured for ${dashboardType}`);
    }

    const response = await fetch('/api/quicksight/embed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        type: 'dashboard',
        resourceId: dashboardId,
        ...options
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get embed URL: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting QuickSight embed URL:', error);
    throw error;
  }
};

export const refreshDashboard = (dashboardRef) => {
  if (dashboardRef && dashboardRef.current) {
    try {
      dashboardRef.current.refresh();
    } catch (error) {
      console.warn('Could not refresh dashboard:', error);
    }
  }
};

export const exportDashboard = async (dashboardRef, format = 'PDF') => {
  if (dashboardRef && dashboardRef.current) {
    try {
      const result = await dashboardRef.current.exportToPDF();
      return result;
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
  throw new Error('Dashboard reference not available');
};

export const isQuickSightConfigured = () => {
  const requiredVars = [
    'AWS_REGION',
    'AWS_ACCOUNT_ID'
  ];

  return requiredVars.every(varName => 
    process.env[varName] && process.env[varName].trim() !== ''
  );
};

export const validateDashboardAccess = (userRole, dashboardType) => {
  const allowedDashboards = getDashboardsForRole(userRole);
  return allowedDashboards.includes(dashboardType);
};

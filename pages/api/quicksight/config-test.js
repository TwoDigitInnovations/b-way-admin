// Test endpoint to check QuickSight configuration
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  const config = {
    AWS_REGION: process.env.AWS_REGION || 'Not set',
    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID || 'Not set',
    QUICKSIGHT_NAMESPACE: process.env.QUICKSIGHT_NAMESPACE || 'Not set',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 
      (process.env.AWS_ACCESS_KEY_ID.startsWith('your-') ? 'Placeholder value' : 'Configured') : 'Not set',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? 
      (process.env.AWS_SECRET_ACCESS_KEY.startsWith('your-') ? 'Placeholder value' : 'Configured') : 'Not set',
  };

  // Check dashboard IDs
  const dashboards = {
    OPERATIONS: process.env.NEXT_PUBLIC_QUICKSIGHT_OPERATIONS_DASHBOARD_ID || 'Not set',
    FINANCIAL: process.env.NEXT_PUBLIC_QUICKSIGHT_FINANCIAL_DASHBOARD_ID || 'Not set',
    LOGISTICS: process.env.NEXT_PUBLIC_QUICKSIGHT_LOGISTICS_DASHBOARD_ID || 'Not set',
    COMPLIANCE: process.env.NEXT_PUBLIC_QUICKSIGHT_COMPLIANCE_DASHBOARD_ID || 'Not set',
    CLIENT: process.env.NEXT_PUBLIC_QUICKSIGHT_CLIENT_DASHBOARD_ID || 'Not set',
    HOSPITAL: process.env.NEXT_PUBLIC_QUICKSIGHT_HOSPITAL_DASHBOARD_ID || 'Not set',
    CLINIC: process.env.NEXT_PUBLIC_QUICKSIGHT_CLINIC_DASHBOARD_ID || 'Not set',
  };

  // Check if configuration is valid
  function isConfigurationValid() {
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
    const accountId = process.env.AWS_ACCOUNT_ID;
    
    return accessKey && 
           secretKey && 
           accountId &&
           !accessKey.includes('your-') && 
           !secretKey.includes('your-') &&
           accessKey !== 'your-access-key' &&
           secretKey !== 'your-secret-key';
  }

  const status = {
    isConfigured: isConfigurationValid(),
    configurationValid: isConfigurationValid(),
    missingCredentials: !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY,
    placeholderCredentials: (process.env.AWS_ACCESS_KEY_ID || '').includes('your-') || 
                           (process.env.AWS_SECRET_ACCESS_KEY || '').includes('your-'),
  };

  res.status(200).json({
    status: 'QuickSight Configuration Check',
    timestamp: new Date().toISOString(),
    config,
    dashboards,
    status,
    recommendations: status.isConfigured ? 
      ['Configuration looks good! You can now test the embed functionality.'] : 
      [
        'Replace placeholder AWS credentials with real values',
        'Ensure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are properly set',
        'Verify AWS account has QuickSight enabled',
        'Create QuickSight dashboards and update dashboard IDs'
      ]
  });
}

import { 
  QuickSightClient, 
  ListDashboardsCommand,
  DescribeDashboardCommand,
  DescribeUserCommand
} from '@aws-sdk/client-quicksight';
import { fromEnv } from '@aws-sdk/credential-providers';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results = {
    timestamp: new Date().toISOString(),
    configuration: {},
    permissions: {},
    dashboards: {},
    recommendations: []
  };

  try {
    // Check configuration
    results.configuration = {
      awsRegion: process.env.AWS_REGION || 'Not set',
      awsAccountId: process.env.AWS_ACCOUNT_ID || 'Not set',
      namespace: process.env.QUICKSIGHT_NAMESPACE || 'default',
      hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
      credentialsValid: !!(process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_ACCESS_KEY_ID.includes('your-'))
    };

    if (!results.configuration.credentialsValid) {
      results.recommendations.push('Configure valid AWS credentials');
      return res.status(200).json(results);
    }

    const quicksightClient = new QuickSightClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: fromEnv(),
    });

    // Test basic QuickSight access
    try {
      const listDashboardsCommand = new ListDashboardsCommand({
        AwsAccountId: process.env.AWS_ACCOUNT_ID,
      });
      
      const dashboardsList = await quicksightClient.send(listDashboardsCommand);
      results.permissions.canListDashboards = true;
      results.dashboards.available = dashboardsList.DashboardSummaryList || [];
      results.dashboards.count = results.dashboards.available.length;
    } catch (error) {
      results.permissions.canListDashboards = false;
      results.permissions.listDashboardsError = error.message;
      
      if (error.name === 'AccessDeniedException') {
        results.recommendations.push('Add quicksight:ListDashboards permission to your IAM policy');
      } else if (error.name === 'ResourceNotFoundException') {
        results.recommendations.push('QuickSight is not enabled for this AWS account');
      }
    }

    // Test specific dashboard access
    const dashboardId = process.env.NEXT_PUBLIC_QUICKSIGHT_OPERATIONS_DASHBOARD_ID;
    if (dashboardId && !dashboardId.includes('your-') && !dashboardId.includes('dashboard-id')) {
      try {
        const describeDashboardCommand = new DescribeDashboardCommand({
          AwsAccountId: process.env.AWS_ACCOUNT_ID,
          DashboardId: dashboardId,
        });
        
        const dashboardInfo = await quicksightClient.send(describeDashboardCommand);
        results.dashboards.targetDashboard = {
          exists: true,
          id: dashboardId,
          name: dashboardInfo.Dashboard?.Name,
          status: dashboardInfo.Dashboard?.Version?.Status,
          createdTime: dashboardInfo.Dashboard?.CreatedTime,
          lastUpdatedTime: dashboardInfo.Dashboard?.LastUpdatedTime
        };
        results.permissions.canDescribeDashboard = true;
      } catch (error) {
        results.dashboards.targetDashboard = {
          exists: false,
          id: dashboardId,
          error: error.message
        };
        results.permissions.canDescribeDashboard = false;
        
        if (error.name === 'ResourceNotFoundException') {
          results.recommendations.push(`Dashboard ${dashboardId} does not exist or is not accessible`);
        } else if (error.name === 'AccessDeniedException') {
          results.recommendations.push('Add quicksight:DescribeDashboard permission to your IAM policy');
        }
      }
    } else {
      results.recommendations.push('Configure a valid dashboard ID in NEXT_PUBLIC_QUICKSIGHT_OPERATIONS_DASHBOARD_ID');
    }

    // Test user permissions
    try {
      const currentUser = await quicksightClient.send(new DescribeUserCommand({
        AwsAccountId: process.env.AWS_ACCOUNT_ID,
        Namespace: process.env.QUICKSIGHT_NAMESPACE || 'default',
        UserName: 'anonymous' // This will fail but tells us about user setup
      }));
    } catch (error) {
      // This is expected to fail for anonymous users
      if (error.name === 'ResourceNotFoundException') {
        results.permissions.supportsAnonymousEmbedding = true;
      }
    }

    // Generate recommendations
    if (results.permissions.canListDashboards && results.permissions.canDescribeDashboard) {
      results.recommendations.push('Basic permissions look good! Try testing the embed URL generation.');
    }

    if (!results.permissions.canListDashboards) {
      results.recommendations.push('Grant quicksight:ListDashboards permission');
    }

    if (!results.permissions.canDescribeDashboard) {
      results.recommendations.push('Grant quicksight:DescribeDashboard permission');
    }

    results.recommendations.push('Ensure your IAM policy includes quicksight:GenerateEmbedUrlForAnonymousUser');
    results.recommendations.push('Verify the dashboard is published and shared appropriately');

    // Suggested IAM policy
    results.suggestedIAMPolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "quicksight:GenerateEmbedUrlForAnonymousUser",
            "quicksight:GenerateEmbedUrlForRegisteredUser",
            "quicksight:DescribeDashboard",
            "quicksight:ListDashboards",
            "quicksight:GetDashboardEmbedUrl"
          ],
          "Resource": "*"
        }
      ]
    };

    return res.status(200).json(results);

  } catch (error) {
    results.error = {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    
    if (error.name === 'CredentialsProviderError') {
      results.recommendations.push('Check your AWS credentials configuration');
    } else if (error.message.includes('Region')) {
      results.recommendations.push('Verify the AWS_REGION is correct and QuickSight is available in that region');
    }

    return res.status(500).json(results);
  }
}

import { 
  QuickSightClient, 
  GenerateEmbedUrlForAnonymousUserCommand,
  GenerateEmbedUrlForRegisteredUserCommand 
} from '@aws-sdk/client-quicksight';
import { fromEnv } from '@aws-sdk/credential-providers';

// Check if we're in development mode with placeholder credentials
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

let quicksightClient;
try {
  if (isConfigurationValid()) {
    quicksightClient = new QuickSightClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: fromEnv(),
    });
  }
} catch (error) {
  console.warn('QuickSight client initialization failed:', error.message);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, resourceId, userArn = null, userName = null } = req.body;

    if (!type || !resourceId) {
      return res.status(400).json({ error: 'Type and resourceId are required' });
    }

    // Check if AWS configuration is valid
    if (!isConfigurationValid()) {
      return res.status(200).json({
        embedUrl: null,
        requestId: 'demo-request-id',
        isDemoMode: true,
        message: 'Running in demo mode. Please configure AWS credentials to use real QuickSight dashboards.'
      });
    }

    const awsAccountId = process.env.AWS_ACCOUNT_ID;
    const namespace = process.env.QUICKSIGHT_NAMESPACE || 'default';
    
    if (!awsAccountId) {
      return res.status(500).json({ error: 'AWS Account ID not configured' });
    }

    if (!quicksightClient) {
      return res.status(500).json({ error: 'QuickSight client not initialized' });
    }

    let command;
    let params = {
      AwsAccountId: awsAccountId,
      Namespace: namespace,
      SessionLifetimeInMinutes: 600, // 10 hours
    };

    // Configure based on embed type
    if (type === 'dashboard') {
      params.AuthorizedResourceArns = [`arn:aws:quicksight:${process.env.AWS_REGION}:${awsAccountId}:dashboard/${resourceId}`];
      params.ExperienceConfiguration = {
        Dashboard: {
          InitialDashboardId: resourceId,
          FeatureConfigurations: {
            StatePersistence: {
              Enabled: true
            }
          }
        }
      };
    } else if (type === 'analysis') {
      params.AuthorizedResourceArns = [`arn:aws:quicksight:${process.env.AWS_REGION}:${awsAccountId}:analysis/${resourceId}`];
      params.ExperienceConfiguration = {
        QuickSightConsole: {
          InitialPath: `/analyses/${resourceId}`,
          FeatureConfigurations: {
            StatePersistence: {
              Enabled: true
            }
          }
        }
      };
    } else if (type === 'visual') {
      params.AuthorizedResourceArns = [`arn:aws:quicksight:${process.env.AWS_REGION}:${awsAccountId}:dashboard/${resourceId}`];
      params.ExperienceConfiguration = {
        Dashboard: {
          InitialDashboardId: resourceId,
          FeatureConfigurations: {
            StatePersistence: {
              Enabled: true
            }
          }
        }
      };
    }

    // Use anonymous user embedding for simplicity (you can switch to registered user if needed)
    if (userArn && userName) {
      // Registered user embedding
      params.UserArn = userArn;
      command = new GenerateEmbedUrlForRegisteredUserCommand(params);
    } else {
      // Anonymous user embedding
      command = new GenerateEmbedUrlForAnonymousUserCommand(params);
    }

    const response = await quicksightClient.send(command);

    return res.status(200).json({
      embedUrl: response.EmbedUrl,
      requestId: response.RequestId,
    });

  } catch (error) {
    console.error('QuickSight embed error:', error);
    
    // Handle specific QuickSight errors
    if (error.name === 'ResourceNotFoundException') {
      return res.status(404).json({ 
        error: 'Dashboard or resource not found',
        details: `Dashboard ID "${resourceId}" was not found in your QuickSight account.`
      });
    } else if (error.name === 'AccessDeniedException') {
      return res.status(403).json({ 
        error: 'Access denied to QuickSight resource',
        details: 'Please check your AWS IAM permissions for QuickSight.',
        requiredPermissions: [
          'quicksight:GenerateEmbedUrlForAnonymousUser',
          'quicksight:DescribeDashboard',
          'quicksight:ListDashboards'
        ],
        troubleshooting: {
          steps: [
            '1. Verify your AWS user has QuickSight permissions',
            '2. Check if the dashboard exists and is published',
            '3. Ensure the dashboard is shared with the appropriate users',
            '4. Verify the AWS Account ID is correct',
            '5. Check if QuickSight is enabled in your AWS account'
          ],
          dashboardArn: `arn:aws:quicksight:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:dashboard/${resourceId}`
        }
      });
    } else if (error.name === 'InvalidParameterValueException') {
      return res.status(400).json({ 
        error: 'Invalid parameter value',
        details: error.message
      });
    } else if (error.message.includes('Capacity Pricing plan')) {
      return res.status(402).json({ 
        error: 'QuickSight Capacity Pricing Required',
        details: 'This API action is supported only when the account has an active Capacity Pricing plan.',
        solution: 'Upgrade to QuickSight Standard ($18/month) or Enterprise ($24/month) to use embedding features.',
        currentPlan: 'Pay-per-Session (does not support embedding)',
        requiredPlan: 'Capacity Pricing (Standard or Enterprise)',
        upgradeUrl: 'https://quicksight.aws.amazon.com/',
        isDemoMode: true
      });
    } else if (error.name === 'CredentialsProviderError' || error.message.includes('credentials')) {
      return res.status(500).json({ 
        error: 'AWS credentials not configured properly',
        details: 'Please configure valid AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment variables.'
      });
    }

    // Log the full error for debugging
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({ 
      error: 'Failed to generate embed URL',
      details: error.message,
      isDemoMode: !isConfigurationValid()
    });
  }
}

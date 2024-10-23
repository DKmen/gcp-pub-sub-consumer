interface IEnvConfig {
    googleProjectId: string;
    googleKeyFilename: string;
    messageBatchSize: number;
    googleSubscriptionName: string;
    googleTopicName: string;
}

const reqiredEnvVars = [
    'GOOGLE_PROJECT_ID',
    'GOOGLE_KEY_FILENAME',
    'GOOGLE_SUBSCRIPTION_NAME',
    'GOOGLE_TOPIC_NAME',
]

for (const envVar of reqiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable ${envVar}`);
    }
}

const config: Partial<IEnvConfig> = {
    googleProjectId: process.env.GOOGLE_PROJECT_ID,
    googleKeyFilename: process.env.GOOGLE_KEY_FILENAME,
    messageBatchSize: parseInt(process.env.MESSAGE_BATCH_SIZE || '10'),
    googleSubscriptionName: process.env.GOOGLE_SUBSCRIPTION_NAME,
    googleTopicName: process.env.GOOGLE_TOPIC_NAME,
}

export default config as IEnvConfig;
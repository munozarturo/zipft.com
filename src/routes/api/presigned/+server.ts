import { json } from '@sveltejs/kit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

const s3Client = new S3Client({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_KEY,
		secretAccessKey: env.AWS_SECRET
	}
});

export async function GET({ url }) {
	try {
		// Get query parameters
		const filename = url.searchParams.get('filename');
		const contentType = url.searchParams.get('contentType');

		if (!filename) {
			return json({ error: 'Filename is required' }, { status: 400 });
		}

		// Set up the parameters for the presigned URL
		const bucketParams = {
			Bucket: process.env.S3_BUCKET_NAME,
			Key: `uploads/${filename}`,
			ContentType: contentType || 'application/octet-stream'
		};

		const command = new PutObjectCommand(bucketParams);

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600 // URL expires in 1 hour
		});

		return json({
			url: presignedUrl,
			key: bucketParams.Key
		});
	} catch (error) {
		console.error('Error generating presigned URL:', error);
		return json({ error: 'Failed to generate presigned URL' }, { status: 500 });
	}
}

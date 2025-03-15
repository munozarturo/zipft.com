import { json } from '@sveltejs/kit';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_REGION, AWS_KEY, AWS_SECRET, AWS_S3_BUCKET } from '$env/static/private';

const s3Client = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_KEY,
		secretAccessKey: AWS_SECRET
	}
});

export async function POST({ request }) {
	try {
		const { filename, contentType, directory = '' } = await request.json();

		if (!filename || !contentType) {
			return json(
				{
					error: 'Filename and content type are required'
				},
				{ status: 400 }
			);
		}

		// Generate a unique key for the file
		const key = directory ? `${directory}/${Date.now()}-${filename}` : `${Date.now()}-${filename}`;

		const command = new PutObjectCommand({
			Bucket: AWS_S3_BUCKET,
			Key: key,
			ContentType: contentType
		});

		// Generate the presigned URL (expires in 5 minutes by default)
		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 60 * 5
		});

		return json({
			presignedUrl,
			key,
			bucket: AWS_S3_BUCKET,
			url: `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${key}`
		});
	} catch (error) {
		console.error('Error generating presigned URL:', error);
		return json({ error: 'Failed to generate presigned URL' }, { status: 500 });
	}
}

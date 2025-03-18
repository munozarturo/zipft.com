import JSZip from 'jszip';

/**
 * Compresses multiple files into a single zip file for S3 upload
 * @param files - Array of File objects to compress
 * @param onProgress - Optional callback for compression progress
 * @returns Promise that resolves with the compressed file as a Blob
 */
export async function compressFiles(
	files: File[],
	onProgress?: (percent: number) => void
): Promise<Blob> {
	const zip = new JSZip();

	files.forEach((file) => {
		zip.file(file.name, file);
	});

	return await zip.generateAsync(
		{
			type: 'blob',
			compression: 'DEFLATE',
			compressionOptions: { level: 6 }
		},
		onProgress ? (metadata) => onProgress(metadata.percent) : undefined
	);
}

const { BlobServiceClient } = require('@azure/storage-blob');

// Replace these values with your own Azure Storage account credentials
const connectionString = 'your_storage_account_connection_string';
const containerName = 'your_container_name';

// Create a BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImageToBlobStorage(blobName, filePath) {
    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload a local file to the blob
    await blockBlobClient.uploadFile(filePath, {
        blobHTTPHeaders: { blobContentType: 'image/jpeg' }, // Set the content type based on your image type
    });

    console.log(`Image ${blobName} uploaded successfully.`);
}

// Usage example
const blobName = 'example.jpg'; // Specify the name you want for the blob
const filePath = 'path/to/your/local/image.jpg'; // Replace with the actual path to your image file

uploadImageToBlobStorage(blobName, filePath).catch((error) => {
    console.error('Error uploading image:', error);
});

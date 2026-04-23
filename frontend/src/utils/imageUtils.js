/**
 * Resolves an image URL from the backend.
 * If the URL is already an absolute path (Cloudinary), it returns it as is.
 * If the URL is just a UUID filename, it prepends the backend download endpoint.
 * 
 * @param {string} url - The image URL or filename from the database.
 * @returns {string} - The fully qualified URL to the image.
 */
export const resolveImageUrl = (url) => {
    if (!url) return null;
    
    // If it starts with http or https, it's already a full URL (likely Cloudinary)
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // If it's a relative path starting with /api, it's a local download path
    if (url.startsWith('/api/')) {
        return `http://localhost:8081${url}`;
    }
    
    // Otherwise, assume it's just a filename and prepend the download endpoint
    // Use the backend URL from your environment or default to localhost:8081
    return `http://localhost:8081/api/files/download/${url}`;
};

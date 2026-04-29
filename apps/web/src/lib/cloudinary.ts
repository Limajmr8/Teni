export const getCloudinaryUrl = (publicId: string, options?: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId;
  const transformation = options ?? 'f_auto,q_auto';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
};

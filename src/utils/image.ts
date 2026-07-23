export const getImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // If url starts with '/', strip leading slash so relative resolution (with <base> tag or relative paths) works seamlessly
  return url.startsWith('/') ? url.slice(1) : url;
};

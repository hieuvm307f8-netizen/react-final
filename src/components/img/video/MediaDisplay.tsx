const BASE_URL = "https://instagram.f8team.dev";

interface MediaDisplayProps {
  src: string;
  type: 'image' | 'video';
  className?: string;
}

export default function MediaDisplay({ src, type, className }: MediaDisplayProps) {
  const getFullUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  
  const fullUrl = getFullUrl(src);

  if (type === 'video') {
    return <video src={fullUrl} controls className={className} />;
  }

  return (
    <img 
      src={fullUrl} 
      className={className} 
      alt="Post media"
    />
  );
}
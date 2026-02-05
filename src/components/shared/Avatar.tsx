interface AvatarProps {
  img?: string;
  className?: string;
}

export default function Avatar({ img, className = "w-20 h-20" }: AvatarProps) {
  const BASE_URL = "https://instagram.f8team.dev";
  const DEFAULT_AVATAR = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const getImageUrl = (path: string | undefined) => {
    if (!path) return DEFAULT_AVATAR;
    if (path.startsWith("blob:") || path.startsWith("http")) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  return (
    <div className={`${className} flex-shrink-0 overflow-hidden rounded-full border bg-gray-50`}>
      <img
        src={getImageUrl(img)}
        alt="avatar"
        className="rounded-full object-cover w-full h-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
        }}
      />
    </div>
  );
}
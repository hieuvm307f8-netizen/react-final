import PostItem from './PostItem';

interface PostCardProps {
  posts: any[];
  loading: boolean;
}

export default function PostCard({ posts, loading }: PostCardProps) {
  return (
    <>
      {posts.map((data) => <PostItem key={data._id} data={data} />)}
    </>
  );
}


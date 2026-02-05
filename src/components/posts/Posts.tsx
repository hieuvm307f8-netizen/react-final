import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PostCard from './PostCard';
import { getNewsFeed } from '@/store/slice/postsSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { Spinner } from '../ui/spinner';

export default function Posts() {
  const dispatch = useDispatch<AppDispatch>();
  const { homePosts, loading } = useSelector((state: RootState) => state.posts);

  useEffect(() => {
    dispatch(getNewsFeed({ limit: 200, offset: 0 }));
  }, [dispatch]);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <PostCard posts={homePosts} loading={loading} />

      {loading && homePosts.length === 0 && (
        <div className="h-20 w-full flex justify-center items-center">
          <Spinner />
        </div>
      )}

      {!loading && homePosts.length > 0 && (
        <p className="text-gray-400 text-sm mt-4">Nothing to see here</p>
      )}

      {!loading && homePosts.length === 0 && (
        <p className="text-gray-400 text-sm mt-4">Nothing to see here</p>
      )}
    </div>
  );
}
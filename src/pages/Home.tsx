import Posts from '@/components/posts/Posts'
import Suggestion from '@/layouts/Suggestion'

export default function Home() {
  return (
    <div className='flex w-[80%] mx-auto justify-center gap-40 mt-5'>
      <div className='flex flex-col items-center gap-10'> 
        <Posts />
      </div>
      <Suggestion />
    </div>
  )
}

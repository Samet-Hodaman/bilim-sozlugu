import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'

export default function Contents() {
  const [ posts, setPosts ] = useState([])
  const [ showMore, setShowMore ] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts?limit=12')
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    
    }
    fetchPosts()
  }, [])

  const handleShowMore = async () => {
    const startIndex = posts.length
    try {
      const res = await fetch(`/api/post/getPosts?startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok){
        setPosts((prev) => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    
    } catch (error){
      console.log(error.message);
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-20'>
      {
        posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>
              Son paylaşımlar
            </h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {
              showMore && (
                <button onClick={handleShowMore} className='w-full text-lg text-teal-500 self-center py-2 hover:underline focus:border-none'>
                  Daha fazla...
                </button>
              )
            }
          </div>
        )
      }
    </div>
  )
}

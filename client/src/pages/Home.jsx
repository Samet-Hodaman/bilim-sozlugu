import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'

export default function Home() {
  const [ posts, setPosts ] = useState([])
  const [ showMore, setShowMore] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getPosts')
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
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Bilim Sözlüğüne hoş geldiniz...</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>Buraya harika bir soz gelicek...Buraya harika bir soz gelicek...Buraya harika bir soz gelicek...Buraya harika bir soz gelicek...Buraya harika bir soz gelicek...Buraya harika bir soz gelicek...</p>
        <Link to='/arama' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          Tüm gönderileri göster
        </Link>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
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

      <div className='p-3 max-w-7xl mx-auto bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
    </div>
  )
}

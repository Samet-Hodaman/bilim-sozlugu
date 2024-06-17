import { Button, Select, TextInput } from "flowbite-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PostCard from '../components/PostCard'
import { AUTHOR_LIST } from "../utils/consts"

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: '',
    author: '',
  })

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm') || ''
    const sortFromUrl = urlParams.get('sort') || 'desc'
    const authorFromUrl = urlParams.get('author') || ''
    let categoryFromUrl = urlParams.get('category') || ''

    if (authorFromUrl && !categoryFromUrl) {
      const category = AUTHOR_LIST.find((author) => author.name === authorFromUrl)?.category || ''
      categoryFromUrl = category
    }

    setSidebarData({
      searchTerm: searchTermFromUrl,
      sort: sortFromUrl,
      category: categoryFromUrl,
      author: authorFromUrl,
    })

    const fetchPosts = async () => {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`/api/post/getPosts?${searchQuery}`)
      if (!res.ok) {
        setLoading(false)
        return
      }
      const data = await res.json()
      setPosts(data.posts)
      setLoading(false)
      setShowMore(data.posts.length === 9)
    }

    fetchPosts()
  },[location.search])

  const handleChange = async (e) => {
    const { id, value } = e.target
    setSidebarData((prevData) => ({ ...prevData, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchParams = {
      searchTerm: sidebarData.searchTerm,
      sort: sidebarData.sort,
      category: sidebarData.category,
      author: sidebarData.author || null,
    };
  
    const urlParams = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) urlParams.set(key, value)
    })

    const searchQuery = urlParams.toString()
    navigate(`/ara?${searchQuery}`);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label>Arama terimi:</label>
            <TextInput
              placeholder="Ara..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sırala: </label>
            <Select 
              onChange={handleChange} 
              value={sidebarData.sort} 
              id='sort'
            >
              <option value='desc'>Önce yeniler</option>
              <option value='asc'>Önce eskiler</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label>Kategori: </label>
            <Select 
              onChange={handleChange} 
              value={sidebarData.category || ''} 
              id='category'
            >
              <option value=''>Belirtilmemiş</option>
              <option value='fizik'>Fizik</option>
              <option value='kimya'>Kimya</option>
              <option value='biyoloji'>Biyoloji</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label>Yazar Adı: </label>
            <Select 
              onChange={handleChange} 
              value={sidebarData.author} 
              id='author'
            >
              <option value=''>Belirtilmemiş</option>
              {AUTHOR_LIST.filter((author) => author.category === sidebarData.category).map((author) => (
                <option value={author.name} key={author.name}>
                  {author.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Filtreyi uygula
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Arama sonuçları:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {
            !loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">
              Gönderi bulunamadı.
            </p>
          )}
          {
            loading && (
            <p className="text-xl text-gray-500">
              Yükleniyor...
            </p>
          )}
          {!loading && posts && posts.map((post) => {
            return <PostCard key={post._id} post={post} />
          })}
        </div>
      </div>
    </div>
  )
}

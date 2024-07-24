import HomeAnimation from '../components/HomeAnimation'
import CallToAction from '../components/CallToAction'

export default function Home() {

  return (
    <div>
      <div className='flex flex-col items-center gap-6 p-28 px-3 mx-auto min-h-screen bg-gradient-to-br from-pink-100 via-blue-300 to-blue-500'>
        <h1 className='text-blue-900 text-3xl font-bold font-sans lg:text-6xl'>Bilim Sözlüğüne hoş geldiniz...</h1>
        <HomeAnimation />
      </div>
      <div className='flex flex-col mx-auto min-h-screen bg-[#F5F5F8] '>
        <div className='flex flex-col justify-center w-4/5'>
          <h1 className='text-black text-xl  font-bold'>
            Bilim, evreni anlamanın anahtarıdır. Gözlerimizi açar, ufkumuzu genişletir. Bilimle güçlen, keşfet, ilerle!
          </h1>
        </div>
      </div>
      <div className='min-h-screen bg-[#FFFFFF] '>

      </div>
      <CallToAction />

    </div>
  )
}

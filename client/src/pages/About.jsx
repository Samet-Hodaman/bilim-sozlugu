import React from 'react'
import { ABOUT_CONTENT } from '../utils/consts'

export default function About() {
  return (
    <div>
      <div className='flex flex-col gap-20 p-28 px-3 max-w-6xl mx-auto '>
      {
        ABOUT_CONTENT.map((item) => (
          <div>
            <h1 className='text-3xl font-bold lg:text-4xl py-6'>
              {item.title}
            </h1>
            <p className='text-gray-500 text-md sm:text-lg'>{item.content}</p>
          </div>
        ))
      }
      </div>
    </div>
  )
}

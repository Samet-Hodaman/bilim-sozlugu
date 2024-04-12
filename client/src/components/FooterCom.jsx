import React from 'react'
import {Footer} from 'flowbite-react'
import { Link } from 'react-router-dom'
import {BsInstagram,BsFacebook,BsTwitter} from 'react-icons/bs'
import { FOOTER_LINKS } from '../utils/consts'

export default function FooterCom() {
  const logoURL = "https://firebasestorage.googleapis.com/v0/b/bilim-sozlugu.appspot.com/o/Ana_Logo.png?alt=media&token=75e3a1b4-c5d6-4cb9-927f-9008120e8086"
  return (
    <Footer container className='border border-t-8 border-sky-700'>
      <div className='w-full max-w-5xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>

          <div className='mt-5'>
          {/* Logo and Bilim Sozlugu text */}
            <Link to='/' className='flex items-center mr-8 whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
			        <span className='italic pr-2'>Bilim Sözlüğü</span>
			        <img src={logoURL} className='w-16 md:w-20 lg:w-20 '/>
  	        </Link>
					</div>

          <div className='grid grid-cols-2 gap-8 mt-2 sm:grid-cols-3 sm:gap-6'>

          {FOOTER_LINKS.map((item, index) => {
            return (
              <div key={index}>
                <Footer.Title title={item.title}/>
                <Footer.LinkGroup col>
                  {item.items.map((subItem, subIndex) => {
                    return (
                      <Footer.Link
                        href={subItem.URL}
                        target='_blank' // open another page when it is clicked.
                        rel='noopener noreferrer'
                        key={subIndex}
                      >
                      {subItem.title}
                      </Footer.Link>
                    )
                  })}
                </Footer.LinkGroup>
              </div>
            )
          }) }
          </div>
        </div>

				<Footer.Divider />
				<div className='w-full sm:flex sm:items-center sm:justify-between'>
					<Footer.Copyright 
						href='#' 
						by="Bilim Sözlüğü" 
						year={new Date().getFullYear()}
						/>
						<div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
							<Footer.Icon href={FOOTER_LINKS[1].items[0].URL} icon={BsFacebook} target='_blank' rel='noopener noreferrer'/>
							<Footer.Icon href={FOOTER_LINKS[1].items[1].URL} icon={BsInstagram} target='_blank' rel='noopener noreferrer'/>
							<Footer.Icon href={FOOTER_LINKS[1].items[2].URL} icon={BsTwitter} target='_blank' rel='noopener noreferrer'/>
						</div>
				</div>
      </div>
    </Footer>
  )
}

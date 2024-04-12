import { Button } from 'flowbite-react'

export default function CallToAction() {
  const recipientEmail = 'samet@gmail.com';
  
  const mailtoUrl = `https://mail.google.com/mail/u/0/#inbox?compose=CllgCJNstzFcrnlKqrfVgGncFDbKNBhXhfbcTXgpDnBsvsLmqWcWdDNtpJWSjqjmQKCvxjhNNHL`;
  

  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center flex flex-col'>
          <h2 className='text-2xl'>
            Bir sorun mu var?
          </h2>
          <p className='text-gray-500 my-2'>
            Bir sorun ile karşılaştığınızı düşünüyorsanız lütfen bize mail göndererek durumu bildirin.
          </p>
          <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
            <a href={mailtoUrl} target='_blank' rel='noopener noreferrer'>Mail için tıklayın</a>
          </Button>
        </div>
        <div className='p-7 flex-1'>
          <img src='https://avatars.mds.yandex.net/i?id=641d1ad8d8dadf29f2d014ef03346a5de33e72d0-12480042-images-thumbs&n=13' alt='img'/>
        </div>
    </div> 
  )
}

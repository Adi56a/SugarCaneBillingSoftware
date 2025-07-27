import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
     <div  className='bg-amber-100 h-[10vh] flex justify-center gap-10 items-center '>
<span className="border-b-2 border-transparent hover:border-current transition-all duration-1000 cursor-pointer">
  <Link to='/'>Home</Link>
</span>
      <span className="border-b-2 border-transparent hover:border-current transition-all duration-1000 cursor-pointer">
 <Link to='/about'>About</Link>
</span>

     </div>
    
    </>
  )
}

export default Header

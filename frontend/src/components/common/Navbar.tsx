import { IoIosSearch } from "react-icons/io"; 
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlinePlusCircle } from "react-icons/ai";
function Navbar() {
  return (
    <header className='fixed top-0 w-full flex items-center flex-row justify-between h-16 px-4 bg-neutral-600 bg-opacity-75'>
        <div className="flex flex-row items-center justify-around gap-3 ">
            <GiHamburgerMenu className="text-slate-100 text-xl"/>
            <p className="font-bold underline">PLayZone</p>
        </div>

        <div className=" flex-row items-center hidden md:block">
          
                
                <div className="flex flex-row items-center justify-around rounded-md border border-slate-400 px-2 ">
                    <form className='' >
                        <input type='text' 
                        className='bg-transparent w-[300px] rounded-md px-4 py-1 outline-none border-none' 
                        placeholder='Search...'
                        />
                    </form>
                    
                    <IoIosSearch className='text-xl text-white'/>
                </div>
                
       
        </div>

        <div className='flex flex-row gap-3 items-center'>
          <AiOutlinePlusCircle className="text-slate-100 text-2xl"/>
           <p>image for the user</p>     
        </div>
    </header>
  )
}

export default Navbar

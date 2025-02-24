import { IoIosSearch } from "react-icons/io"; 

function Navbar() {
  return (
    <header className='fixed top-0 w-full flex flex-row justify-between mx-auto h-16 px-4 bg-neutral-600 bg-opacity-75'>
        <div className="flex flex-row items-center justify-around gap-3 ">
            <button>click</button>
            <p>logo</p>
        </div>

        <div className="flex flex-row items-center">
          
                
                <div className="flex flex-row items-center rounded-md border border-slate-400 px-2">
                    <form className='' >
                        <input type='text' 
                        className='bg-transparent rounded-md px-4 py-1 outline-none border-none hidden lg:block' 
                        placeholder='Search...'
                        />
                    </form>
                    
                    <IoIosSearch className='text-xl text-white'/>
                </div>
                
       
        </div>

        <div className='flex flex-row gap-3 items-center'>
           <p>create</p>
           <p>image for the user</p>     
        </div>
    </header>
  )
}

export default Navbar

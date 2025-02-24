import { Outlet } from "react-router-dom"
import Sidebar from "../components/common/Sidebar"
function Dashboard() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex ">
        <Sidebar/>               
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
            <div className="py-10 mx-auto w-11/12 ">
                <Outlet/>
            </div>
        </div>

    </div>
  )
}

export default Dashboard

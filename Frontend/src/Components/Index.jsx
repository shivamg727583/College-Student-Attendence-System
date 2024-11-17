import Login from "./Auth/Login"
import Navbar from "./Others/Navbar"

function Index() {
  return (
    <div className="w-full h-screen  p-4 ">
      <Navbar />
<Login />
    </div>
  )
}

export default Index
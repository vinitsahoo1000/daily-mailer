import { Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { RegisterPage } from "./pages/RegistrationPage"
import { VerifyMail } from "./pages/VerifyMail"
import { SubscriptionPage } from "./pages/SubscriptionPage"


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify/:email" element={<VerifyMail/>}/>
        <Route path="/subscription/:action/:email" element={<SubscriptionPage/>}/>
      </Routes>
    </div>
  )
}

export default App

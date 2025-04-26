import { Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { RegisterPage } from "./pages/RegistrationPage"
import { VerifyMail } from "./pages/VerifyMail"
import { UnsubscribePage } from "./pages/UnsubsribePage"


function App() {
  

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/verify/:email" element={<VerifyMail/>}/>
        <Route path="/verified/:email" element={<VerifyMail/>}/>
        <Route path="/verified/:email" element={<VerifyMail/>}/>
        <Route path="/unsubscribe/:email" element={<UnsubscribePage/>}/>
      </Routes>
    </div>
  )
}

export default App

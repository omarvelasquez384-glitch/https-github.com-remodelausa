import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Legal from './pages/Legal'
import SeoLanding from './pages/SeoLanding'
import Directory from './pages/Directory'
import ContractorProfile from './pages/ContractorProfile'
import Portal from './pages/Portal'
import Track from './pages/Track'
import Account from './pages/Account'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/legal/:doc" element={<Legal />} />
      <Route path="/s/:stateSlug/:serviceId" element={<SeoLanding />} />
      <Route path="/contractors" element={<Directory />} />
      <Route path="/contractors/:id" element={<ContractorProfile />} />
      <Route path="/portal" element={<Portal />} />
      <Route path="/track" element={<Track />} />
      <Route path="/account" element={<Account />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

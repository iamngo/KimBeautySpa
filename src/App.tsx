import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { HOME, LOGIN } from './routes'
import Authenticate from './modules/Authenticate/pages/auth'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path={LOGIN} element={<Authenticate/>}/>
      <Route path={HOME} element={<Navigate to={LOGIN}/>}/>
    </Routes>
  )
}

export default App
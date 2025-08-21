import React from 'react'
import { Header } from '../components/layout/Header'
import { MainPage } from '../pages/MainPage'

export const App = () => {
  return (
    <div className="app">
      <Header title="IIIT-Una Feed" />
      <MainPage />
    </div>
  )
}



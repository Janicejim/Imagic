import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='auth'>

      <div className='auth-container'>
        <div className="wrapper"></div>
        {children}
      </div>


    </main>
  )
}

export default Layout
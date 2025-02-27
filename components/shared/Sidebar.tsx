"use client"

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
    const pathname = usePathname()
    return (
        <aside className='sidebar'>
            <div className='flex size-full flex-col gap-4'>
                <Link href="/" className='sidebar-logo'>
                    <Image src="/assets/images/logo-text.png" alt="logo" width={180} height={28} />
                </Link>
                <nav className='sidebar-nav'>
                    <SignedIn>
                        <ul className='sidebar-nav_elements'>
                            {navLinks.slice(0, 6).map((link) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                        }`}>
                                        <Link rel="stylesheet" href={link.route} className='sidebar-link' >
                                            <Image src={link.icon} alt="logo" width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })}

                        </ul>
                        <ul className='sidebar-nav_elements'>
                            {navLinks.slice(6).map((link) => {
                                const isActive = link.route === pathname
                                return (
                                    <li key={link.route} className={`sidebar-nav_element group ${isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                        }`}>
                                        <Link rel="stylesheet" href={link.route} className='sidebar-link' >
                                            <Image src={link.icon} alt="logo" width={24} height={24} className={`${isActive && 'brightness-200'}`} />
                                            {link.label}
                                        </Link>
                                    </li>
                                )
                            })}
                            <li className="flex-center cursor-pointer gap-2 p-4">
                                <UserButton afterSignOutUrl='/' showName />
                            </li>
                        </ul>

                    </SignedIn>
                    <SignedOut>

                        <Link className="button bg-purple-gradient bg-cover text-white" href="/sign-in"> <button >Login</button></Link>
                    </SignedOut>

                </nav>

            </div>

        </aside>
    )
}

export default Sidebar
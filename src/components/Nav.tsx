'use client'
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import AuthModel from "./AuthModel"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

const Nav_Items = ["Home", "Booking", "About Us", "Contect"]

const Nav = () => {
  const pathName = usePathname()
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { userData } = useSelector((state: RootState) => state.user)
  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-[#0B0B0B] text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Image src={"/logo.png"} alt="logo" width={44} height={44} priority />

          <div className="hidden md:flex items-center gap-10">
            {Nav_Items.map((i, index) => {
              let href;
              if (i == "Home") {
                href = `/`
              } else {
                href = `/${i.toLowerCase()}`
              }

              const active = href == pathName
              return <Link key={index} href={href} className={`text-sm font-medium transition 
            ${active
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
                }`} > {i}</Link>
            })}
          </div>

          <div className=" flex items-center gap-3 relative">

            <div className=" hidden md:block relative">
              {!userData ? (
                <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>

              ) : (
                <>
                  <button className="w-11 h-11 rounded-full bg-white text-black font-bold"
                    onClick={() => setProfileOpen(p => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className=" absolute top-14 right-0 w-[300px] bg-white text-black rounded-2xl shadow-xl border"
                      >

                        <div className="p-5">
                          <p className="font-semibold text-lg">{userData.name}</p>
                          <p className="text-xs uppercase text-gray-500 mb-4">{userData.role}</p>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>

                </>
              )

              }

            </div>



          </div>
        </div>

      </motion.div>

      <AuthModel open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}

export default Nav
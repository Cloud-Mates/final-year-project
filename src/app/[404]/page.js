"use client"
import React from 'react'
import { useRouter } from 'next/navigation'


const page = () => {
    const router = useRouter()
router.push("/")
  return (
    <div>redirecting...</div>
  )
}

export default page
'use client'

import { createTheme } from '@mui/material'
import { Roboto } from 'next/font/google'

export const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const theme = createTheme({ cssVariables: true })

export default theme

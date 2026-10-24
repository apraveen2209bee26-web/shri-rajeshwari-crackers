import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import productRoutes from './routes/productRoutes.js'
import { errorHandler, notFound } from './middlewares/errorMiddleware.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDistPath = path.resolve(__dirname, '../../client/dist')
const hasClientBuild = existsSync(path.join(clientDistPath, 'index.html'))

app.use(
  cors()
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Crackers API is healthy' })
})

app.use('/api/auth', authRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

if (hasClientBuild) {
  app.use(express.static(clientDistPath))

  app.get((_req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

app.use(notFound)
app.use(errorHandler)

export default app

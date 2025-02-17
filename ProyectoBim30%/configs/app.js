'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import { limiter } from '../middlewares/rate.limit.js'

import categoriaRoutes from '../src/categorias/categorias.routes.js' 
import usuarioRoutes from '../src/usuarios/usuarios.routes.js'

dotenv.config()

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app)=>{
    app.use('/v1/categoria', categoriaRoutes)
    app.use('/v1/usuarios', usuarioRoutes)
    //app.use('/v1/productos', productosRoutes)
    //app.use('/v1/carrito', carritoRoutes)
    //app.use('/v1/factura', facturaRoutes)
    
}

export const initServer = ()=>{
    const app = express()
    try{
        configs(app)
        routes(app)
        app.listen(process.env.PORT, () => {
            console.log(`Server running in port ${process.env.PORT}`)
        })
    }catch(err){
        console.error('Server init failed', err)
        process.exit(1)
    }
}
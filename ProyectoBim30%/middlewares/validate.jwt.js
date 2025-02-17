//Validar los tokens
'use strict'

import jwt from 'jsonwebtoken'

export const validateJwt = async(req, res, next)=>{
    try{
        //Obtener la llave de acceso privada al Token
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers (cabeceras)
        let { authorization } = req.headers
        //Verificamos que venga el token
        if(!authorization) return res.status(401).send({message: 'Unauthorized'})
        let user = jwt.verify(authorization, secretKey)
        //Inyectar en la solicitud un nuevo parámetro
        req.user = user
        //next() = todo salió bien por acá, que pase a la siguiente función
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalid credentials'})
    }
}
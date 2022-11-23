

import type { NextApiRequest, NextApiResponse } from 'next'
import slugify from 'slugify'
import { db } from '../../../database'
import { IPage } from '../../../interfaces'
import { Page } from '../../../models'

type Data = 
    | { message: string }
    | IPage[]
    | IPage

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {


    switch (req.method) {

        case 'GET':
            return getPages( req, res )
            
        case 'POST':
            return addNewPage( req, res )
            
    
        default:
            return res.status(400).json({ message: 'Endpoint no encontrado' })
    }
}

const getPages = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        
        await db.connect()
        const pages = await Page.find().lean()
        await db.disconnect()

        return res.status(200).json(pages)

    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })

    }
}



const addNewPage = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { name='', url='', img=null, category=''  } = req.body

    if([name.trim(), url.trim(), category.trim()].includes('')){
        return res.status(400).json({ message: 'Las propiedades nombre, url y categoria son requeridas' })
    }
    
    const slug = slugify(name, { replacement: '-', lower: true })

    const newPage = new Page({
        name,
        slug,
        img,
        category,
        groups: [],
    })

    
    try {
        await db.connect()
        await newPage.save()
        await db.disconnect()

        return res.status(200).json(newPage)
        
    } catch (error) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: 'Algo salio mal, revisar la consola del servidor' })
    }

}



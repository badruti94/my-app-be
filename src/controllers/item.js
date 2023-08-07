const cloudinary = require('cloudinary')
const DatauriParser = require('datauri/parser')
const path = require('path')
const { item } = require('../../models')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
const parser = new DatauriParser()

exports.getAllItems = async (req, res) => {
    try {
        const items = await item.findAll()

        res.status(200).send({
            data: {
                items
            }
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}

exports.createItem = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(401).send({
                message: "\"image\" is required",
            })
        }

        const file = parser.format(path.extname(req.files.image.name).toString(), req.files.image.data).content
        const result = await cloudinary.uploader.upload(file, {
            folder: 'uploads',
            use_filename: true,
            unique_filename: false,
        })
        await item.create({
            ...req.body,
            image: result.secure_url,
        })

        res.status(201).send({
            message: 'Item created successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}

exports.updateItem = async (req, res) => {
    try {
        const id = req.params.id

        if (req.files) {
            const file = parser.format(path.extname(req.files.image.name).toString(), req.files.image.data).content
            const result = await cloudinary.uploader.upload(file, {
                folder: 'uploads',
                use_filename: true,
                unique_filename: false,
            })

            await item.update({
                ...req.body,
                image: result.secure_url,
            }, {
                where: {
                    id,
                }
            })
        } else {
            await item.update({
                ...req.body,
            }, {
                where: {
                    id,
                }
            })
        }

        res.status(200).send({
            message: 'Item updated successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const id = req.params.id
        await item.destroy({
            where: {
                id
            }
        })
        res.status(200).send({
            message: 'Item deleted successfully'
        })
    } catch (error) {
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
}
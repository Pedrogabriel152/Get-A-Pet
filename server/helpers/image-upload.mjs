import multer from 'multer'
import path from 'path'

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) =>{

        let folder = ""

        if(req.baseUrl.includes("user")) {
            folder = "users"
        } else if(req.baseUrl.includes("pets")) {
            folder = "pets"
        }

        cb(null, `public/images/${folder}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageupload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb.Error("Por favor, envie apenas jpg ou png")
        }

        cb(undefined, true)
    }
})

export default imageupload
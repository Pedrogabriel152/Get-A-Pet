const getToken = req => {

    const authHeader = req.headers.authorization

    const tokenIvalid = authHeader.split(" ")[1]
    const token = tokenIvalid.split('"')[1]

    return token

}

export default getToken;
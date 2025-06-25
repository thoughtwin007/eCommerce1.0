import jwt from "jsonwebtoken"

function genToken(data) {
    return jwt.sign({ id: data._id, role: data.role }, "shhhhh111")
}
function verifyToken(token) {
    console.log("verifyToken: ", token)
    return jwt.verify(token, "shhhhh111")
}
export default { verifyToken, genToken };
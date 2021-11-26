module.exports=(req,res,next)=>{
    const errorObj={
        status:404,
        message: "Sorry , Page not found !"
    }
    res.status(404).json(errorObj)
}
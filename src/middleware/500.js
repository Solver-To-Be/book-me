module.exports=(err,req,res,next)=>{
    const error=err.message? err.message:err ;
    const errorObj={
        status:500,
        message:error,
        path :req.path,
        query:req.query
    }
res.status(500).json(errorObj)
}
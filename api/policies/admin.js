module.exports = (req,res,next) => {

  if(req.session.user &&  req.session.user.admin){
    next();

}else{
  req.session.flash = {
    err: {name:'You Don\'t Have privillage for access'}
  }
  return res.redirect('/');
}
}

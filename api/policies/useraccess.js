module.exports = (req,res,next) => {

  if(req.session.user == undefined){
      return res.redirect('/');
  }
  const sessionUser = req.param('id') == req.session.user.id;
  
  const isAdmin = req.session.user.admin;
  if(!(sessionUser || isAdmin)){
    req.session.flash = {
    err: {name:'You Don\'t Have privillage for access'}
  }
  return res.redirect('/');
}


next();
}

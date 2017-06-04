/**
 * LoginController
 *
 * @description :: Server-side logic for managing logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//var logindata = require('../models/login');

var registersucess = null;
var loginform = function(req,res) {
	//console.log(req.session);
		res.render('userlogin',{title:'Let\'s Login'});

}
var signinform = function(req,res){
	 res.render('register',{title:'Let\'s Register',register:registersucess});
}

var logout = (req,res,next) =>{
	console.log('I M Logout');
	Login.findOne(req.session.user.id,(err,userdet)=>{

		if(err) return next(err);
	if(!userdet) {
				noAcc = {name:'NoAccountExists'};
				req.session.flash = {
					err:noAcc,
				}
			return	res.redirect('/');

	}

	userId = req.session.user.id;

	Login.update(userId,{'online':0},function ee(err){
			console.log('Entring log');
		if(err) return next(err);

		req.session.destroy();

		return res.redirect('/');

	});


	});


};



//Register User in DB
var registeruser = (req,res,next) => {

	if(req.method == "POST"){

var userData {
	firstname:req.params('firstname'),
	lastname:req.params('lastname'),
	email:req.params('email'),
	contact:req.params('contact'),
	admin:req.params('admin') // remove this feild from register Form and From Inside only Deafult Admin can make and remove admins
	}



	Login.create(userData,(err,login)=>{

			if(err) {
					//console.log(err);

					req.session.flash = {
						err:err,
					};

				}else{
				req.session.flash = {success:'Successfully Registered!'}; //if we go on login page

				}
				req.session.authenticated = true;
				req.session.user = login;
				req.session.user.online = true;

				//res.redirect('/signin'); --to go to login page after register
				res.redirect('/user/'+login.id); //showing profile page to user
				// res.json(login);

		});

	}//if post method only then run this part

}

//Login to Inside Page and Edit his/her Profile
var loginuser = (req,res) => {

			if(!req.param('email')  ||  !req.param('password')){

					error  = {name:'EmailPasswordRequired'};
					req.session.flash=  {
						err : error,
					}
					res.redirect('/');
					return;
			}

			Login.findOneByEmail(req.param('email'),(err,userdet)=>{
				if(err) return next(err);

				if(!userdet) {
						noAcc = {name:'NoAccountExists'};
						req.session.flash = {
							err:noAcc,
					}

					res.redirect('/');
					return;
				}

				require('bcrypt').compare(req.param('password'),userdet.password,(err,valid)=>{
						if(err) return next(err);

						if(!valid) {
							noAcc = {name:'UserName/password Does not match'};
							req.session.flash = {
								err:noAcc,
							}
						res.redirect('/');
						return;
						}

						req.session.authenticated = true;
						req.session.user = userdet;
						req.session.user.online = true;
						userdet.online = 1;
						userdet.save((err,log)=>{
							if(err) return next(err);
							res.redirect('/user/'+userdet.id);
						});

				});

});

};

//show a particular user details using id
var showuser = (req,res,next) => {

	id =  (!isNaN(req.param('id')))?req.param('id'):req.session.user.id;
	//console.log(id);
	if(id){
		Login.findOne({'id':id},(err,user)=>{
			if(err) return next(err);
			if(!user) return next(err);


			res.status(200);
			res.view('profile',{'userinfo':user});
				res.end();
		});
	}else{
			res.send('No Data Found');
			res.end();
	}


};

//show all Users Details
var allusers = (req,res,next) => {

Login.find({},(err,users)=>{
	if(err) return next(err);
	if(!users) return next(err);


	res.status(200);
	res.view('profile',{'userinfo':users});
		res.end();
});

}
//edit user by id
var edituser = (req,res,next) => {
	id =  (req.param('id'))?req.param('id'):false;
	if(id){
		Login.findOne({'id':req.param('id')},(err,user)=>{
			if(err) return next(err);
			if(!user) return next(err);

			res.status(200);
			res.view('edituser',{'user':user});
				res.end();
		});
	}else{
		res.badRequest(404);
	}
};
//Update action to update database
var updateuser = (req,res,next) => {
	Login.update(req.param('id'),req.params.all(),(err)=>{
		if(err) {
			return res.redirect('/useredit/'+req.param('id'));
		}

			res.redirect('/user/'+req.param('id'));
	});


};




//del user by id
var deluser = (req,res,next) => {

	id =  (req.param('id'))?req.param('id'):false;
	if(id){
		Login.findOne({'id':req.param('id')},(err,user)=>{
			if(err) return next(err);
			if(!user) return next('User Not Found');

			Login.destroy(req.param('id'),(err)=>{
						if(err) return next(err);
			});

		res.redirect('/alluser');

		});
	}else{
		res.badRequest();
	}



};


module.exports = {
login: loginform,
logout: logout,
signin: signinform,
registerUser:registeruser,
loginUser:loginuser,
userById:showuser,
allUsers:allusers,
delUserById:deluser,
editUserById:edituser,
updateUser:updateuser,
};

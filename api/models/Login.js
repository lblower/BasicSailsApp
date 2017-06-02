/**
 * Login.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {

  schema:true,
  attributes: {
      firstname:{
        type : 'string',
        required: true
      },
      lastname:{
        type : 'string',
        required: true
      },
      password:{
        type : 'string',
        required: true,

      },
      email:{
        type : 'string',
        required: true,
        email:true,


      },
       contact:{
        type : 'string',

      },
      admin:{
       type : 'boolean',
       defaultsTo:false

     },
     online:{
      type : 'boolean',
      defaultsTo:false

    },
      toJSON: function(){
        obj = this.toObject();
        delete obj.password;
        return obj;
      }

  },
  beforeCreate(values,next){ //encrypting password while creation

      require('bcrypt').hash(values.password,10,(err,password)=>{
        if(err) return next(err);
        console.log(password);
        values.password = password;
        next();
      });
  },
  beforeValidation(values,next){ //Checking the Admin or not and assiging value as per that
      if(typeof values.admin === 'undefined'){ return next();}
      if(values.admin === 'unchecked'){ values.admin = 0; }
      else if(values.admin === true){ values.admin = 1; }

        next();

  },
  beforeUpdate(values,next){ //encrypting password while Updating

      if(!values.password){ return next();}

      require('bcrypt').hash(values.password,10,(err,password)=>{
        if(err) return next(err);

        values.password = password;

        next();
      });
  },
};

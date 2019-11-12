var mongoose = require("mongoose");

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc', config.password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
  } 

  function decrypt(text){
    if (text === null || typeof text === 'undefined') {return text;};
    var decipher = crypto.createDecipher('aes-256-cbc', config.password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
  }

var UserSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: {type: String, get: encrypt, set: decrypt},
    rentalLog: [{bookId: String, logId: String, isReturned: false},]
},  {timestamps: {createdAt: "rentalAt"}});

module.exports = mongoose.model('user', UserSchema);
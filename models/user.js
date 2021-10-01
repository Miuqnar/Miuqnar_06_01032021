const mongooso        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongooso.Schema({
    email:    { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

//application du validator au schema avant de faire un modele
userSchema.plugin(uniqueValidator);
module.exports = mongooso.model('User', userSchema);
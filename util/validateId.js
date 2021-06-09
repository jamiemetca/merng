const mongoose = require( "mongoose" );
const ObjectId = mongoose.Types.ObjectId;

const validateId = id => {
  if( !ObjectId.isValid( id ) ) {
    throw Error( "Invalid ID: " + id );
  }
}

module.exports = { validateId };
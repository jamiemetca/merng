import React from "react";


const Errors = props => {
  const { errors } = props;
  return (
    <div className=" ui error message" >
      <ul className="list" >
        { Object.values( errors ).map( error => <li key={ error } >{ error }</li> ) }
      </ul>
    </div>
  );
};

export default Errors;
import React, { useState, useEffect, useContext } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link, useLocation } from "react-router-dom";

import { AuthContext } from "../Context/Auth";

const MenuBar = props => {
  const [ activeItem, setActiveItem ] = useState( "home" );
  const { pathname } = useLocation();
  const { user, logout } = useContext( AuthContext );

  useEffect(() => {
    const pathRoute = pathname.split( '/' );
    setActiveItem( pathRoute[ 1 ] || "home" );
  },[ pathname ])

  const handleItemClick = (e, { name } ) => setActiveItem( name );

  let rightLinks = (
    <>
      <Menu.Item
        name='login'
        active={activeItem === 'login'}
        onClick={handleItemClick}
        as={ Link }
        to="/login"
      />
      <Menu.Item
        name='register'
        active={activeItem === 'register'}
        onClick={handleItemClick}
        as={ Link }
        to="/register"
      />
    </>
  );

  if( user ) {
    rightLinks = (
      <Menu.Item
        name='logout'
        active={activeItem === 'logout'}
        onClick={ logout }
        as={ Link }
        to="/login"
      />     
    )
  }

    return (
        <Menu pointing secondary size="massive" color="teal" >
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={ Link }
            to="/">{ user?.username || "Home" }</Menu.Item>
          <Menu.Menu position='right'>
            { rightLinks }
          </Menu.Menu>
        </Menu>
    )
};

export default MenuBar;
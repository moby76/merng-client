// import React, { Component } from 'react'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { AuthContext } from '../context/auth'

export default function MenuBar() {

   //получить функцию выхода из системы и константу из контекста 
   const { logout, user } = useContext(AuthContext)

   //для обратной активации ссылок(при попадании на какую-либо страницу извне)
      //получить значение из браузера
   const pathname = window.location.pathname
   // const {pathname} = useLocation()

   //создать конст. path которая будет принимать значение в зависимости от значения строки браузера pathname
      //если pathname = "/" то принимает значение home иначе - значение из строки браузера без 1-го символа ("/")
   let path = pathname === '/' ? 'home' : pathname.substring(1)

   //инициируем состояние для активного пункта меню. По умолчанию - это переменная path --^
   const [activeItem, setActiveItem] = useState(path)

   //обработчик поведения при нажатии на пункт меню - подставляет/меняет значение активного пункта на тот значение которого передаётся из Menu.Item 
      //метод addEventListener. первый параметр - event опускаем 
   const handleItemClick = (_, { name }) => setActiveItem(name)

   //реализовать различный показ меню в зависимости от того: пользователь вошёл в систему или нет(Динамическое меню)
      //сначала создать константу 
   const menuBar = user ? (
      <Menu pointing secondary size="massive" color="teal">
         <Menu.Item
            //если пользователь в системе - то название пункта меню будет = имени пользователя
            name={user.userName}
            //он всегда будет активным
            active
            // onClick={handleItemClick}
            as={Link}
            to="/"
         />
         <Menu.Menu position='right'>
            <Menu.Item
               //вместо ссылки login поменять на logout
               // name='login'
               name='logout'
               //всегда будет неактивна
               // active={activeItem === 'login'}
               //по нажатию будет срабатывать ф-ция logout
               onClick={logout}
               // as={Link}
               // to="/login"
            />
            {/* деактивировать ссылку для регистрации */}
            {/* <Menu.Item
               name='register'
               active={activeItem === 'register'}
               onClick={handleItemClick}
               as={Link}
               to="/register"
            /> */}
         </Menu.Menu>
      </Menu>
   ) : (
      <Menu pointing secondary size="massive" color="teal">
         <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
         />
         <Menu.Menu position='right'>
            <Menu.Item
               name='login'
               active={activeItem === 'login'}
               onClick={handleItemClick}
               as={Link}
               to="/login"
            />
            <Menu.Item
               name='register'
               active={activeItem === 'register'}
               onClick={handleItemClick}
               as={Link}
               to="/register"
            />
         </Menu.Menu>
      </Menu>
   )

   return  menuBar
         
}
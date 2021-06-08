//функция высшего порядка.
//здесь происходит перехват при попытке перейти на страницы входа в систему/регистрации
//происходит перенаправление пользователя в зависимости от того в системе он или нет.
//если пользователь в системе - то перебрасывается на главную, иначе редирект на компонент(<Login>/<Register> и т.д.)

import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { AuthContext } from '../context/auth'

export default function AuthRoute({ component: Component , ...rest}) {

   const { user } = useContext(AuthContext)

   return (
      <Route
      {...rest}
      render = {(props) => 
         user ? <Redirect  to="/" /> : <Component {...props} />
      }
      />
   )
}

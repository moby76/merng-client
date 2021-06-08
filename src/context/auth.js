//создать контекст для статуса пользователя - в системе или нет

import { createContext, useReducer } from "react";

import jwtDecode from 'jwt-decode'

//начальное значение
const initialState = {
   user: null
}

//сначала выполнить проверку на наличие токена пользователя во временном хранилище
if(localStorage.getItem('jwtToken')){//если токен создан:
   //прежде всего его нужно декодировать (библиотека jwt-decode)
   const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

      //далее проверить - время действия токена (expiration time) = exp 
      if(decodedToken.exp * 1000 < Date.now()){//если меньше чем время на данный момент - 
         //удалить токен
         localStorage.removeItem('jwtToken')
      } else {//иначе
         //начальное значение.пользователь - получает значение декодированного токена
         initialState.user = decodedToken
      }
}


const AuthContext = createContext({
   user: null,
   login: (userData) => { },
   logout: () => { }
})

//создать редуктор
function authReducer(state, action) {
   switch (action.type) {
      case 'LOGIN':
         return {
            ...state,
            user: action.payload
         }
      case 'LOGOUT':
         return {
            ...state,
            user: null
         }

      default:
         return state
   }
}

//создать провайдер контекста
function AuthProvider(props) {
   //используем хук редуктора с редуктором authReducer и состояние по умолчанию - пользователь неактивирован(не в системе)
   const [state, dispatch] = useReducer(authReducer, initialState)

   //функция входа в систему
   function login(userData){
      //реализовать сохранение токена пользователя в локальном хранилище для предотвращения сброса логина при перезагрузке страниц
      localStorage.setItem('jwtToken', userData.token)

      dispatch({
         type: 'LOGIN',
         payload: userData
      })
   }

   //функция для выхода из системы
   function logout(){
      //удалить токен из локального хранилища
      localStorage.removeItem('jwtToken')

      dispatch({
         type: 'LOGOUT'
      })
   }

   //вернуть провайдер
   return(
      <AuthContext.Provider
      value = {{user: state.user, login, logout}}
      {...props}
      />
   )
}

export {AuthContext, AuthProvider}
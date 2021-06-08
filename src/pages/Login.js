//страница для входа в систему 

import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

export default function Login(props) {

   //получим контекст авторизации(НЕ переделывать на дефрагментацию для удобочитаемости)
   const context = useContext(AuthContext)

   //создать константу для блока ошибок 
   const [errors, setErrors] = useState({})

      //получаем универсальные ф-ции реагирования(хендлеры) и значения изменённых полей из хука useForm, 
   //передав туда функцию addUser(registerUser) в виде callback-ф-ции и значений по умолчению в виде второго аргумента
   const { onChange, onSubmit, values } = useForm(loginUserCallback, {
      userName: '',
      // email: '',
      password: '',
      // confirmPassword: ''
   })

   // хук useMutation позволяет отправлять обновления на ваш сервер GraphQL
   //Хук useMutation не выполняет автоматически переданную вами мутацию при рендеринге компонента.
   //Вместо этого он возвращает кортеж с функцией изменения в его первой позиции (loginUser)
   const [loginUser, { loading }] = useMutation(LOGIN_USER, {
      // update(_, result) {      
      update(_, {data: {login: userData} }) {//userData - алиас данных мутации login
         // console.log(result.data.login)
         //получим ф-цию login из контекста авторизации и передать в неё значения полученные из бэкенда(имя пользователя и пароль)
         // context.login(result.data.login)
         context.login(userData)
         props.history.push('/')//данная конструкция перебросит на главную страницу после успешной регистрации
      },
      onError(err) {
         // console.log(err.graphQLErrors[0].extensions.exception.errors)
         setErrors(err.graphQLErrors[0].extensions.exception.errors)
         console.error(err)
      },
      variables: values
   })

   function loginUserCallback (){
      loginUser()
   }

   return (
      <div className="form-container">
         <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : 'erert'}>
            <h1>Login</h1>
            <Form.Input
               label="Username"
               placeholder="Username.."
               name="userName"
               type="text"
               value={values.userName}
               //
               error={errors.userName ? true : false}
               onChange={onChange}
            />

            <Form.Input
               label="Password"
               placeholder="Password.."
               name="password"
               type="password"
               value={values.password}
               error={errors.password ? true : false}
               onChange={onChange}
            />

            <Button type="submit" primary>
               Login
            </Button>
         </Form>
         {Object.keys(errors).length > 0 && (
            <div className="ui error message">
               <ul className="list">
                  {Object.values(errors).map(value => (
                     <li key={value}>
                        {value}
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   )
}

//создать мутацию для graphql
const LOGIN_USER = gql`
   # задействуем мутацию register из бэкенда/резольверов (graphql)
   mutation login(
      #переменные которые будут в мутации
      $userName: String!
      # $email: String!
      $password: String!
      # $confirmPassword: String!
   ){
      login(
         #в файле typeDefs
         # registerInput: {
            userName: $userName
            # email: $email
            password: $password
            # confirmPassword: $confirmPassword
         # }
      ){
         #получить некоторые поля назад(в ответ)
         id
         email
         userName         
         createdAt
         token
      }
   }
`
//Страница регистрации нового пользователя

import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

export default function Register(props) {

   //получим контекст авторизации(НЕ переделывать на дефрагментацию для удобочитаемости)
   const context = useContext(AuthContext)

   //создать константу для блока ошибок 
   const [errors, setErrors] = useState({})

   //начальные значения для полей
   // const initialState = { 
   //    userName: '',
   //    email: '',
   //    password: '',
   //    confirmPassword: ''
   // }

   //создать константу для значений полей регистрации
   // const [values, setValues] = useState({
   //    userName: '',
   //    email: '',
   //    password: '',
   //    confirmPassword: ''
   // })

   //получаем универсальные ф-ции реагирования(хендлеры) и значения изменённых полей из хука useForm, 
   //передав туда функцию addUser(registerUser) в виде callback-ф-ции и значений по умолчению в виде второго аргумента
   const { onChange, onSubmit, values } = useForm(registerUser, {
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
   })

   // const onChange = (event) => {
   //    //при изменении в поле ввода присваиваем значение полю в зависимости от ключа по индексу [event.target.name]
   //    setValues({ ...values, [event.target.name]: event.target.value })
   // }

   // хук useMutation позволяет отправлять обновления на ваш сервер GraphQL
   // Хук useMutation не выполняет автоматически переданную вами мутацию при рендеринге компонента.
   // Вместо этого он возвращает кортеж с функцией изменения в его первой позиции (addUser)
   const [addUser, { loading }] = useMutation(REGISTER_USER, {
      update(_, {data: {register: userData} }) {//userData - алиас данных мутации register
         // console.log(result)
         //
         context.login(userData)
         props.history.push('/')//данная конструкция перебросит на главную страницу после успешной регистрации
      },
      onError(err) {
         // console.log(err.graphQLErrors[0].extensions.exception.errors)
         setErrors(err.graphQLErrors[0].extensions.exception.errors)
      },
      variables: values
   })

   // const onSubmit = (event) => {
   //    //отменим реакцию по умолчанию для формы
   //    event.preventDefault()
   //    addUser()
   // }

   // декларируем ф-цию addUser в registerUser
   function registerUser(){
      //вызов ф-ции addUser
      addUser()
   }

   return (
      <div className="form-container">
         <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : 'erert'}>
            <h1>Register</h1>
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
               label="Email"
               placeholder="Email.."
               name="email"
               type="email"
               value={values.email}
               error={errors.email ? true : false}
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

            <Form.Input
               label="Confirm password"
               placeholder="Confirm password.."
               name="confirmPassword"
               type="password"
               value={values.confirmPassword}
               error={errors.confirmPassword ? true : false}
               onChange={onChange}
            />

            <Button type="submit" primary>
               Register
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
const REGISTER_USER = gql`
   # задействуем мутацию register из бэкенда/резольверов (graphql)
   mutation register(
      #переменные которые будут в мутации
      $userName: String!
      $email: String!
      $password: String!
      $confirmPassword: String!
   ){
      register(
         #в файле typeDefs
         registerInput: {
            userName: $userName
            email: $email
            password: $password
            confirmPassword: $confirmPassword
         }
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
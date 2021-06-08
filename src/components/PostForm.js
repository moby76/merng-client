import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { Fragment } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { FETCH_POSTS_QUERY } from '../util/graphql'
import { useForm } from '../util/hooks'


export default function PostForm() {

   //получаем:значения  из кастомного хука useForm, передав в него начальное значение значение вторым аргументом и ф-цию первым аргументом
   const { values, onChange, onSubmit } = useForm(createPostCallback, {
      body: ''
   })

   //для создания поста нужен хук useMutation из apollo/client
   const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
      //и передадим туда значения из формы в качестве переменных
      variables: values,
      
      //создать возможность для изменения закэшированных данных, что-бы избежать каждый раз выполнять запросы на сервер  
      //проксируем(перехватим) метод update из apollo/client - https://www.apollographql.com/docs/react/caching/cache-interaction/#readquery
      update(proxy, result) {
         //получим данные из кэша
         const data = proxy.readQuery({
            //запрос: на получение постов
            query: FETCH_POSTS_QUERY
         })

         //т.к. запрос --^ содержит в себе асинхронный запрос сервера - async getPosts() 
         //следующая конструкция задействует новые данные для мутации createPost
         //перезапишет данные и вернёт         
         //сохранить/записать изменения в основном запросе FETCH_POSTS_QUERY. Метод writeQuery
         proxy.writeQuery({
            query: FETCH_POSTS_QUERY,
            data: {
               getPosts: [result.data.createPost, ...data.getPosts]
            }
         })//

         // console.log(result)
         //и сбросить значение поля body 
         values.body = ''
      },
      onError(err) {//<== also add this so the page doesn't break
         console.error(err)
         //   return error;
      },
   })

   //в callback-функцию обработчик передадим createPost --^
   function createPostCallback() {
      createPost()
   }

   return (
      <Fragment>
         <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
            <Form.Field>
               <Form.Input
                  placeholder="Hi World!"
                  name="body"
                  onChange={onChange}
                  value={values.body}
                  error={error ? true : false}
               />
               <Button type="submit" color="teal">
                  Submit
            </Button>
            </Form.Field>
         </Form>
         {/* блок с ошибками */}
         {error && (
            <div className="ui error message" style={{ marginBottom: 20 }}>
               <ul className="list">
                  <li>{error.graphQLErrors[0].message}</li>
               </ul>
            </div>
         )}
      </Fragment>
   )
}

//создать мутацию(аналог POST-запроса) для создания поста
const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!){
   # передадим в createPost переменную $body для значения body
   createPost(body: $body){
      # получим в ответ:
      id 
      body 
      createdAt 
      userName
      likes{
         id 
         userName 
         createdAt
      }
      likeCount
      comments{
         id 
         body 
         userName 
         createdAt
      }
      commentCount
   }
}
`

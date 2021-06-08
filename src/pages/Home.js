//получить хук запроса из Аполло-клиента
import { useQuery } from '@apollo/client'

//создаём экземпляр для преобразования строковых запросов к graphql в схему
// import gql from 'graphql-tag'
import { useContext } from 'react'

import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'
import { AuthContext } from '../context/auth'
import { FETCH_POSTS_QUERY } from '../util/graphql'//получим схему-запроса на получение постов из утилиты graphql.js

export default function Home() {

   const { user } = useContext(AuthContext)

   //получим варианты итогов результата запроса FETCH_POSTS_QUERY из хука useQuery
   //и создать алиас для типа запроса getPosts = posts
   const { loading, data: { getPosts: posts } = {} } = useQuery(FETCH_POSTS_QUERY)

   // проверка
   // if(getPosts){
   // console.log(getPosts)
   // }

   return (
      <Grid columns={3}>
         <Grid.Row className="page-title">
            <h1>Recent Posts</h1>
         </Grid.Row>
         <Grid.Row>
            {user && (
               <Grid.Column>
                  {/* форма для создания поста */}
                  <PostForm />
               </Grid.Column>
            )}
            {loading ? (
               <h1>Loading posts...</h1>
            ) : (
                  <Transition.Group>
                     {posts && posts.map(post => (
                        <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                           {/* компонент PostCard с переданным в него постом из массива posts */}
                           <PostCard post={post} />
                        </Grid.Column>
                     ))}
                  </Transition.Group>

               )}
         </Grid.Row>
      </Grid>
   )
}

//константу-запрос на получение всех постов
// const FETCH_POSTS_QUERY = gql` 
//    {
//       getPosts{
//          id 
//          body 
//          createdAt 
//          userName 
//          likeCount 
//          likes{
//             userName 
//          }
//          commentCount
//          comments{
//             id 
//             userName 
//             createdAt 
//             body
//          }
//       }
//    }
// `


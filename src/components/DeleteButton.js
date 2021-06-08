
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Button, Confirm, Icon } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'//получить массив постов 
import MyPopup from '../util/MyPopup'

function DeleteButton({ postId, commentId, callback }) {

   //создать стейт для подтверждения удаления поста
   const [confirmOpen, setConfirmOpen] = useState(false)

   //создать константу для динамического выбора мутации
   //если в пропсах прилетает commentId, то mutation принимает значение DELETE_COMMENT_MUTATION, иначезначение = DELETE_POST_MUTATION 
   const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

   //активируем мутацию на удаление поста с бэкэнда
   const [deletePostOrComment] = useMutation(mutation, {
      variables: {
         postId,
         commentId
      },
      update(proxy) {//proxy для перехвата и удаления поста из кеша
         //при обновлении закрыть окно подтверждения
         setConfirmOpen(false)

         //удалить пост из кэша
         //будет выполняться только если из пропсов не значение commentId при условии
         if (!commentId) {

            //сначала записать массив постов в данные проксирования
            const data = proxy.readQuery({
               query: FETCH_POSTS_QUERY
            })

            //записать изменения в кэш         
            proxy.writeQuery({
               query: FETCH_POSTS_QUERY,
               data: {// новые данные для --^
                  //отфильтровать их и перезаписать массив, исключив из них текущий пост по id
                  getPosts: data.getPosts.filter((p) => p.id !== postId)
               }
            });
         }

         // если в пропсы передана callback-ф-ция то активируем её
         if (callback) { callback() }
      },

   })

   return (
      <>
         {/* кнопка удаления поста. Обёрнута в кастомный попап(tooltips) из '../util/MyPopup' */}
         <MyPopup
            content={commentId ? 'Delete comment' : 'Delete a Post'}
            // inverted
            // trigger={

            // }
         >
            {/* сама кнопка */}
            <Button
               as="div"
               color="red"
               floated="right"
               onClick={() => setConfirmOpen(true)}
            >
               <Icon name="trash" style={{ margin: 0 }} />
            </Button>
         </MyPopup>


         {/* окно подтверждения */}
         <Confirm
            // открыт при положительном состоянии/значении константы confirmOpen
            open={confirmOpen}
            // для отмены
            onCancel={() => setConfirmOpen(false)}
            // для подтверждения удаления передадим 
            onConfirm={deletePostOrComment}
         />
      </>
   )
}

// создать запрос/мутацию на удаление поста
const DELETE_POST_MUTATION = gql`
   mutation deletePost($postId: ID!){
      deletePost(postId: $postId)
   }
`

// создать запрос/мутацию на удаление комментария
const DELETE_COMMENT_MUTATION = gql`
   mutation deleteComment($postId: ID!, $commentId: ID!){
      deleteComment(postId: $postId, commentId: $commentId){
         id
         comments{
            id
            userName
            createdAt
            body
         }
         commentCount
      }
   }
`

export default DeleteButton
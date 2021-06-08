import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react'
import MyPopup from '../util/MyPopup'

export default function LikeButton({user, post: { id, likes, likeCount } }) {

   const [liked, setLiked] = useState(false)

   useEffect(() => {

      //сначала проверить и выполнить условие:
      //если пользователь и имя пользователя лайка = имени вошедшего в систему пользователя 
      if (user && likes.find(like => like.userName === user.userName)) {
         //тогда меняем значение liked на  true
         setLiked(true)
      } else setLiked(false)//иначе false
   }, [user, likes])


   const [likePost] = useMutation(LIKE_POST_MUTATION, {
      variables: {postId: id}//id из пропсов
   })

   const likeButton = user ? (
      liked ? (//
         <Button color='teal'>
            <Icon name='heart' />
         </Button>
      ) : (
         <Button color='teal' basic>
            <Icon name='heart' />
         </Button>
      )
   ) : (
      <Button as={Link} to="/login" color='teal' basic>
            <Icon name='heart' />
         </Button>
   )

   return (
      <Button as='div' labelPosition='right' onClick={likePost}>
         {/* константу likeButton обернём в tooltips-компонент MyPopup передав в него динамический контент/заполнитель */}
         <MyPopup
            content={liked ? 'Unlike' : 'Like'}
         >
            {likeButton}
         </MyPopup>
         
         {/* счётчик лайков */}
         <Label basic color='teal' pointing='left'>
            {likeCount}
         </Label>
      </Button>
   )
}

const LIKE_POST_MUTATION = gql`
   # создать локальный запрос/мутацию likePost с передачей в него переменной = ID поста
   mutation likePost($postId: ID!){
      # задействуем мутацию likePost
      likePost(postId: $postId){
         # получим
         id
         likes{
            id userName
         }
         likeCount
      }
   }
`
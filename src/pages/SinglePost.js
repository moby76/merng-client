import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useContext, useRef, useState } from 'react'
import { Button, Card, Form, Grid, Icon, Image, Label } from 'semantic-ui-react'
import moment from 'moment'
import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton'
import DeleteButton from '../components/DeleteButton'
import MyPopup from '../util/MyPopup'

export default function SinglePost(props) {

   const postId = props.match.params.postId
   const { user } = useContext(AuthContext)

   const commentInputRef = useRef(null)

   //создать константу для комментариев и ф-цию влияющую на неё
   const [comment, setComment] = useState('')
   // console.log(postId)

   //получим данные с сервера используя хук useQuery и передав в запрос константу postId в качестве переменной
   const {
      data: { getPost } = {}// = {} !!!
   } = useQuery(FETCH_POST_QUERY, {
      variables: {
         postId
      },
      onError(err) {
         console.log(err)
      }
   })

   //реализуем добавление комментария с помощью мутации createComment(SUBMIT_COMMENT_MUTATION)
   const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
      update() {
         //при обновлении обнулим значение поля формы комментария
         setComment('')
         //и отменим фокусировку для текущего состояния - метод blur
         commentInputRef.current.blur()
      },
      variables: {
         postId,
         body: comment
      }
   })

   //ф-ция которая перекидывает на главную страницу
   function deletePostCallback() {
      props.history.push('/')
   }

   //разметка поста
   let postMarkup//объявим ПЕРЕМЕННУЮ

   //условие
   if (!getPost) {
      postMarkup = <p>Loading Post...</p>
   } else {//Если данные получены то:
      //деструктурируем данные
      const { id, createdAt, body, userName, comments, likes, likeCount, commentCount } = getPost

      postMarkup = (
         <Grid>
            <Grid.Row>
               <Grid.Column width={2}>
                  <Image
                     src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                     size="small"
                     floated="right"
                  />
               </Grid.Column>
               <Grid.Column width={10}>
                  <Card fluid>
                     <Card.Content>
                        <Card.Header>{userName}</Card.Header>
                        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                        <Card.Description>{body}</Card.Description>
                     </Card.Content>
                     <hr />
                     <Card.Content extra>
                        <LikeButton user={user} post={{ id, likeCount, likes }} />

                        {/* кнопка комментария поста */}
                        <MyPopup
                           content="Comment on Post"
                        >
                           <Button
                              as="div"
                              labelPosition="right"
                           // onClick={() => console.log('Comment on post')}
                           >
                              <Button basic color="blue">
                                 <Icon name="comments" />
                              </Button>
                              <Label basic color="blue" pointing="left">
                                 {commentCount}
                              </Label>
                           </Button>
                        </MyPopup>


                        {/* кнопка/компонент удаления поста */}
                        {user && user.userName === userName &&
                           <DeleteButton
                              //передать в компонент id поста
                              postId={id}
                              //передать callback
                              callback={deletePostCallback}
                           />}
                     </Card.Content>
                  </Card>
                  {/* создадим возможность добавления комментария */}
                  {user && (
                     <Card fluid>
                        {/* создать форму для заполнения */}
                        <Card.Content>
                           <p>Post a comment</p>
                           <Form>
                              <div className="ui action input fluid">
                                 <input
                                    type="text"
                                    placeholder="comment..."
                                    name="comment"
                                    value={comment}
                                    onChange={event => setComment(event.target.value)}
                                    // Атрибут React - ref принимает функцию обратного вызова, 
                                    // и вызывает ее после того, как компонент монтируется в DOM или удаляется из него.
                                    ref={commentInputRef}
                                 />
                              </div>
                              <button
                                 type="submit"
                                 className="ui button teal"
                                 //кнопка не активна при пустом значении поля
                                 disabled={comment.trim() === ''}
                                 //при нажатии вызываем ф-цию submitComment
                                 onClick={submitComment}
                              >
                                 Submit
                              </button>
                           </Form>
                        </Card.Content>
                     </Card>
                  )}
                  {/* отобразим комментарии */}
                  {comments.map((comment) => (
                     <Card fluid key={comment.id}>
                        <Card.Content>
                           {/* добавим кнопку удаления коммента */}
                           {/* если пользователь из контекста и имя пользователя совпадает с именем пользователя комментария то показываем компонент <DeleteButton> */}
                           {user && user.userName === comment.userName && (
                              <DeleteButton postId={id} commentId={comment.id} />
                           )}
                           <Card.Header>{comment.userName}</Card.Header>
                           <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                           <Card.Description>{comment.body}</Card.Description>
                        </Card.Content>
                     </Card>
                  ))}
               </Grid.Column>
            </Grid.Row>
         </Grid>
      )
   }

   //вернём разметку
   return postMarkup
}

// запрос на получение поста
const FETCH_POST_QUERY = gql`
   query($postId: ID!){
      getPost(postId: $postId){
         id
         body 
         createdAt 
         userName 
         likeCount
         likes{
            userName
         }
         commentCount
         comments{   
            id 
            userName 
            createdAt 
            body 
         }
      }
   }
`

// Запрос/мутация для создания комментария
const SUBMIT_COMMENT_MUTATION = gql`
   mutation($postId: ID!, $body: String!){
      createComment(postId: $postId, body: $body){
         id
         comments{
            id
            body
            createdAt
            userName
         }
         commentCount
      }
   }
`

import React, { useContext } from 'react'
import { Button, Card, Icon, Image, Label, Popup } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import DeleteButton from './DeleteButton'
import MyPopup from '../util/MyPopup'

function PostCard({ post: { body, createdAt, id, userName, likeCount, commentCount, likes } }) {

   const { user } = useContext(AuthContext)

   // function likePost() {
   //    console.log('like Post!!')
   // }

   // function commentOnPost(){
   //    console.log('Comment post')
   // }

   return (
      <Card fluid>
         <Card.Content>
            <Image
               floated='right'
               size='mini'
               src='https://react.semantic-ui.com/images/avatar/large/molly.png'
            />
            <Card.Header>{userName}</Card.Header>
            <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
            <Card.Description>
               {body}
            </Card.Description>
         </Card.Content>
         <Card.Content extra>

            {/* компонент/кнопка LikeButton //передадим некоторые значения из поста*/}
            <LikeButton user={user} post={{ id, likes, likeCount }} />
            {/* кнопка с комментариями и счётчик комментариев */}
            <MyPopup
               content="Comment on Post"
               // inverted
               // trigger={
                  
               // }
            >
               {/* кнопка с комментариями */}
                  <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                     <Button color='blue' basic>
                        <Icon name='comments' />
                     </Button>
                     <Label basic color='blue' pointing='left'>
                        {commentCount}
                     </Label>
                  </Button>
            </MyPopup>

            {/* кнопка/компонент удаления поста */}
            {/* если имя текущего пользователя совпадает с именем создавшего пост то доступ кнопки удаления поста*/}
            {user && user.userName === userName && <DeleteButton postId={id} />}

         </Card.Content>
      </Card>
   )
}

export default PostCard

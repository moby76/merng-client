// утилита с попапом/tooltips

import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function MyPopup({ content, children }) {//children - тот компонент из которого пришёл заполнитель-content
   return (
     <Popup inverted content={content} trigger={children} />
   )
}

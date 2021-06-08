//создать кастомный хук useForm для: входа в систему, создания постов

import { useState } from "react"


export const useForm = (callback, initialState = {}) => {//первый параметр - функция переданная из компонента, второй - начальное значение из компонента 

   
   //создать константу для значений полей входа/регистрации/заполнения тела поста
   const [values, setValues] = useState(initialState)

   //хендлер на изменения значений полей формы
   const onChange = (event) => {
      //при изменении в поле ввода присваиваем значение полю в зависимости от ключа по индексу [event.target.name]
      setValues({ ...values, [event.target.name]: event.target.value })
   }

   //хендлер на отправку формы(при нажатии на кнопку submit)
   const onSubmit = (event) => {
      //сбросить поведение формы по умолчанию
      event.preventDefault()
      //возвратную функцию()
      callback()      
   }

   return{
      onChange,
      onSubmit,
      values
   }
}

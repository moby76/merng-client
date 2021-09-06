//1 Нужно обернуть приложение в Аполло-провайдер
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, createHttpLink } from '@apollo/client'
import { setContext } from "apollo-link-context";

//1.
//создать константу - подключение к graphQL
// Клиент Apollo использует HttpLink Apollo Link для отправки запросов GraphQL через HTTP.
const httpLink = createHttpLink({
   //заменить перед деплоем на git & Netlify
   uri: 'https://floating-spire-77624.herokuapp.com/graphql'
})

//2.
//Включаем заголовок авторизации в запрос
//Функция setContext принимает функцию, которая возвращает либо объект, либо обещание, которое затем возвращает объект для установки нового контекста запроса.
//https://www.apollographql.com/docs/react/api/link/apollo-link-context/
const authLink = setContext(() => {
   //получим токен из локального хранилища
   const token = localStorage.getItem('jwtToken')
   //вернуть модифицированный запрос 
   //получить хеадеры
   return {
      headers: {
         //если токен получен то подставить его в строку хеадера отвечающую за авторизацию через токен, иначе передать пустую строку на сервер
         Authorization: token ? `Bearer ${token}` : '',
         // "Access-Control-Allow-Origin": "https://floating-spire-77624.herokuapp.com/"
      }
   }
})

//3.
const client = new ApolloClient({
   //передать в ApolloClient  link состоящий из объединённых authLink + httpLink
   link: authLink.concat(httpLink),
   cache: new InMemoryCache(),//хранилище временных данных на клиенте   
   credentials: 'include' // получение/отправка запросов из любых источников
   // credentials: 'same-origin' //принимаются данные только если клиент и сервер на одном источнике
   // credentials: 'omit' //запрет на отправку/получение запросов
})



export default (
   <ApolloProvider client={client}>
      <App />
   </ApolloProvider>
)
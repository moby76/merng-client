//1 Нужно обернуть приложение в Аполло-провайдер
import App from './App'
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, createHttpLink } from '@apollo/client'
import { setContext } from "@apollo/client/link/context";

//1.
//создать константу - подключение к graphQL
// Клиент Apollo использует HttpLink Apollo Link для отправки запросов GraphQL через HTTP.
const httpLink = createHttpLink({
   //заменить перед деплоем на git & Netlify
   uri: 'https://floating-spire-77624.herokuapp.com/graphql'
})

//2.
//Для самоидентификации при использовании HTTP Включаем заголовок авторизации в запрос
//Функция setContext принимает функцию, которая возвращает либо объект, либо обещание, которое затем возвращает объект для установки нового контекста запроса.
//https://www.apollographql.com/docs/react/api/link/apollo-link-context/
const authLink = setContext((_, { headers }) => {
   //получить токен аутентификации из локального хранилища, если он существует
   const token = localStorage.getItem('jwtToken')
   //вернуть модифицированный запрос 
   //вернуть заголовки в контекст, чтобы httpLink мог их прочитать
   return {
      headers: {
         ...headers,
         //если токен получен то подставить его в строку хеадера отвечающую за авторизацию через токен, иначе передать пустую строку на сервер
         Authorization: token ? `Bearer ${token}` : '',
         //Сервер может использовать этот заголовок для аутентификации пользователя и присоединения его к контексту выполнения GraphQL, чтобы 
         //преобразователи могли изменять свое поведение в зависимости от роли и разрешений пользователя.
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
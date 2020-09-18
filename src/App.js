import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos, getTodo } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import ReactDOM from 'react-dom';

const initialFormState = { name: '', description: '' }

function AppTitle() {
  const title = <h1>カスタムテキスト</h1>;
  ReactDOM.render(title, document.getElementById('title'));
}

// function SelectedQuestion() {
//   const title = <h1>カスタムテキスト</h1>;
//   ReactDOM.render(title, document.getElementById('selectedQuestion'));
// }

function App0(props) {
  return <p>{props.tasks.join(', ')}</p>;
}

const text = <p>hello</p>;
ReactDOM.render(text, document.getElementById('inputText'));




function App() {
  const [notes, setTodos] = useState([])
  const [notesAll, setAll] = useState([])
  const [contElm, setElm] = useState([])
  const [formData, setFormData] = useState(initialFormState);


  useEffect((eventList) => {
    AppTitle()
    const qID = ['q002','q003'] // questionIDを指定
    var type = 'all';
    fetchTodos(qID, type); //クエリ処理
    // QuestionList(eventList)
    ReactDOM.render(eventList, document.getElementById('inputText'));
    console.log('hey')
  }, []);

  function appendScript(URL) {
    var el = document.createElement('script');
    el.src = URL;
    document.body.appendChild(el);
  };


  async function fetchTodos(qID, type) {
    // console.log(setTodos)
    if (type == 'all') {
      // all
      const apiData = await API.graphql({ query: listTodos });
      setAll(apiData.data.listTodos.items);
    } else {
      // part
      var contentListsPre = []
      for (let i = 0; i < qID.length; i++){
        const apiData = await API.graphql({ query: getTodo, variables: {id: qID[i]} });
        contentListsPre.push(apiData.data.getTodo)
      }
      setTodos(contentListsPre)
    }
    const URL = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML'
    appendScript(URL);
  }

  async function createTodo() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    setTodos([ ...notes, formData ]);
    setFormData(initialFormState);
  }

  async function deleteTodo({ id }) {
    const newTodosArray = notes.filter(note => note.id !== id);
    setTodos(newTodosArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } }});
  }

  // var eventList = []
  // function clickEvent() {
  //   return <Square value={i}>;
  // }

  var eventList = []
  var listString = ''
  function eventClick(id){
    if (eventList.includes(id)) {
    } else {
      eventList.push(id)
      if (listString.length == 0) {
        listString = listString + eventList[eventList.length - 1]
      } else {
        listString = listString + ', ' + eventList[eventList.length - 1]
      }
    }
    var text = listString + ' が選択されました'
    ReactDOM.render(text, document.getElementById('selectedQuestion'));
  }


  // class Square2 extends React.Component {
  //   eventClick2(id){
  //     if (eventList.includes(id)) {
  //     } else {
  //       eventList.push(id)
  //       listString = listString + eventList[eventList.length - 1]
  //     }
  //   }
  //   render() {
  //     return (
  //       <div>
  //       <p>{listString}</p>
  //       <button className="square">
  //       Square2
  //       </button>
  //       </div>
  //     );
  //   }
  // }


  function createClick(id){
    console.log(eventList)
    console.log('上記の問題を登録します')
    var type = '';
    fetchTodos(eventList, type); //クエリ処理
    // const URL = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML'
    // appendScript(URL);
}

  return (

    <div className="App">
    <p>問題を選んで作成ボタンを押すと問題集が作成されます</p>

    {/*
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createTodo}>Create Note</button>
    */}


      <div style={{marginBottom: 30}}>
        {
          notesAll.map(note => (
            <div key={note.id || note.name}>

{/*              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Checkbox aria-label="" />
                </InputGroup.Prepend>
              </InputGroup>
*/}
              <div>
              <button onClick={() => eventClick(note.id)}>{note.name}</button>
              <button onClick={() => eventClick(note.id)}>{note.id}</button>
              </div>

            </div>
          ))
        }
      </div>

      <button onClick={() => createClick()}>作成</button>

      <div>---------------------------------------------</div>
      <div style={{marginBottom: 30}}>
        {
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
            </div>
          ))
        }
      </div>
      <AmplifySignOut />
      <Square />
    </div>
  );
}


class Square extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     value: null,
  //   };
  // }
  render() {
    return (
      <button className="square">
      {this.props.value}
      </button>
    );
  }

}

export default withAuthenticator(App);

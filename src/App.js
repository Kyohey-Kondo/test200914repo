import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listTodos, getTodo } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';
import { Button, Card, Nav, Col, Row, Navbar, NavDropdown} from 'react-bootstrap';
import ReactDOM from 'react-dom';
// import Link from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialFormState = { name: '', description: '' }

const text = <p>hello</p>;
ReactDOM.render(text, document.getElementById('inputText'));


function App() {
  const [notes, setTodos] = useState([])
  const [notesAll, setAll] = useState([])
  // const [contElm, setElm] = useState([])
  const [formData, setFormData] = useState(initialFormState);

  useEffect((eventList) => {
    // 単元を一意のIDで管理し、対応させる
    var idList = []
    var ctgr = 'm1'
    var ctgrSub = 'B'
    var ctgrSubSub = 'a'
    for (let i = 0; i < 5; i++){
      idList.push(ctgr + '_' + ctgrSub + '_' + ctgrSubSub + '_' + (i+1))
    }
    // const qID = ['q001','q002','q003','q004','q005','q006','q007','q008','q009','q010'] // 因数分解
    var qID = ['q001','q002','q003','q004','q005','q006','q007','q008','q009','q010'] // 二次関数
    qID = idList
    console.log(qID)
    console.log(idList)
    var type = 'all';
    fetchTodos(qID, type); //クエリ処理
    console.log(notes)
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
      // const apiData = await API.graphql({ query: listTodos });
      // setAll(apiData.data.listTodos.items);

      var contentListsPre = []
      for (let i = 0; i < qID.length; i++){
        const apiData = await API.graphql({ query: getTodo, variables: {id: qID[i]} });
        contentListsPre.push(apiData.data.getTodo)
      }
      setAll(contentListsPre)


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
    ReactDOM.render(text, document.getElementById('sub'));
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

    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
      <Navbar.Brand href="/" to='/'>React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="pages/selectQuestions">問題集を作成する</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link href="#deets">More deets</Nav.Link>
          <Nav.Link eventKey={2} href="#memes">
            Dank memes
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>

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
            <Col>
              <Card style={{marginTop: '20px', marginLeft: '20px', marginRight: '20px'}}>
                <Card.Header>
                  <Nav variant="pills" defaultActiveKey="#first">
                    <Nav.Item style={{marginLeft: 'auto'}}>
                      <Nav.Link href="#" style={{fontSize: "10px", marginTop: "0px", marginBottom: "0px", paddingTop: '0px', paddingBottom: '0px', marginLeft: 'auto'}}>
                        {note.id}
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body onClick={() => eventClick(note.id)}>
                  {/*<Card.Title>Special title treatment</Card.Title>*/}
                  <Card.Text style={{fontSize: "15px", textAlign: 'left'}}>
                    {note.name}
                  </Card.Text>
                  {/*<Button variant="primary" onClick={() => eventClick(note.id)}>Go somewhere</Button>*/}
                </Card.Body>
              </Card>
              </Col>
            </div>
          ))
        }
      </div>

      <Button onClick={() => createClick()}>作成</Button>

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

      <div id="sub" style={{fontSize: 20}}></div>

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

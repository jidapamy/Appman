import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import { Card, Form, Input, Icon, Button, Modal, Image, Header, Container } from 'semantic-ui-react'
import cute from "./cute.png"

const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
}

class App extends Component {
  state = {
    cards: [],
    myCards: [],
    showModal: false,

    filterListCards: [],
    filterCard: false
  }

  componentDidMount = async () => {
    let data = await axios.get('http://localhost:3030/api/cards')
    console.log(data)
    this.setState({ cards: data.data.cards })
  }

  showModal = () => {
    <Modal
      open={this.state.showModal}
      onClose={() => this.setState({ showModal: false })}
    >
      <Card>
        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
        <Card.Content>
          <Card.Header>Matthew</Card.Header>
          <Card.Meta>
            <span className='date'>Joined in 2015</span>
          </Card.Meta>
          <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='user' />
            22 Friends
      </a>
        </Card.Content>
      </Card>
    </Modal>
  }

showhappy = (length) =>{
  // let tmp = ""
  // for (let i = 0; i > length ; i++){
  //   tmp = <Image src={cute} />
  // }
  return <Image src={cute} />
}

  showListCards = () => {
    let arr = []
    if (this.state.showModal) {
      if (this.state.filterCard) {
        arr = this.state.filterListCards
      } else {
        arr = this.state.cards
      }
      let tmp = ''
      if (arr.length > 0) {
        tmp = arr.map((card, i) => {
          console.log(card)
          if (!card.hide) {
            let hp = +card.hp
            let damage = card.attacks ? card.attacks.length == 1 ? 50 : card.attacks.length == 2 ? 100 : 0 : 0
            let weak = card.weaknesses?card.weaknesses.length == 1 ? 50 : card.weaknesses.length == 2 ? 100 : 0 :0
            let happy = ((hp / 10) + (damage / 10) + 10 - (weak)) / 5
            return <Card className="cardPoke"> 
              <Image src={card.imageUrl} />
              <Card.Content>
                <Card.Header>{card.name}</Card.Header>
                <Card.Meta>
                  <span className='date'>HP : {hp}</span><br />
                  <span className='date'>WEAK : {weak}</span><br />
                  <span className='date'>STR : {damage}</span><br />
                  <span className='date'>Happiness : {happy}</span><br/>
                  <Image className='happy' src={cute}/>
                  {/* {this.showhappy()} */}
                </Card.Meta>
                {/* <Card.Description></Card.Description> */}
              </Card.Content>
              <Card.Content extra>
                <Button fluid
                  onClick={() => {
                    this.state.myCards.push(card)
                    this.state.cards[i].hide = true
                    // arr.splice(i, 1)
                    // if (this.state.cards.indexOf(card) != -1){
                    //   this.state.cards.splice(this.state.cards.indexOf(card), 1)
                    // }
                    this.setState({ myCards: this.state.myCards, [arr]: this.state[arr], cards: this.state.cards })
                  }}
                >
                  Add
              </Button>

              </Card.Content>
            </Card>
          }
        })
      }
      return tmp
    }
  }

  showMyCards = () => {
    let tmp = ''
    if (this.state.myCards.length > 0) {
      tmp = this.state.myCards.map((card, i) => {
        console.log(card)
        return <Card>
          <Image src={card.imageUrl} />
          <Card.Content>
            <Card.Header>{card.name}</Card.Header>
            <Card.Meta>
              <span className='date'>HP : {card.hp}</span>
            </Card.Meta>
            <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button fluid
              onClick={() => {
                this.state.myCards.splice(i, 1)
                this.state.cards[i].hide = false
                // this.state.cards.push(card)
                this.setState({ myCards: this.state.myCards, cards: this.state.cards })
              }}
            >
              Remove
              </Button>
          </Card.Content>
        </Card>
      })
    }
    return tmp

  }


  search = (input) => {
    if (input.length > 0) {
      // let filter = axios.get(`http://localhost:3030/api/cards?limit=30&name=${}&type={3}`)



      let filteredCards = this.state.cards.filter(card => 
        (card.name.toLowerCase().indexOf(input.toLowerCase()) != -1) || 
        (card.type.toLowerCase().indexOf(input.toLowerCase()) != -1)
        )
      this.setState({
        filterListCards: filteredCards.length > 0 ? filteredCards : [],
        filterCard: filteredCards.length > 0 ? true : false
      })
    } else {
      this.setState({
        filterListCards: [],
        filterCard: false
      })
    }
  }


  render() {
    return (
      <div className="App">
        <div className="inBlock">
          <Button
            fluid
            onClick={() => this.setState({ showModal: true })}
          // onClick={() => this.setState({ showModal: true })} 
          >
            Add
      </Button>
          <Card.Group>
            {this.showMyCards()}
          </Card.Group>

          <Modal
            open={this.state.showModal}
            onClose={() => this.setState({ showModal: false, filterCard: false })}
          >
            <div className="inBlock">
              <Container>
                <Form>
                  <Form.Field>
                    <Input
                      icon={<Icon name='search' inverted circular link />}
                      placeholder='Search...'
                      onChange={(e, { value }) => this.search(value)}
                    />
                  </Form.Field>
                </Form>
                <Card.Group>
                  {this.showListCards()}
                </Card.Group>
              </Container>
            </div>
          </Modal>
        </div>
      </div>
    )
  }
}

export default App

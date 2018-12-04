import React, { Component } from 'react'
import './App.css'
import axios from 'axios'
import { Card, Form, Input, Icon, Button, Modal, Image, Header, Container, Progress} from 'semantic-ui-react'
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

showhappy = (length) =>{
  console.log("showhappy")
  let arr = []
  let tmp = ''
  for(let i = 0; i<length ;i++){
    arr.push(i)
  }
  tmp = arr.map(i=>(
   <Image className='happy' src={cute} />
  ))
  return tmp
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
          if (!card.hide) {
            let hp = +card.hp < 100 ? +card.hp : 100
            let damage = 0
            if (card.attacks) {
              card.attacks.map(card => {
                debugger
                card.damage.trim();
                if (card.damage.indexOf('+') > 0 || card.damage.indexOf('×') > 0){
                  card.damage = card.damage.replace('+','')
                  card.damage = card.damage.replace('×', '')
                }
                damage += +card.damage
              })
            }
            let str = card.attacks ? card.attacks.length == 1 ? 50 : card.attacks.length == 2 ? 100 : 0 : 0
            let weak = card.weaknesses?card.weaknesses.length == 1 ? 100 : 0 :0
            let happy = parseInt(((hp / 10) + (damage / 10) + 10 - (card.weaknesses ? card.weaknesses.length : 0)) / 5)
            // card = { ...card, ...{ hp: hp, weak: weak, str: str, happy: happy }}
            return <Card className="cardPoke"> 
              <Image src={card.imageUrl} />
              <Card.Content>
                <Card.Header>{card.name}</Card.Header>
                <Card.Meta>
                  <span className='date'>HP : 
                   <Progress percent={hp} progress color='orange' style={{ margin: 0 }} />
                  </span><br />
                  <span className='date'>WEAK : 
                  <Progress percent={weak} progress color='orange' style={{ margin: 0 }} />
                  </span><br />
                  <span className='date'>STR : 
                   <Progress percent={str} progress color='orange' style={{ margin: 0 }} />
                  </span><br />
                  <span className='date'>Happiness : </span><br/>
                  <br />
                  <Image.Group size='tiny'>
                    {this.showhappy(happy)}
                  </Image.Group>
                 
                  {/* {this.showhappy()} */}
                </Card.Meta>
                {/* <Card.Description></Card.Description> */}
              </Card.Content>
              <Card.Content extra>
                <Button fluid
                  onClick={() => {
                    this.state.myCards.push({...{ card }, ...{ calculateValue: { hp, damage, str, weak, happy}} })
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
        return <Card className="cardPoke">
          <Image src={card.card.imageUrl} />
          <Card.Content>
            <Card.Header>{card.card.name}</Card.Header>
            <Card.Meta>
              <span className='date'>HP :
                   <Progress percent={card.calculateValue.hp} progress color='orange' style={{ margin: 0 }} />
              </span><br />
              <span className='date'>WEAK :
                  <Progress percent={card.calculateValue.weak} progress color='orange' style={{ margin: 0 }} />
              </span><br />
              <span className='date'>STR :
                   <Progress percent={card.calculateValue.weak} progress color='orange' style={{ margin: 0 }} />
              </span><br />
              <span className='date'>Happiness : </span><br />
              <br />
              <Image.Group size='tiny'>
                {this.showhappy(card.calculateValue.happy)}
              </Image.Group>

              {/* {this.showhappy()} */}
            </Card.Meta>
            {/* <Card.Description></Card.Description> */}
          </Card.Content>
          <Card.Content extra>
            <Button fluid
              onClick={() => {
                this.state.myCards.splice(i, 1)
                this.state.cards[this.state.cards.indexOf(card.card)].hide = false
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
    console.log(this.state)
    return (
      <div className="App">
        <div className="inBlock">
          <Button
            size='massive'
            fluid
            onClick={() => this.setState({ showModal: true })}
            style={{ background: COLORS.Fire, color : "FFF"}}
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
                      style={{ fontSize: '25px'}}
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

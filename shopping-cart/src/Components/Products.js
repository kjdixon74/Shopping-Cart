import React from "react";
import {
  Card,
  Accordion,
  Button,
  Container,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import useDataApi from "../Hooks/useDataAPI";
import apple from "../Images/apple.png";
import beans from "../Images/beans.png";
import cabbage from "../Images/cabbage.png";
import orange from "../Images/orange.png";

// Simulate getting products from Strapi database
const products = [
  { name: "Apples", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage", country: "USA", cost: 1, instock: 8 },
];

function Products(props) {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);

  //  Fetch Data
  const { useState } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data }, doFetch] = useDataApi(query, {
    data: [],
  });
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (index) => {
    let item = items.filter((_, i) => i === index);
    if (item[0].instock === 0) return;
    item[0].instock -= 1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index !== i);
    const deletedItem = cart.filter((item, i) => index === i);
    deletedItem[0].instock += 1;
    setCart(newCart);
  };
  const photos = [apple, orange, beans, cabbage];

  let list = items.map((item, index) => {
    return (
      <li key={index}>
        <Image src={photos[index % 4]} width={70} roundedCircle></Image>
        <Button variant="primary" size="large">
          {item.name}:${item.cost} Stock:
          {item.instock}
        </Button>
        <input
          name={item.name}
          type="submit"
          onClick={() => addToCart(index)}
        ></input>
      </li>
    );
  });

  // From React-Bootstrap
  let CustomToggle = ({ item, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );
    return (
      <button type="button" onClick={decoratedOnClick}>
        {item}
      </button>
    );
  };

  let cartList = cart.map((item, index) => {
    return (
      <Card key={index}>
        <Card.Header>
          <CustomToggle item={item.name} eventKey={1 + index}></CustomToggle>
        </Card.Header>
        <Accordion.Collapse eventKey={1 + index}>
          <Card.Body>
            $ {item.cost} from {item.country}{" "}
            <button
              onClick={() => {
                let result = window.confirm(
                  "Are you sure you want to delete this item from your cart?"
                );
                if (result) {
                  deleteCartItem(index);
                }
                return;
              }}
            >
              Delete
            </button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  const restockProducts = (url) => {
    doFetch(url);

    let newItems = data["data"].map((item) => {
      let { name, country, cost, instock } = item.attributes;
      return { name, country, cost, instock };
    });

    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Product List</h1>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
          <h1>CheckOut </h1>
          <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(query);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
}

export default Products;

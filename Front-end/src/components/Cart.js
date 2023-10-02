import React, {useContext, useEffect} from 'react';
import {Button, ButtonGroup, Card, Col, Container, ListGroup, Row, Spinner} from 'react-bootstrap';
import {ACTIONS, AppContext} from './AppContext';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from "axios";
import 'font-awesome/css/font-awesome.min.css';

function Cart() {
    const navigate = useNavigate();
    const location = useLocation();
    const [verifyingStock, setVerifyingStock] = React.useState(false);
    const message = location.state?.message;
    const [errorMessage, setErrorMessage] = React.useState(null);
    const {
        cart,
        removeFromCart,
        addToCart,
        isLoggedIn,
        dispatch,
        loadingCartOperation,
        clearCart
    } = useContext(AppContext);

    function fetchCart() {
        const token = localStorage.getItem('jwtToken');

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        return axios.get('/cartitem', {headers})
            .then(response => response.data);
    }

    useEffect(() => {
        if (isLoggedIn) {
            fetchCart()
                .then((data) => {
                    dispatch({
                        type: ACTIONS.SET_CART, payload: data
                    });
                })
                .catch((error) => {
                    console.log("Error fetching cart: ", error);
                });
        }
    }, [isLoggedIn]);


    const incrementItemQuantity = (item) => {
        addToCart(item.article ?? item);
    };

    const decrementItemQuantity = (item) => {
        removeFromCart(item.id);
    };


    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const itemTotal = (item.article?.price ?? item.price) * item.quantity * (1 - item.discount / 100);
            return total + itemTotal;
        }, 0);
    };

    const proceedToPayment = () => {
        setVerifyingStock(true);
        setErrorMessage(null);

        if (isLoggedIn) {
            const headers = {Authorization: `Bearer ${localStorage.getItem('jwtToken')}`};

            axios.post('/cart/validate', {}, {headers})
                .then((response) => {
                    if (response.data.status) {
                        navigate('/checkout');
                    } else {
                        setErrorMessage(response.data.message);
                    }
                })
                .catch((error) => {
                    setErrorMessage(error.response?.data?.message || "Une erreur inconnue s'est produite");
                })
                .finally(() => {
                    setVerifyingStock(false);
                });
        } else {
            navigate('/checkout');
        }
    };
    const removeItemFromCart = (itemId) => {
        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            axios.delete(`/cartitem/removeAll/${itemId}`, {headers})
                .then((response) => {
                    dispatch({
                        type: ACTIONS.SET_CART,
                        payload: cart.filter(item => item.id !== itemId)
                    });
                })
                .catch((error) => {
                    console.log("Erreur lors de la suppression : ", error);
                });
        } else {
            dispatch({
                type: ACTIONS.SET_CART,
                payload: cart.filter(item => item.id !== itemId)
            });
        }
    };


    return (
        <Container className="mt-4">
            <h2 className="mb-4">Votre panier</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <Row>
                <Col md={8}>
                    {message && <div className="alert alert-success">{message}</div>}
                    {cart.length === 0 ? (
                        <Card className="mb-4 text-center p-3">
                            <Card.Body>Votre panier est vide</Card.Body>
                        </Card>
                    ) : (
                        cart.map((item, index) => (
                            <Card key={`${item.id}-${index}`} className="mb-4">
                                <Row>
                                    <Col md={4}>
                                        <Link to={`/article/${item.article?.id ?? item.id}`}>
                                            <Card.Img variant="top" src={item.article?.picture ?? item.picture}/>
                                        </Link> </Col>
                                    <Col md={8}>
                                        <Card.Body>
                                            <Link to={`/article/${item.article?.id ?? item.id}`}>
                                                <Card.Title>{item.article?.title ?? item.title}</Card.Title>
                                            </Link>
                                            <Card.Text>{item.article?.content ?? item.content}</Card.Text>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>Prix: {item.article?.price ?? item.price}€</ListGroup.Item>
                                                <ListGroup.Item>Quantité: {item.quantity}</ListGroup.Item>
                                            </ListGroup>
                                            <ButtonGroup className="mt-3">
                                                {item.quantity === 1 ? (
                                                    <Button variant="outline-primary" disabled={loadingCartOperation}
                                                            onClick={() => removeFromCart(item.id)}>
                                                        <i className="fa fa-trash"></i>
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline-primary" disabled={loadingCartOperation}
                                                            onClick={() => decrementItemQuantity(item)}>
                                                        -
                                                    </Button>
                                                )}
                                                <Button variant="outline-primary" disabled={loadingCartOperation}
                                                        onClick={() => incrementItemQuantity(item)}>
                                                    +
                                                </Button>

                                                <Button variant="outline-danger" disabled={loadingCartOperation}
                                                        onClick={() => removeItemFromCart(item.id)}>
                                                    <i className="fa fa-trash"></i> Supprimer l'article
                                                </Button>
                                            </ButtonGroup>
                                        </Card.Body>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Header>Récapitulatif du panier</Card.Header>
                        <ListGroup variant="flush">
                            {cart.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <strong>{item.article?.title}</strong> x {item.quantity} =
                                    {(
                                        (item.article?.price ?? item.price) * item.quantity * (1 - item.discount / 100)
                                    ).toFixed(2)}€
                                    {item.discount > 0 && <span className="text-danger ml-2">-{item.discount}%</span>}
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h5 className="mb-0">
                                    <strong>Total : {getTotalPrice().toFixed(2)}€</strong>
                                </h5>
                            </ListGroup.Item>
                        </ListGroup>
                        {cart.length > 0 && (
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button variant="primary" className="mt-3 mb-3 w-50"
                                            onClick={proceedToPayment}
                                            disabled={loadingCartOperation || verifyingStock}>
                                        {verifyingStock ?
                                            <Spinner size="sm" animation="border"/> : 'Procéder au paiement'}
                                    </Button>


                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button variant="danger" className="mt-3 mb-3 w-50" onClick={clearCart}
                                            disabled={loadingCartOperation}>
                                        Vider le panier
                                    </Button>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>


            </Row>
        </Container>
    );
}

export default Cart;

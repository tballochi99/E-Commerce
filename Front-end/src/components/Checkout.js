import React, {useContext, useEffect, useState} from 'react';
import {ACTIONS, AppContext} from './AppContext';
import {Button, Card, Col, Container, Form, ListGroup, Row} from 'react-bootstrap';
import axios from "axios";
import StripePayment from "./StripePayment";
import PaymentPopup from "./PaymentPopup";
import {useNavigate} from 'react-router-dom';

function Checkout() {
    const {isLoggedIn, cart, dispatch} = useContext(AppContext);
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [showStripePayment, setShowStripePayment] = useState(false);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [country, setCountry] = useState('');
    const [countryName, setCountryName] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [shippingCost, setShippingCost] = useState(0);
    const [selectedLivraison, setSelectedLivraison] = useState(null);
    const [livraisons, setLivraisons] = useState([]);
    const [IsCharge, setIsCharge] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);


    useEffect(() => {
        fetchLivraisons();
    }, []);

    useEffect(() => {
        if (countryName && livraisons) {
            const savedCountry = livraisons.find(livraison => livraison.pays == countryName);
            if (savedCountry) {
                setCountry(savedCountry);
                setSelectedLivraison(savedCountry);
            }
        }
    }, [countryName, livraisons]);

    useEffect(() => {
        const countryCost = livraisons?.find((l) => l.id == country)?.prix;
        setShippingCost(selectedLivraison?.prix ?? countryCost ?? 0);
    }, [selectedLivraison, country, livraisons])

    useEffect(() => {
        const savedSaveAddress = localStorage.getItem('saveAddress');
        setSaveAddress(savedSaveAddress === 'true');
    }, [isLoggedIn]);

    const handleSelectLivraison = (e) => {
        const selectedCountry = e.target.value;
        const selectedLivraisonObject = livraisons.find(livraison => livraison.id == selectedCountry);
        setSelectedLivraison(selectedLivraisonObject);
        setCountry(selectedLivraisonObject);
    };


    const fetchLivraisons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/livraison`, {});
            setLivraisons(response.data);
        } catch (error) {
            setError('Erreur lors du chargement des livraisons.');
            console.error(error);
        }
    };

    const createOrder = async () => {
        const token = isLoggedIn ? localStorage.getItem('jwtToken') : null
        const headers = token ? {Authorization: `Bearer ${token}`} : {};

        const data = {
            totalPrice: getTotalPrice(),
            status: 'en attente',
            shippingAddress: `${address}, ${city}, ${zipcode}, ${country.pays}`,
            paymentMethod: 'Carte bancaire',
            notes: deliveryNotes,
            cart
        };

        try {
            const response = await axios.post('/order/create', data, {headers});
            if (response.data.message === 'Commande créée avec succès') {
                clearCart();
                if (isLoggedIn) {
                    navigate('/orders', {state: {message: 'Commande effectuée'}});
                } else {
                    navigate('/cart', {state: {message: 'Commande effectuée'}});
                }
            } else {
                console.error("Une erreur est survenue lors de la création de la commande");
                setError("Une erreur est survenue lors de la création de la commande");
            }
        } catch (error) {
            console.error("Erreur lors de la création de la commande:", error);
            setError("Erreur lors de la création de la commande");
        }
    };


    const handleCheckout = () => {
        if (!address || !city || !zipcode) {
            setValidationError("Veuillez remplir tous les champs d'adresse avant de procéder.");
            return;
        }
        setValidationError(null);
        if (!isLoggedIn) {
            setShowPaymentPopup(true);
        } else {
            setShowStripePayment(true);
        }
    };


    const handleGuestCheckout = () => {
        setShowPaymentPopup(false);
        setShowStripePayment(true);
    };

    const getTotalPrice = () => {
        const totalWeight = getTotalWeight();
        const totalPrice = cart.reduce((total, item) => {
            const itemTotal = (item.article?.price ?? item.price) * item.quantity * (1 - item.discount / 100);
            return total + itemTotal;
        }, 0) + shippingCost;

        if (totalWeight > 5) {
            return (totalPrice + 10).toFixed(2);
        }
        return totalPrice.toFixed(2);
    };

    useEffect(() => {
        if (isLoggedIn) {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
            fetchAddress();
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [isLoggedIn]);


    const fetchAddress = async () => {
        try {
            const response = await axios.get('/address');
            setAddress(response.data.address || '');
            setCity(response.data.city || '');
            setZipcode(response.data.zipcode || '');
            setCountryName(response.data.country);
            setSaveAddress(Boolean(response.data.savedAddress));
        } catch (error) {
            console.error("There was a problem fetching the user's address:", error.response ? error.response.data : error.message);
        }
    };


    const getTotalWeight = () => {
        return cart.reduce((totalWeight, item) => {
            return totalWeight + (item.article?.weight ?? 0) * item.quantity;
        }, 0);
    };


    const handleSaveAddressChange = (e) => {
        const newSaveAddress = e.target.checked;
        setSaveAddress(newSaveAddress);
        saveUserAddress(newSaveAddress);
    };

    const saveUserAddress = async (newSaveAddress) => {
        setIsCharge(true);
        setSaveStatus(null);
        try {
            await axios.post('/address/save', {
                address: address,
                city: city,
                zipcode: zipcode,
                country: country.pays,
                savedAddress: newSaveAddress ? address : null
            });
            setSaveStatus('success');
            setIsCharge(false);
        } catch (error) {
            console.error("There was a problem saving the user's address:", error);
            setSaveStatus('error');
        }
    };

    const clearCart = async () => {
        try {
            if (isLoggedIn) {
                const token = localStorage.getItem('jwtToken');
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                const response = await axios.post('/cart/clear', {}, {headers});
                if (response.data.message === 'Panier vidé') {
                    dispatch({type: ACTIONS.CLEAR_CART});
                } else {
                    console.error("Une erreur est survenue lors du vidage du panier:", response.data.message);
                }
            } else {
                localStorage.removeItem('cart');
                dispatch({type: ACTIONS.CLEAR_CART});
            }
        } catch (error) {
            console.error("Erreur lors du vidage du panier:", error.response ? error.response.data : error.message);
        }
    };


    const handleSuccessfulPayment = () => {
        if (!address || !city || !zipcode) {
            setValidationError("Veuillez vous assurer que tous les champs d'adresse sont bien remplis.");
            return;
        }
        createOrder();
    };

    return (
        <Container className="mb-4">
            <h2>Finaliser la commande</h2>
            <Row className="align-items-start">
                <Col lg={8}>
                    <Card className="h-100">
                        <Card.Header>Récapitulatif de la commande</Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {cart.map((item, index) => (
                                    <ListGroup.Item key={index}>
                                        <strong>{item.article?.title ?? item.title}</strong> x {item.quantity} ={" "}
                                        {item.discount > 0 &&
                                            <del
                                                style={{marginRight: '10px'}}>{((item.article?.price ?? item.price) * item.quantity).toFixed(2)}€</del>
                                        }
                                        {(
                                            (item.article?.price ?? item.price) * item.quantity * (1 - item.discount / 100)
                                        ).toFixed(2)}€
                                        {item.discount > 0 &&
                                            <span className="text-danger ml-2">-{item.discount}%</span>}
                                    </ListGroup.Item>
                                ))}


                                {shippingCost > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>
                                                <strong>Coût de la livraison</strong>
                                            </Col>
                                            <Col>
                                                {shippingCost.toFixed(2)} €
                                                {cart.some(item => item.article?.weight > 5) && (
                                                    <span> (+{getTotalWeight() > 5 ? "10" : "0"} € en fonction du poids)</span>
                                                )}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <strong>Total : {getTotalPrice()} €</strong>
                                </ListGroup.Item>
                            </ListGroup>
                            <div className="d-grid gap-3 mt-3">
                                <Button variant="primary" onClick={handleCheckout}>
                                    Procéder au paiement
                                </Button>

                                {validationError &&
                                    <div className="alert alert-danger">{validationError}</div>}
                                {error &&
                                    <div className="alert alert-danger">{error}</div>}
                            </div>
                            <div className="payment-section mt-3">
                                {showStripePayment && (
                                    <div className="stripe-wrapper">
                                        <StripePayment
                                            onSuccess={handleSuccessfulPayment}/>
                                    </div>
                                )}
                                {showPaymentPopup && (
                                    <div className="payment-popup-wrapper">
                                        <PaymentPopup
                                            show={showPaymentPopup}
                                            onHide={() => setShowPaymentPopup(false)}
                                            onGuestCheckout={handleGuestCheckout}
                                        />
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="mt-3 h-100">
                        <Card.Header>Adresse de livraison</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pays</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedLivraison ? selectedLivraison.id : country.id}
                                        onChange={handleSelectLivraison}
                                    >
                                        <option value="" disabled>Sélectionner une option</option>
                                        {livraisons.map((livraison) => (
                                            <option key={livraison.id} value={livraison.id}>
                                                {livraison.pays} {livraison.mode === 1 ? " (Standard)" : " (Rapide)"}
                                            </option>
                                        ))}
                                    </Form.Control>

                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Adresse</Form.Label>
                                    <Form.Control type="text" value={address}
                                                  onChange={(e) => setAddress(e.target.value)}/>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Code postal</Form.Label>
                                    <Form.Control type="text" value={zipcode}
                                                  onChange={(e) => setZipcode(e.target.value)}/>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Ville</Form.Label>
                                    <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Form.Label>Notes pour la livraison</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={deliveryNotes}
                                        onChange={(e) => setDeliveryNotes(e.target.value)}
                                        placeholder="Instructions spécifiques, préférences, etc."
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Coût de livraison</Form.Label>
                                    <div>
                                        {shippingCost.toFixed(2)} €
                                        {cart.some(item => item.article?.weight > 5) && (
                                            <span> (+{shippingCost > 0 && getTotalWeight() > 5 ? "10" : "0"} € en fonction du poids)</span>
                                        )}
                                    </div>
                                </Form.Group>
                                {isLoggedIn && (
                                    <Form.Group className="mb-3">
                                        <Button variant="primary" onClick={handleSaveAddressChange} disabled={IsCharge}>
                                            {IsCharge ? 'Chargement...' : 'Sauvegarder'}
                                        </Button>
                                        {saveStatus === 'success' &&
                                            <div className="mt-2 text-success">Adresse sauvegardée avec succès.</div>}
                                        {saveStatus === 'error' &&
                                            <div className="mt-2 text-danger">Erreur lors de la sauvegarde de
                                                l'adresse.</div>}
                                    </Form.Group>

                                )}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Checkout;

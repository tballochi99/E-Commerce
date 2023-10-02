import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, ListGroup, Row, Spinner} from 'react-bootstrap';
import axios from 'axios';
import {useLocation} from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const location = useLocation();
    const message = location.state?.message;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get('/order', {
            headers: {'Authorization': `Bearer ${token}`}
        })
            .then(response => {
                const formattedOrders = response.data.map(order => {
                    const parsedArchivedCartItems = JSON.parse(order.archived);
                    return {
                        orderId: order.id,
                        orderDate: order.orderDate,
                        status: order.status,
                        price: order.totalPrice + '€',
                        shippingAddress: order.shippingAddress,
                        paymentMethod: order.paymentMethod,
                        deliveryNotes: order.notes,
                        archivedCartItems: parsedArchivedCartItems,
                        userFirstName: order.userFirstName,
                        userLastName: order.userLastName
                    };
                });
                setOrders(formattedOrders);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des commandes:', error);
                setIsLoading(false);
            });
    }, []);


    const handlePrint = (order) => {
        const printWindow = window.open('', '_blank');
        const archivedItemsHtml = order.archivedCartItems.map((item, i) => `
        <p><strong>Article ${i + 1}:</strong> ${item.article.title} - Quantité : ${item.quantity}</p>
    `).join('');
        printWindow.document.open();
        printWindow.document.write(`
        <html>
            <head>
                <title>Facture n°${order.orderId}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        padding: 20px;
                        margin: 15px;
                        border: 1px solid #ddd;
                    }
                    h1 {
                        color: #333366;
                        border-bottom: 1px solid #666;
                    }
                    h2 {
                        color: #444;
                    }
                    p {
                        margin: 10px 0;
                        padding: 4px;
                        line-height: 1.6;
                    }
                    .header {
                        background-color: #f4f4f4;
                        text-align: center;
                        padding: 10px;
                    }
                    .logo {
                        max-width: 100px;
                        margin: 0 auto;
                    }
                    .footer {
                        border-top: 2px solid #444;
                        background-color: #f4f4f4;
                        text-align: center;
                        padding: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Omega Gaming</h1>
                </div>
              <div class="container">
                    <h2>Facture n°${order.orderId}</h2>
                    <p><strong>Nom du client :</strong> ${order.userFirstName} ${order.userLastName}</p> 
                    <p><strong>Date de commande :</strong> ${order.orderDate}</p>
                    <p><strong>Prix :</strong> ${order.price}</p>
                    <p><strong>Statut :</strong> ${order.status}</p>
                    <p><strong>Méthode de paiement :</strong> ${order.paymentMethod}</p>
                    <p><strong>Adresse de livraison :</strong> ${order.shippingAddress}</p>
                    <p><strong>Notes de livraison :</strong> ${order.deliveryNotes}</p>
                    ${archivedItemsHtml} 
                </div>
                <div class="footer">
                    <p>Merci pour votre achat !</p>
                </div>
            </body>
        </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };


    if (isLoading) {
        return (
            <div className="full-page-spinner">
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        );
    }
    return (
        <Container>
            <h1 className="mb-4">Mes commandes</h1>
            {message && <div className="alert alert-success">{message}</div>}
            {orders.length === 0 ? (
                <div>Pas de commandes</div>
            ) : (
                orders.map((order, index) => (
                    <Card key={index} className="mb-4 shadow">
                        <Card.Header>
                            <Row>
                                <Col md={6}>Numéro de commande : {order.orderId}</Col>
                                <Col md={6} className="text-right">Date de commande : {order.orderDate}</Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <strong>Prix :</strong> {order.price}
                                </Col>
                                <Col md={4}>
                                    <strong>Statut :</strong> {order.status}
                                </Col>
                                <Col md={4}>
                                    <strong>Méthode de paiement :</strong> {order.paymentMethod}
                                </Col>
                            </Row>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Adresse de livraison :</strong> {order.shippingAddress}
                                </ListGroup.Item>
                                <ListGroup.Item><strong>Notes de livraison :</strong> {order.deliveryNotes}
                                </ListGroup.Item>
                            </ListGroup>
                            <ListGroup variant="flush">
                                {order.archivedCartItems && order.archivedCartItems.length > 0 ? (
                                    order.archivedCartItems.map((item, i) => (
                                        <ListGroup.Item key={i}>
                                            <strong>{item.article.title}</strong> - Quantité : {item.quantity}
                                        </ListGroup.Item>
                                    ))
                                ) : (
                                    <ListGroup.Item>Aucun article dans cette commande</ListGroup.Item>
                                )}
                            </ListGroup>
                            <Button variant="primary" onClick={() => handlePrint(order)}>Imprimer</Button>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default Orders;

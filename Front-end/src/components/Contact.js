import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';

const Contact = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h1>Contactez-nous</h1>
                            </Card.Title>
                            <div>
                                <Row className="mb-3">
                                    <Col xs={12} md={4}>
                                        <strong>Email :</strong>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        contact@ogaming.com
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row className="mb-3">
                                    <Col xs={12} md={4}>
                                        <strong>Téléphone :</strong>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        +33 1 23 45 67 89
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col xs={12} md={4}>
                                        <strong>Adresse :</strong>
                                    </Col>
                                    <Col xs={12} md={8}>
                                        123 rue de Techville, Marseille, France
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Contact;

import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';

const About = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="mb-4 shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h1>À propos de nous</h1>
                            </Card.Title>
                            <Card.Text className="text-justify">
                                Fondée en 2020, ΩGAMING est une entreprise spécialisée dans la vente de produits tech de
                                haute qualité.
                            </Card.Text>
                            <Card.Text className="text-justify">
                                Notre mission est de rendre le gaming et l'informatique accessibles à tous en offrant
                                une gamme complète de produits qui combinent qualité, performance et prix abordable.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4 shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h2>Notre vision</h2>
                            </Card.Title>
                            <Card.Text className="text-justify">
                                Devenir le leader mondial dans la distribution de produits tech en mettant l'accent sur
                                l'innovation, la qualité et le service client.
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h2>Nos valeurs</h2>
                            </Card.Title>
                            <div>
                                <ul>
                                    <li>Intégrité et honnêteté</li>
                                    <li>Qualité supérieure</li>
                                    <li>Innovation constante</li>
                                    <li>Satisfaction du client</li>
                                </ul>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default About;

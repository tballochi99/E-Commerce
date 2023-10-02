import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';

const CGV = () => {
    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">
                                <h1>Conditions Générales de Vente</h1>
                            </Card.Title>
                            <div className="mb-4">
                                <h3><strong>Article 1 : Objet</strong></h3>
                                <p>Les présentes CGV régissent les ventes de produits effectuées par ΩGAMING.</p>
                            </div>
                            <div className="mb-4">
                                <h3><strong>Article 2 : Prix</strong></h3>
                                <p>Les prix de nos produits sont indiqués en euros toutes taxes comprises.</p>
                            </div>
                            <div className="mb-4">
                                <h3><strong>Article 3 : Paiement</strong></h3>
                                <p>Le paiement s'effectue par carte bancaire ou virement bancaire.</p>
                            </div>
                            <div className="mb-4">
                                <h3><strong>Article 4 : Livraison</strong></h3>
                                <p>Les produits sont livrés à l'adresse indiquée par le client dans un délai de 5 jours
                                    ouvrables.</p>
                            </div>
                            <div className="mb-4">
                                <h3><strong>Article 5 : Retours et remboursements</strong></h3>
                                <p>Les retours sont acceptés dans un délai de 14 jours suivant la réception du
                                    produit.</p>
                            </div>
                            <div className="mb-4">
                                <h3><strong>Article 6 : Garantie</strong></h3>
                                <p>Tous nos produits sont garantis pour une période de 24 mois à compter de la date
                                    d'achat.</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CGV;

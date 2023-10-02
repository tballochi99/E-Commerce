import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start">
            <Container className="p-4">
                <Row>
                    <Col lg={6} md={12} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase">ΩGAMING</h5>
                        <p>
                            Découvrez notre large gamme de produits tech innovants. Du gaming à l'informatique, nous
                            avons tout ce dont vous avez besoin.
                        </p>
                    </Col>
                    <Col lg={3} md={6} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase">Liens utiles</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="/about" className="text-dark">À propos de nous</a>
                            </li>
                            <li>
                                <a href="/contact" className="text-dark">Contact</a>
                            </li>
                            <li>
                                <a href="/cgv" className="text-dark">CGV</a>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={3} md={6} className="mb-4 mb-md-0">
                        <h5 className="text-uppercase mb-0">Réseaux sociaux</h5>
                        <ul className="list-unstyled">
                            <li>
                                <a href="https://fr-fr.facebook.com/" target="_blank" className="text-dark">Facebook</a>
                            </li>
                            <li>
                                <a href="https://twitter.com/?lang=fr" target="_blank" className="text-dark">Twitter</a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/" target="_blank" className="text-dark">Instagram</a>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
            <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
                © 2023 ΩGAMING. Tous droits réservés.
            </div>
        </footer>
    );
}

export default Footer;

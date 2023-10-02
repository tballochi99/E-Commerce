import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        gender: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (token) {
            navigate('/');
        }
    }, []);
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        axios
            .post(`${process.env.REACT_APP_API_URL}/register`, formData)
            .then((response) => {
                navigate("/login");
                setLoading(false);

            })
            .catch((error) => {
                setError(
                    "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
                );
                setLoading(false);

            });
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Card className="p-4">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Inscription</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formGender" className="mb-3">
                                    <Form.Label>Genre</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Sélectionnez votre genre --</option>
                                        <option value="Male">Homme</option>
                                        <option value="Female">Femme</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formFirstname" className="mb-3">
                                    <Form.Label>Prénom</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Prénom"
                                        name="firstname"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formLastname" className="mb-3">
                                    <Form.Label>Nom de famille</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nom de famille"
                                        name="lastname"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEmail" className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Entrer votre email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPassword" className="mb-4">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Mot de passe"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Chargement...' : ' S\'inscrire'}
                                    </Button>
                                </div>
                                {error && <p className="error">{error}</p>}
                            </Form>
                        </Card.Body>
                        <div className="mt-3 text-center">
                            <p>Déjà un compte ? <a href="/login">Connectez-vous</a></p>
                        </div>
                    </Card>

                </Col>
            </Row>
            <div style={{marginBottom: "2rem"}}/>
        </Container>
    );
};

export default Register;

import React, {useContext, useEffect, useState} from "react";
import {AppContext} from "./AppContext";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import jwt_decode from "jwt-decode";

const Login = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const sessionExpired = new URLSearchParams(location.search).get("sessionExpired");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {setIsLoggedIn, setIsAdmin, setUserId} = useContext(AppContext);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (token) {
            navigate('/');
        }
    }, []);
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
        setError(null);
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const data = {
            username: formData.email,
            password: formData.password,
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/login`, data)
            .then((response) => {
                localStorage.setItem("jwtToken", response.data.token);
                const decodedToken = jwt_decode(response.data.token);
                setIsAdmin(decodedToken.roles.includes("ROLE_ADMIN"));
                setIsLoggedIn(true);
                setUserId(decodedToken.userId);
                navigate("/");
                setLoading(false);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.detail || "Une erreur est survenue lors de la connexion. Veuillez réessayer.";
                setError(errorMessage);
                setLoading(false);
            });
    };

    return (
        <Container className="mt-5 mb-5">
            {sessionExpired && (
                <p className="error">Votre session a expiré. Veuillez vous reconnecter.</p>
            )}
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <Card className="p-4">
                        <Card.Body>
                            <Card.Title className="mb-4 text-center">Connexion</Card.Title>
                            {error && <p className="error">{error}</p>}
                            <Form onSubmit={handleSubmit}>
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
                                        {loading ? 'Chargement...' : 'Se connecter'}
                                    </Button>
                                </div>
                            </Form>
                            <div className="mt-4 text-center">
                                <p>
                                    Vous n'avez pas de compte ?{" "}
                                    <Button variant="link" onClick={() => navigate('/register')}>
                                        Inscrivez-vous
                                    </Button>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
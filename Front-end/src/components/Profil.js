import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Container, Form, Row, Spinner} from "react-bootstrap";

const Profil = () => {
    const [userData, setUserData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [isEditing, setEditing] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        axios
            .get(`${process.env.REACT_APP_API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUserData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération des informations utilisateur:",
                    error
                );
                setLoading(false);
            });
    }, []);

    const handleUpdate = () => {
        const token = localStorage.getItem("jwtToken");

        axios
            .put(`${process.env.REACT_APP_API_URL}/profile/update`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                setEditing(false);
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour du profil:", error);
            });
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
        <Container className="mt-5 mb-5">
            <Card>
                <Card.Header className="text-center bg-primary text-white">Mon Profil</Card.Header>
                <Card.Body>
                    {isEditing ? (
                        <Form>
                            <Row className="mb-3">
                                <Col sm={6}>
                                    <h5>Informations Personnelles</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Genre</Form.Label>
                                        <Form.Select value={userData.gender} onChange={(e) => setUserData({
                                            ...userData,
                                            gender: e.target.value
                                        })}>
                                            <option value="male">Homme</option>
                                            <option value="female">Femme</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Prénom</Form.Label>
                                        <Form.Control type="text" value={userData.firstname} placeholder="Prénom"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          firstname: e.target.value
                                                      })}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nom de famille</Form.Label>
                                        <Form.Control type="text" value={userData.lastname} placeholder="Nom de famille"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          lastname: e.target.value
                                                      })}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" value={userData.email} placeholder="Email"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          email: e.target.value
                                                      })}/>
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <h5>Adresse</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Adresse</Form.Label>
                                        <Form.Control type="text" value={userData.address || ""} placeholder="Adresse"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          address: e.target.value
                                                      })}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Code postal</Form.Label>
                                        <Form.Control type="text" value={userData.zipcode || ""}
                                                      placeholder="Code postal"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          zipcode: e.target.value
                                                      })}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ville</Form.Label>
                                        <Form.Control type="text" value={userData.city || ""} placeholder="Ville"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          city: e.target.value
                                                      })}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Pays</Form.Label>
                                        <Form.Control type="text" value={userData.country || ""} placeholder="Pays"
                                                      onChange={(e) => setUserData({
                                                          ...userData,
                                                          country: e.target.value
                                                      })}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" size="lg" onClick={handleUpdate}>Mettre à jour</Button>
                        </Form>

                    ) : (
                        <Row className="mb-3">
                            <Col sm={6}>
                                <Card bg="light" border="primary">
                                    <Card.Header as="h5" className="bg-primary text-white">Informations
                                        Personnelles</Card.Header>
                                    <Card.Body>
                                        <p><strong>Genre
                                            :</strong> {userData.gender === 'male' ? 'Homme' : userData.gender === 'female' ? 'Femme' : userData.gender}
                                        </p>
                                        <p><strong>Prénom :</strong> {userData.firstname}</p>
                                        <p><strong>Nom de famille :</strong> {userData.lastname}</p>
                                        <p><strong>Email :</strong> {userData.email}</p>
                                    </Card.Body>
                                </Card>

                            </Col>
                            <Col sm={6}>
                                <Card bg="light" border="primary">
                                    <Card.Header as="h5" className="bg-primary text-white">Adresse</Card.Header>
                                    <Card.Body>
                                        <p><strong>Ville :</strong> {userData.city || "Non spécifié"}</p>
                                        <p><strong>Adresse :</strong> {userData.address || "Non spécifié"}</p>
                                        <p><strong>Code postal :</strong> {userData.zipcode || "Non spécifié"}</p>
                                        <p><strong>Pays :</strong> {userData.country || "Non spécifié"}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                    )}
                    <div className="my-3">
                        <Button
                            onClick={() => setEditing(!isEditing)}
                            variant={isEditing ? "secondary" : "primary"}
                            className="me-3"
                        >
                            {isEditing ? "Annuler" : "Modifier le profil"}
                        </Button>
                    </div>


                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profil;

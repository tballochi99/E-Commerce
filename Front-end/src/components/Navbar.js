import React, {useContext, useEffect, useState} from "react";
import {Button, Container, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {AppContext} from "./AppContext";
import {useNavigate} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {motion} from "framer-motion";
import axios from 'axios';

const NavigationBar = () => {
    const {isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, userId, logout} =
        useContext(AppContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);
    const [userFirstName, setUserFirstName] = useState(null);
    const [userLastName, setUserLastName] = useState(null);
    const token = localStorage.getItem("jwtToken");


    useEffect(() => {
        if (isLoggedIn && token) {
            axios.get(`${process.env.REACT_APP_API_URL}/user/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                .then(response => {
                    setUserFirstName(response.data.firstname);
                    setUserLastName(response.data.lastname);
                })
                .catch(error => {
                    console.log('Erreur lors de la récupération des données de l\'utilisateur :', error);
                });
        }
    }, [isLoggedIn, userId]);

    const handleCloseModal = () => setShowModal(false);

    const handleLogout = () => {
        setShowModal(true);
    };

    const handleConfirmedLogout = () => {
        logout();
        navigate("/");
        handleCloseModal();
    };

    const {totalQuantity} = useContext(AppContext);


    return (
        <Navbar
            expand="lg"
            collapseOnSelect
            className="h-20 border-blue-500 sticky top-0 z-10 backdrop-blur-md backdrop-opacity-100 mt-10 mb-4"
        >
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <motion.h1
                            className="font-mono font-bold text-3xl"
                            initial={{x: -200}}
                            animate={{x: 0}}
                            transition={{
                                duration: "1",
                                delay: "1",
                            }}
                        >
                            ΩGAMING
                        </motion.h1>
                        <motion.p
                            className="font-extrabold font-mono text-transparent italic text-xs bg-clip-text bg-gradient-to-r from-blue-500 to-black"
                            initial={{x: -400}}
                            animate={{x: 0}}
                            transition={{
                                duration: "1",
                                delay: "1",
                            }}
                        >
                            Libérez votre potentiel de jeu
                        </motion.p>
                    </Navbar.Brand>
                </LinkContainer>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <LinkContainer to="/category">
                            <Nav.Link
                                className="text-black hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold hover:text-blue-500">
                                <i className="fas fa-list-ul"></i> Catégories
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/nouveaute">
                            <Nav.Link
                                className="text-black hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold hover:text-blue-500">
                                <i className="fas fa-star"></i> Nouveauté
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/promotions">
                            <Nav.Link
                                className="text-black hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold hover:text-blue-500">
                                <i className="fas fa-tags"></i> Promotions
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/cart">
                            <Nav.Link
                                className="text-black flex justify-center gap-1 items-center hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold hover:text-blue-500">
                                <i className="fas fa-shopping-cart"></i> Panier {totalQuantity > 0 && `(${totalQuantity})`}
                            </Nav.Link>
                        </LinkContainer>
                        {isAdmin && (
                            <>
                                <NavDropdown
                                    title={
                                        <>
                                            <i className="fas fa-cogs"></i> Admin
                                        </>
                                    }
                                    id="basic-nav-dropdown"
                                    className="text-white hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold"
                                >
                                    <LinkContainer to="/admin/create-article">
                                        <NavDropdown.Item>Créer un article</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider/>
                                    <LinkContainer to="/admin/article">
                                        <NavDropdown.Item>Modifier article</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider/>
                                    <LinkContainer to="/admin/category">
                                        <NavDropdown.Item>Modifier catégories</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider/>
                                    <LinkContainer to="/admin/subcategory">
                                        <NavDropdown.Item>Modifier sous catégories</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider/>
                                    <LinkContainer to="/admin/shipping">
                                        <NavDropdown.Item>Modifier coût livraison</NavDropdown.Item>
                                    </LinkContainer>

                                </NavDropdown>
                            </>
                        )}
                        {isLoggedIn ? (
                            <>
                                <NavDropdown
                                    title={
                                        <>
                                            {
                                                (userFirstName) ?
                                                    <><i
                                                        className="fas fa-user-circle"></i> {`Bonjour, ${userFirstName} ${userLastName ?? ""}`}</> :
                                                    <><i className="fas fa-user-circle"></i> Bonjour</>
                                            }
                                        </>
                                    }
                                    id="basic-nav-dropdown"
                                    className="text-white hover:underline-offset-1 hover:underline hover:decoration-zinc-950 hover:font-bold"
                                >
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profil</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/orders">
                                        <NavDropdown.Item>Mes commandes</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider/>
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Se déconnecter
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link
                                        className="text-black hover:underline-offset-1  hover:decoration-zinc-950 hover:font-bold hover:w-fit hover:bg-blue-500 hover:text-white hover:rounded-lg duration-500 hover:ml-3 hover:mr-3">
                                        <i className="fas fa-sign-in-alt"></i> Bonjour, identifiez-vous
                                    </Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleConfirmedLogout}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </Navbar>
    );
};

export default NavigationBar;


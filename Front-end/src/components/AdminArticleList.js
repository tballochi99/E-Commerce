import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Button, Card, Col, Container, Modal, Pagination, Row, Spinner} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {AppContext} from "./AppContext";
import {useDebounce} from "@uidotdev/usehooks";

function AdminArticleList() {
    const {isAdmin} = useContext(AppContext);
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);
    const limit = 12;
    const [showModal, setShowModal] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const token = localStorage.getItem('jwtToken');

    const fetchArticles = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/article?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setArticles(response.data.items);
                setPagesCount(response.data.pages_count);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };
    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch();
        } else {
            fetchArticles();
        }
    }, [debouncedSearchTerm]);


    useEffect(() => {
        fetchArticles();
    }, [page]);

    if (!isAdmin) {
        return <div>Vous n'avez pas l'autorisation d'accéder à cette page.</div>;
    }
    const nextPage = () => {
        if (page < pagesCount) {
            setPage(page + 1);
            window.scrollTo(0, 0);
        }
    };


    const prevPage = () => {
        setPage(page - 1);
        window.scrollTo(0, 0);
    };


    const confirmDelete = () => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}/article/${articleToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                fetchArticles();
            })
            .catch((error) => {
                console.error(error);
            });
        closeModal();
    };


    const openModal = (id) => {
        setArticleToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setArticleToDelete(null);
        setShowModal(false);
    };

    const handleSearch = () => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/article/search?name=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setArticles(response.data);
            })
            .catch((error) => {
                console.error(error);
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
        <Container className="py-5">
            <Row className="mb-4">
                <Col md={8}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher par titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
                {/*<Col md={4}>*/}
                {/*    <button className="btn btn-primary" onClick={handleSearch}>Rechercher</button>*/}
                {/*</Col>*/}
            </Row>
            <Row className="justify-content-center">
                {articles.map((article, index) => (
                    <Col md={3} className="mb-4" key={article.id ? article.id : index}>
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                src={article.picture}
                                style={{objectFit: "cover", height: "200px"}}
                            />
                            <Card.Body>
                                <Card.Title>{article.title}</Card.Title>
                                <Card.Text>{article.content.slice(0, 20)}...</Card.Text>
                                <div className="d-flex justify-content-between">
                                    <Link to={`/article/${article.id}`}>
                                        <button className="btn btn-primary">
                                            Voir
                                        </button>
                                    </Link>
                                    <button onClick={() => openModal(article.id)} className="btn btn-danger">
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>

                                    <Link to={`/admin/article/${article.id}`}>
                                        <button className="btn btn-info">
                                            <FontAwesomeIcon icon={faPenToSquare}/>
                                        </button>
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="mt-3">
                <Col className="center-pagination">
                    <Pagination>
                        <Pagination.Prev disabled={page === 1} onClick={prevPage}/>
                        <Pagination.Item>{page}</Pagination.Item>
                        <Pagination.Next onClick={nextPage} disabled={page === pagesCount}/>
                    </Pagination>
                </Col>
            </Row>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Êtes-vous sûr de vouloir supprimer cet article ?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Annuler
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Supprimer
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );

}

export default AdminArticleList;

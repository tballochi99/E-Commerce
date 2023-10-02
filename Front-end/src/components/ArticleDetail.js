import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Alert, Breadcrumb, Button, Card, Col, Container, ListGroup, Row, Spinner} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import {AppContext} from './AppContext';

function ArticleDetail() {
    const [article, setArticle] = useState({});
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();
    const navigate = useNavigate();
    const discountedPrice = article.price - (article.price * (article.discount / 100));
    const [categoryName, setCategoryName] = useState("");
    const [subCategory, setSubCategory] = useState("");

    useEffect(() => {
    }, [categoryName]);

    const {loadingCartOperation} = useContext(AppContext);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/article/${id}`)
            .then(response => {
                setArticle(response.data);
                setCategoryName(response.data.sub_category.category.name);
                setSubCategory(response.data.sub_category.name);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setError("Une erreur s'est produite lors de la récupération des données.");
                setIsLoading(false);
            });
    }, [id]);


    const {addToCart} = useContext(AppContext);
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: 'Découvrez cet article !',
                url: window.location.href
            }).then(() => {
                // console.log('Article partagé avec succès');
            }).catch((error) => {
                console.error('Quelque chose a mal tourné lors du partage', error);
            });
        } else {
            console.log('Partage non supporté');
        }
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

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container className="mt-4">
            <Row className="mb-3">
                <Col>
                    <Button className="mb-3" onClick={() => navigate(-1)}>Retour</Button>
                    <h2>Détails de l'article</h2>
                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{to: "/"}}>Accueil</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link}
                                         linkProps={{to: `/category/${article.sub_category.category.id}/subcategories`}}>{categoryName}</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link}
                                         linkProps={{to: `/subcategory/${article.sub_category.id}/articles`}}>{subCategory}</Breadcrumb.Item>
                        <Breadcrumb.Item active>{article.title}</Breadcrumb.Item>
                    </Breadcrumb>

                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    <Card className="mb-4 h-100">
                        <Image src={article.picture} alt={`Image de l'article : ${article.title}`} fluid/>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>
                                <h3>{article.title}</h3>
                            </Card.Title>
                            <Card.Text>
                                {article.content}
                            </Card.Text>
                            <hr/>
                            <ListGroup className="mb-3" variant="flush">
                                <ListGroup.Item>
                                    <h5>Caractéristiques</h5>
                                    {article.features}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Prix:</Col>
                                        <Col>
                                            {article.discount ? (
                                                <>
                                                    <del className="text-muted">{article.price}€</del>
                                                    <strong
                                                        className="text-primary ml-2">{discountedPrice.toFixed(2)}€</strong>
                                                    <span className="text-red-500 ml-2">-{article.discount}%</span>
                                                </>
                                            ) : (
                                                <strong className="text-primary">{article.price}€</strong>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Stock:</Col>
                                        <Col>
                                            <strong className="text-primary">
                                                {article.stock > 0 ? `Il reste ${article.stock} article(s)` : 'Rupture de stock'}
                                            </strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {article.weight !== null && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Poids:</Col>
                                            <Col>
                                                <strong className="text-primary">{article.weight} kg</strong>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>

                            {article.stock > 0 ? (
                                <Button
                                    className="text-white bg-gradient-to-r w-52 mb-1 from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 flex m-auto justify-center transition-all duration-100"
                                    variant="success"
                                    onClick={() => addToCart(article)}
                                    disabled={loadingCartOperation}
                                >
                                    {loadingCartOperation ? 'Chargement...' : 'Ajouter au panier'}
                                </Button>
                            ) : (
                                <Button
                                    variant="secondary"
                                    disabled
                                    className="w-52 mt-1 flex m-auto justify-center"
                                >
                                    Indisponible
                                </Button>
                            )}
                            <Button
                                variant="info"
                                className="w-52 mt-1 flex m-auto justify-center"
                                onClick={handleShare}
                            >
                                Partager
                            </Button>
                            {message && <Alert variant="success">{message}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <div style={{marginBottom: '2rem'}}/>
        </Container>
    );
}

export default ArticleDetail;
